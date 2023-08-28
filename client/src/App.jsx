import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { logo } from './assets';
import { Home, AddMemory } from './page';

const App = () => (
  <BrowserRouter>
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
      <Link to="/">
        <img src={logo} alt="logo" className="w-12 object-contain" /> 
      </Link>

      <Link to="/create-post" className="font-inter font-medium bg-black text-white px-4 py-2 rounded-md ">Add memory</Link>
    </header>
    <main className="sm:p-8 px-4 py-8 w-full bg-white min-h-[calc(100vh-73px)]">
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/create-post" element={<AddMemory/>} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
