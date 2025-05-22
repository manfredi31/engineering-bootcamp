import { useState } from 'react'

function CardContainer ({questions}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState()
  const currentQuestion = questions[currentIndex]

  function onSelect(option) {
    setSelectedOption(option)
  }

  function handleNext () {
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null)
  }

  return (
      <div className ="card-container"> 
        <QuestionText question={currentQuestion.question}/>
        <AnswerOptions options={currentQuestion.options} onSelect={onSelect} selectedOption={selectedOption} correctAnswer={questions[currentIndex].answer} />
        <NextButton changeQuestion={handleNext}/>
      </div>
  );
}

function QuestionText ({question}) {
  return (
    <>
      <div className = "question-text"> {question} </div>
    </>
  );
}

function AnswerOptions ({options, onSelect, selectedOption, correctAnswer}) {

  return (
    <>
      <div className="answer-container"> 
        <Answers option={options[0]} onSelect={onSelect} selectedOption={selectedOption} correctAnswer={correctAnswer}/>
        <Answers option={options[1]} onSelect={onSelect} selectedOption={selectedOption} correctAnswer={correctAnswer}/>
        <Answers option={options[2]} onSelect={onSelect} selectedOption={selectedOption} correctAnswer={correctAnswer}/>
        <Answers option={options[3]} onSelect={onSelect} selectedOption={selectedOption} correctAnswer={correctAnswer}/>
      </div>
    </>
  )
}

function Answers ({option, onSelect, selectedOption, correctAnswer }) {

  let answerClass = ""

  if (!selectedOption){
    answerClass = ""
  } else if (option === correctAnswer) {
    answerClass = "correct-answer"
  } else if (option === selectedOption) {
    answerClass = "wrong-answer"
  } else {
    answerClass = ""
  }

  return (
     <>
      <button 
      className={`single-answer ${answerClass} `}
      onClick={() => onSelect(option)}
      > 
      {option} </button>
    </>
  )
}

function NextButton ({changeQuestion}) {
  return (
    <button onClick={changeQuestion}>
      Next
    </button>
  )
}

let questions = [
  { question: "What is the capital of Paris?",
    options: ["Berlin", "Rome", "Paris", "Naples"],
    answer: "Paris"
  },
  {
    question: "What is the greatest football player in the world?",
    options: ["Ronaldo", "Messi", "Ronaldinho", "Totti"],
    answer: "Ronaldo"
  },
  {
    question: "What color was the white horse of Napoleon? " ,
    options: ["Red", "White", "Green", "Black"],
    answer: "White"
  },
  {
    question: "What is the best country in the world?",
    options: ["Italy", "France", "Brazil", "USA"],
    answer: "Italy"
  }
]

function App() {

  return (
    <>
      <CardContainer questions={questions} />
    </>
  )
}

export default App
