import React from 'react'
import Flashcard from './Flashcard'

function FlashcardList({ flashcards }) {
  return (
    <div className="flashcard-list">
      {flashcards.map(card => (
        <Flashcard 
          key={card.id} 
          question={card.question} 
          answer={card.answer} 
        />
      ))}
    </div>
  )
}

export default FlashcardList 