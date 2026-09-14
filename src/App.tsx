import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { Footer } from './components/layout/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A221E]">
      <Navbar />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default App;
