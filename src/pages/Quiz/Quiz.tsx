import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@bem-react/classname';
import { useDispatch } from 'react-redux';
import { fetchQuizQuestion } from 'store/actions/quiz';
import { useAppSelector } from 'store/store';

const CnQuiz = cn('quiz');

export const Quiz = () => {

  const { quiz } = useAppSelector((state) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizQuestion(6));
}, [dispatch]);

const shuffle = useCallback((array: string[]) => {
  for (let i = array?.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}, []);

  const easyQuestions = useMemo(() => quiz?.results.reduce((total, item) => (item.difficulty === 'easy' ? total + 1 : total), 0), [quiz]);
  const mediumQuestions = useMemo(() => quiz?.results.reduce((total, item) => (item.difficulty === 'medium' ? total + 1 : total), 0), [quiz]);
  const hardQuestions = useMemo(() => quiz?.results?.length - easyQuestions - mediumQuestions, [quiz, easyQuestions, mediumQuestions]);
  const [checkedAnswers, setCheckedAnswers] = useState(Array<string>());
  const [error, setError] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scoreEasy, setScoreEasy] = useState(0);
  const [scoreMedium, setScoreMedium] = useState(0);
  const [scoreHard, setScoreHard] = useState(0);

  const [showScore, setShowScore] = useState(false);

  const amountQuestions = useMemo(() => quiz.results?.length, [quiz]);
  const multipleAnswer = useMemo(() => quiz.results[currentQuestion]?.type === 'multiple', [currentQuestion, quiz]);
  const answers = useMemo(() => shuffle(quiz.results[currentQuestion]?.incorrect_answers.concat(quiz.results[currentQuestion].correct_answer)), [quiz, currentQuestion, shuffle]);

  const [checkedItem, setCheckedItem] = useState(Array(4).fill(false));

  const handleAnswerClick = (questionType: string) => () => {
    if (checkedAnswers.length === 0) {
      setError(true);
      return;
    }

    const correctAnswer = quiz.results[currentQuestion].correct_answer;
    const userAnswer = checkedAnswers.join('');
      if (correctAnswer === userAnswer) {
        questionType === 'easy' ? setScoreEasy(prev => prev + 1) : questionType === 'medium' ? setScoreMedium(prev => prev + 1) : setScoreHard(prev => prev + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < amountQuestions) {
          setCurrentQuestion(nextQuestion);
      } else {
          setShowScore(true);
      }

      setCheckedAnswers(Array<string>());
      setCheckedItem(Array(4).fill(false));
  }

  const handleCheckAnswer = (answer: string, idx: number, multiple: boolean) => () => {
    if(error) {
      setError(false);
    }

    setCheckedItem(prev => {
      const newState = [...prev];
      newState[idx] = !newState[idx];
      return newState;
    });

    if (!multiple) {
      const previousStateCheckedAnswers = Array<string>();
      previousStateCheckedAnswers.push(answer);
      setCheckedAnswers(previousStateCheckedAnswers);
    } else if (checkedAnswers.includes(answer)) {
      setCheckedAnswers(prev => {
        const newState = [...prev];
        const deleteAnswerIndex = prev.indexOf(answer);
        newState.splice(deleteAnswerIndex, 1);
        return newState;
      })
    } else {
      setCheckedAnswers(prev => {
        const newState = [...prev];
        newState.push(answer);
        return newState;
      })
    }
  }

  const handleRestartQuiz = useCallback(() => {
    setShowScore(false);
    setScoreEasy(0);
    setScoreMedium(0);
    setScoreHard(0);
    setCurrentQuestion(0);
  }, [setShowScore, setCurrentQuestion]);

  const  escapeHtml = useCallback((text: string) => {
    return text?.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  }, []);

  return (
    <div className={CnQuiz()}>
      {showScore ? (
        <div className={CnQuiz('showScore')}>
            <div className={CnQuiz('easyQuestionScore')}>
              <div className={CnQuiz('easyTotal')}>
                {`Easy: ${scoreEasy} / ${easyQuestions}`}
              </div>
              <div className={CnQuiz('easyTotal')}>
                {`Medium: ${scoreMedium} / ${mediumQuestions}`}
              </div>
              <div className={CnQuiz('easyTotal')}>
                {`Hard: ${scoreHard} / ${hardQuestions}`}
              </div>
            </div>
            <button onClick={handleRestartQuiz} className={CnQuiz('restart')}>Пройти еще раз</button>
        </div>
      ) :
      (<div className={CnQuiz('question')}>
        <div className={CnQuiz('questionSection')}>
          <div className={CnQuiz('questionCount')}>
              <span>Вопрос {currentQuestion + 1 }</span> / {amountQuestions}</div>
          <div className={CnQuiz('questionText')}>{escapeHtml(quiz.results[currentQuestion]?.question)}</div>
          <div className={CnQuiz('difficulty')}>{quiz.results[currentQuestion]?.difficulty}</div>
        </div>
        <div className={CnQuiz('answersSection')}>
          <div className={CnQuiz('answers')}>
              {answers?.map((item, index) => (
                <label key={index}>
                  <input name={`question${currentQuestion}`} type={multipleAnswer ? 'checkbox' : 'radio'} onChange={handleCheckAnswer(item, index, multipleAnswer)} checked={checkedItem[index]}/>
                  {item}
                </label> 
              ))}
            </div>
          </div>
          <button className={CnQuiz('answer')} onClick={handleAnswerClick(quiz.results[currentQuestion]?.difficulty)}>Ответить</button>
        </div>)}
    </div>
  );
}
