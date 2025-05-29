import React, { useState } from 'react'

function Flashcard({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false)

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  return (
    <div 
      className="flashcard" 
      onClick={toggleAnswer}
    >
      <div className="flashcard-question">{question}</div>
      
      {showAnswer && (
        <div className="flashcard-answer">{answer}</div>
      )}
      
      <div className="flashcard-hint">
        {showAnswer ? 'Click to hide answer' : 'Click to reveal answer'}
      </div>
    </div>
  )
}

export default Flashcard 