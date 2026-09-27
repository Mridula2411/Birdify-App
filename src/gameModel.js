import { action } from "mobx";
import { emptyProgressForContinent, isQuestionUnlocked, getUnlockedQuestion, TOTAL_QUESTIONS_PER_CONTINENT } from "./gameUtilities";
import { getAllQuestionsForContinent, getQuestionByNumber, getDistractors } from "./birdsLevels";
import { buildChoices } from "./gameUtilities";
import { fetchBirdImage, fetchBirdAudio } from "./birdSource";
import { resolvePromise } from "./resolvePromise";
import { loginWithEmail as authLoginWithEmail, loginWithGoogle as authLoginWithGoogle, configureGoogleSignin } from "./authService";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const model = {

  selectedContinent: null,
  selectedQuestion: null,
  currentQuestionIndex: 0,

  ready: false,
  currentUserId: null,

  progress: {},

  collection: {
    feathers: 0,
    eggs: 0,
    discoveredBirds: {},
  },
  lastDiscoveredBird: null,
  lastLevelPerfectRun: false,

  birdImagePromiseState: { promise: null, data: null, error: null },
  birdAudioPromiseState: { promise: null, data: null, error: null },
  currentChoices: [],

  ensureContinentProgress: action(function ensureContinentProgress(continent) {
    if (!this.progress[continent]) {
      this.progress[continent] = emptyProgressForContinent();
    }
    if (!this.progress[continent].discovered) {
      this.progress[continent].discovered = {};
    }
  }),

  setSelectedContinent: action(function setSelectedContinent(continent) {
    this.selectedContinent = continent;
    this.selectedQuestion = null;
    this.currentQuestionIndex = 0;
    this.lastLevelPerfectRun = false;
    this.ensureContinentProgress(continent);
  }),

  selectQuestion: action(function selectQuestion(gameQuestion) {
    this.ensureContinentProgress(this.selectedContinent);
    const cp = this.progress[this.selectedContinent];
    if (isQuestionUnlocked(cp, gameQuestion)) {
      const question = getQuestionByNumber(this.selectedContinent, gameQuestion);
      if (question) {
        this.selectedQuestion = question;
        this.currentQuestionIndex = 0;
        this.lastLevelPerfectRun = false;
        return true;
      }
    }
    return false;
  }),

  submitAnswer: action(function submitAnswer(selectedAnswer) {
    const question = this.getCurrentQuestion();
    if (!question) {
      return { isCorrect: false, reward: { feathers: 0, eggs: 0 } };
    }
    const isCorrect = selectedAnswer === question.commonName;
    if (!isCorrect) {
      return { isCorrect, reward: { feathers: 0, eggs: 0 } };
    }
    const imageData = this.birdImagePromiseState.data ?? {};
    const reward = this.registerBirdDiscovery(question, imageData.imageUrl ?? null, imageData.wikiExtract ?? "");
    return { isCorrect, reward };
  }),

  registerBirdDiscovery: action(function registerBirdDiscovery(question, imageUrl, wikiExtract) {
    const continent = this.selectedContinent;
    this.ensureContinentProgress(continent);
    const cp = this.progress[continent];
    const discoveredKey = String(question.gameQuestion);
    if (cp.discovered[discoveredKey]) {
      return { feathers: 0, eggs: 0 };
    }
    const birdSummary = {
      gameQuestion: question.gameQuestion,
      commonName: question.commonName,
      scientificName: question.scientificName,
      country: question.country,
      imageUrl,
      wikiExtract,
    };
    cp.discovered[discoveredKey] = birdSummary;
    const globalKey = `${continent}:${discoveredKey}`;
    this.collection.discoveredBirds[globalKey] = birdSummary;
    this.collection.feathers += 1;
    const discoveredCount = Object.keys(this.collection.discoveredBirds).length;
    const eggsEarned = discoveredCount % 3 === 0 ? 1 : 0;
    if (eggsEarned > 0) {
      this.collection.eggs += eggsEarned;
    }
    this.lastDiscoveredBird = birdSummary;
    return { feathers: 1, eggs: eggsEarned };
  }),

  getCollectionSummary() {
    return {
      feathers: this.collection.feathers,
      eggs: this.collection.eggs,
      discoveredBirdsCount: Object.keys(this.collection.discoveredBirds).length,
    };
  },

  nextQuestion: action(function nextQuestion() {}),

  resetQuestion: action(function resetQuestion() {
    this.currentQuestionIndex = 0;
  }),

  getCurrentQuestion() {
    return this.selectedQuestion ?? null;
  },

  getQuestionsForCurrentSession() {
    return this.selectedQuestion ? [this.selectedQuestion] : [];
  },

  isLastQuestion() {
    return true;
  },

  buildCurrentChoices() {
    return this.currentChoices;
  },

  loadQuestionData: action(function loadQuestionData(question) {
    const distractors = getDistractors(this.selectedContinent, question.commonName);
    this.currentChoices = buildChoices(question.commonName, distractors);
    resolvePromise(fetchBirdImage(question.commonName), this.birdImagePromiseState);
    resolvePromise(fetchBirdAudio(question.scientificName), this.birdAudioPromiseState);
  }),

  completeCurrentQuestion: action(function completeCurrentQuestion() {
    const continent = this.selectedContinent;
    this.ensureContinentProgress(continent);
    const cp = this.progress[continent];
    const questionNum = this.selectedQuestion?.gameQuestion;
    if (questionNum != null && questionNum >= getUnlockedQuestion(cp)) {
      cp.unlockedQuestion = questionNum + 1;
    }
  }),

  completeCurrentLevel: action(function completeCurrentLevel() {
    this.completeCurrentQuestion();
  }),

  setLastLevelPerfectRun: action(function setLastLevelPerfectRun(value) {
    this.lastLevelPerfectRun = value;
  }),

  isQuestionUnlocked(continent, gameQuestion) {
    return isQuestionUnlocked(this.progress[continent], gameQuestion);
  },

  isLastQuestionForContinent(continent, gameQuestion) {
    return gameQuestion >= TOTAL_QUESTIONS_PER_CONTINENT;
  },

  getQuestionsCompleted(continent) {
    const cp = this.progress[continent];
    if (!cp) return 0;
    return Object.keys(cp.discovered ?? {}).length;
  },

  getWaypointStatus: action(function getWaypointStatus(continent, gameQuestion) {
    this.ensureContinentProgress(continent);
    const discovered = this.progress[continent]?.discovered?.[String(gameQuestion)];
    if (discovered) return "completed";
    const cp = this.progress[continent];
    const unlockedQ = getUnlockedQuestion(cp);
    if (gameQuestion === unlockedQ) return "current";
    if (gameQuestion < unlockedQ) return "current";
    return "locked";
  }),

  buildWaypoints: action(function buildWaypoints(continent) {
    return getAllQuestionsForContinent(continent).map(function buildWaypointCB(q) {
      return {
        gameQuestion: q.gameQuestion,
        commonName: q.commonName,
        scientificName: q.scientificName,
        country: q.country,
        lat: q.lat,
        lng: q.lng,
        status: this.getWaypointStatus(continent, q.gameQuestion),
        discoveredImage: this.progress[continent]?.discovered?.[String(q.gameQuestion)]?.imageUrl ?? null,
      };
    }, this);
  }),

  getUser() {
    return auth.currentUser;
  },

  configureGoogle() {
    configureGoogleSignin();
  },

  async loginWithEmail(email, password) {
    return authLoginWithEmail(email, password);
  },

  async loginWithGoogle() {
    return authLoginWithGoogle();
  },

  async signOut() {
    return firebaseSignOut(auth);
  },
};
