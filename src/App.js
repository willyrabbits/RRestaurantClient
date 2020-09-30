import React from 'react';
import { Route, Routes } from 'react-router'

import firebase, { FirebaseContext } from './firebase'

import Ordenes from './components/paginas/Ordenes'
import Menu from './components/paginas/Menu'
import NuevoPlato from './components/paginas/NuevoPlato'

import SideBar from './components/ui/SideBar'

function App() {
  return (
    <FirebaseContext.Provider
      value={{ firebase }}
    >
      <div className="md:flex min-h-screen">
        <SideBar />
        <div className="md:w-3/5 xl:w-4/5 p-6">
          <Routes>
            <Route path="/" element={<Ordenes />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/nuevo-plato" element={<NuevoPlato />} />
          </Routes>
        </div>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;