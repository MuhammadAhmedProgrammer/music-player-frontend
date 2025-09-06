// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css";
import App from './App.jsx'
import { SongProvider } from "./components/SongContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
 <SongProvider>
    <App />
  </SongProvider>
)
