import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './contexts/socketContext.jsx'
import { PeerProvider } from './contexts/peerContext.jsx'

createRoot(document.getElementById('root')).render(
    <SocketProvider>
      <BrowserRouter>
        <PeerProvider>
          <App />
        </PeerProvider>
      </BrowserRouter>
    </SocketProvider>,
)
