import { useState } from 'react'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h1>Welcome to Chatopia</h1>
        <p>A place to connect.</p>
      </div>
    </>
  )
}

export default App
