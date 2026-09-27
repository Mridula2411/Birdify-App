// gameUtilities.js - helper functions

export const TOTAL_QUESTIONS_PER_CONTINENT = 9; // 9 birds per continent, unlocked one at a time


// Returns a new array with elements in a random order
export function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Builds the 4-choice array for a question: correct answer + 3 distractors, shuffled.
export function buildChoices(correctAnswer, distractors) {
    return shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);
}


// Returns a fresh ContinentProgress object (used when a continent is visited for the first time).
// unlockedQuestion starts at 1 — only bird #1 is available until it is answered.
export function emptyProgressForContinent() {
    return {
        unlockedQuestion: 1,
        discovered: {},
    };
}

// Returns the currently unlocked question number for a continent's progress object.
// Defaults to 1 so old Firestore documents without this field still work.
export function getUnlockedQuestion(continentProgress) {
    return continentProgress?.unlockedQuestion ?? 1;
}

// Returns true if the given question number is currently playable.
export function isQuestionUnlocked(continentProgress, gameQuestion) {
    return gameQuestion <= getUnlockedQuestion(continentProgress);
}
