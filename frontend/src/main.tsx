///////////////////////////////////////////////////////////////////////////////
// Futuro programador (ou curioso) - Esse projeto é um sistema de controle de
// de estoque simples desenvolvido com a colaboração da Joyce para melhor 
// organização e padronização dos produtos da Conecta, feito com React 
// no frontend e Node.js no backend.
// Ele ainda está em desenvolvimento, mas já possui funcionalidades básicas
// apesar de bagunçadas e simples.
// Busque estudar por React, Node.js, Express, e MongoDB para entender
// O programador original não faz mais parte deste projeto, então sinta-se
// livre para modificá-lo conforme necessário. Boa sorte e bons estudos!
//
// Para testar, certifique-se de que o backend esteja em execução antes de iniciar o frontend.
///////////////////////////////////////////////////////////////////////////////


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
