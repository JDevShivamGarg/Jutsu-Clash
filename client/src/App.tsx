import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BattleProvider } from './contexts/BattleContext';
import { MainMenu } from './pages/MainMenu';
import { Battle } from './pages/Battle';
import { Training } from './pages/Training';

export default function App() {
  return (
    <BrowserRouter>
      <BattleProvider>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </BattleProvider>
    </BrowserRouter>
  );
}
