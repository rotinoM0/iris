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
///////////////////////////////////////////////////////////////////////////////

import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import Main from './pages/stock/Stock'
import Dashboard from './pages/dashboard/Dashboard'
import Init from './pages/Init'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Init />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/main" element={<Dashboard />} />
        <Route path='/estoque' element={<Main />} />
      </Routes>
    </HashRouter>
  )
}

export default App
