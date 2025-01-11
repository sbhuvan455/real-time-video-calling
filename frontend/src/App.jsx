import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './component/Home'
import Room from './component/Room'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:room' element={<Room />} />
    </Routes>
  )
}

export default App
