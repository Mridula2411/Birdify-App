import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import QuizRoundView from "../views/quizRoundView";
import LoadingView from "../views/loadingView";
import SuspenseBoundary from "../views/suspenseBoundary";

const GamePresenter = observer(function GamePresenter(props) {
    const router = useRouter();
    const currentQuestion = props.model.getCurrentQuestion();
    const continent = props.model.selectedContinent;
    const questionNumber = currentQuestion?.gameQuestion ?? 0;
    const isLastInContinent = props.model.isLastQuestionForContinent(continent, questionNumber);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerOutcome, setAnswerOutcome] = useState(null);

    function handleBackCB() {
        setSelectedAnswer(null);
        setAnswerOutcome(null);
        router.back();
    }

    useEffect(function loadDataACB() {
        if (currentQuestion) {
            props.model.loadQuestionData(currentQuestion);
            setSelectedAnswer(null);
            setAnswerOutcome(null);
        }
    }, [currentQuestion?.id]);

    useEffect(function redirectIfNoQuestionCB() {
        if (!currentQuestion) {
            router.replace("/map");
        }
    }, [currentQuestion, router]);

    if (!currentQuestion) {
        return <LoadingView message="Preparing your next bird clue..." />;
    }

    function handleAnswerCB(choice) {
        const outcome = props.model.submitAnswer(choice);
        setSelectedAnswer(choice);
        setAnswerOutcome(outcome);
    }

    function handleNextCB() {
        props.model.setLastLevelPerfectRun(!!answerOutcome?.isCorrect);
        props.model.completeCurrentQuestion();
        if (!isLastInContinent) {
            props.model.selectQuestion(questionNumber + 1);
        }
    }

    function handleGoHomeCB() {
        router.push("/map");
    }

    return (
        <SuspenseBoundary message="Preparing your next bird clue...">
            <QuizRoundView
                question={currentQuestion}
                questionNumber={questionNumber}
                totalQuestions={9}
                choices={props.model.buildCurrentChoices()}
            imageUrl={props.model.birdImagePromiseState.data?.imageUrl ?? null}
            audioUrl={props.model.birdAudioPromiseState.data?.audioUrl ?? null}
            imageLoading={!props.model.birdImagePromiseState.data && !props.model.birdImagePromiseState.error}
            audioLoading={!props.model.birdAudioPromiseState.data && !props.model.birdAudioPromiseState.error}
            imageError={props.model.birdImagePromiseState.error}
            audioError={props.model.birdAudioPromiseState.error}
            wikiExtract={props.model.birdImagePromiseState.data?.wikiExtract ?? ""}
            onAnswer={handleAnswerCB}
            onBack={handleBackCB}
            selectedAnswer={selectedAnswer}
            answerOutcome={answerOutcome}
            isCorrect={!!answerOutcome?.isCorrect}
            reward={answerOutcome?.reward ?? { feathers: 0, eggs: 0 }}
            collectionSummary={props.model.getCollectionSummary()}
            continent={continent}
            isLastInContinent={isLastInContinent}
            onNext={handleNextCB}
            onGoHome={handleGoHomeCB}
        />
      </SuspenseBoundary>
    );
});

export default GamePresenter;
