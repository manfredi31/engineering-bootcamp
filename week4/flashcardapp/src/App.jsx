import { useState } from 'react'
import './App.css'
import FlashcardList from './components/FlashcardList'
import AddFlashcardForm from './components/AddFlashcardForm'

function App() {
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: 'What is React?',
      answer: 'A JavaScript library for building user interfaces'
    },
    {
      id: 2,
      question: 'What is JSX?',
      answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML'
    },
    {
      id: 3,
      question: 'What are props in React?',
      answer: 'Props are inputs to components that allow passing data from parent to child components'
    }
  ])

  const handleAddCard = (newCard) => {
    // Add the new card to the flashcards array (creating a new array)
    setFlashcards([...flashcards, newCard])
  }

  return (
    <div className="container">
      <h1>React Flashcards</h1>
      <AddFlashcardForm onAddCard={handleAddCard} />
      <FlashcardList flashcards={flashcards} />
    </div>
  )
}

export default App
