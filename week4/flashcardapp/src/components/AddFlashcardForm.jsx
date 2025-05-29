import React, { useState } from 'react'

function AddFlashcardForm({ onAddCard }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Don't add empty cards
    if (question.trim() === '' || answer.trim() === '') return
    
    // Create new card object
    const newCard = {
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
      question: question,
      answer: answer
    }
    
    // Send the new card back to parent
    onAddCard(newCard)
    
    // Reset form
    setQuestion('')
    setAnswer('')
  }

  return (
    <div className="form-container">
      <h2>Add a New Flashcard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer"
          />
        </div>
        <button type="submit">Add Flashcard</button>
      </form>
    </div>
  )
}

export default AddFlashcardForm 