import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';

import HomePage from './components/HomePage';

import AIExamples from './components/AIExamples';

const App: React.FC = () => (

    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<HomePage />} />

        <Route path="ai-examples" element={<AIExamples />} />

      </Route>

    </Routes>

);

export default App;
