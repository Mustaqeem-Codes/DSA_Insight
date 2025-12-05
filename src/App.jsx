import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'; // FIXED: Ensure this matches the export name from Home.jsx
import BST_Page from './Pages/BST_Page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/bst" element={<BST_Page />} />
        {/* If you use dynamic routing for other cards, uncomment this line: */}
        {/* <Route path="/visualize/:id" element={<BST_Page />} /> */}
      </Routes>
    </Router>
  );
}

export default App;