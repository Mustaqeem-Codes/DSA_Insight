import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home'; 

// --- HASHING PAGE WRAPPERS ---
import Linear_Hashing_Page from './Pages/Linear_Hashing_Page';
import Quadratic_Hashing_Page from './Pages/Quadratic_Hashing_Page';
import Double_Hashing_Page from './Pages/Double_Hashing_Page';
import Chaining_Hashing_Page from './Pages/Chaining_Hashing_Page';

// --- ARRAY PAGE WRAPPER ---
import Array_Page from './Pages/Array_Page'; // The new wrapper we created

// --- COMPONENT IMPORTS (HASHING) ---
import LinearHashing from './components/LinearHashing';
import LinearSearch from './components/LinearSearch';
import LinearDelete from './components/LinearDelete';

import QuadraticInsert from './components/QuadraticInsert';
import QuadraticSearch from './components/QuadraticSearch';
import QuadraticDelete from './components/QuadraticDelete';

import DoubleInsert from './components/DoubleInsert';
import DoubleSearch from './components/DoubleSearch';
import DoubleDelete from './components/DoubleDelete';

import ChainingInsert from './components/ChainingInsert';
import ChainingSearch from './components/ChainingSearch';
import ChainingDelete from './components/ChainingDelete';

// --- COMPONENT IMPORTS (ARRAY) ---
import ArrayInsert from './components/ArrayInsert';
import ArrayDelete from './components/ArrayDelete';
import ArraySearch from './components/ArraySearch';
import ArrayTraversal from './components/ArrayTraversal';

// --- SINGLY LINKED LIST COMPONENT ---
import SinglyLinkedList from './components/SinglyLinkedList';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing/Home Page */}
        <Route path="/" element={<Home />} /> 
        
        {/* --- SINGLY LINKED LIST SECTION --- */}
        <Route path="/linked-list" element={<SinglyLinkedList />} />
        
        {/* --- 1. ARRAY SECTION --- */}
        <Route path="/array" element={<Array_Page />}>
          {/* Default to Insertion when clicking Array */}
          <Route index element={<Navigate to="array-insert" replace />} />
          <Route path="array-insert" element={<ArrayInsert />} />
          <Route path="array-delete" element={<ArrayDelete />} />
          <Route path="array-search" element={<ArraySearch />} />
          <Route path="array-traversal" element={<ArrayTraversal />} />
        </Route>

        {/* --- 2. LINEAR PROBING SECTION --- */}
        <Route path="/hashing" element={<Linear_Hashing_Page />}>
          <Route index element={<Navigate to="linear-insert" replace />} />
          <Route path="linear-insert" element={<LinearHashing />} />
          <Route path="linear-search" element={<LinearSearch />} />
          <Route path="linear-delete" element={<LinearDelete />} />
        </Route>

        {/* --- 3. QUADRATIC PROBING SECTION --- */}
        <Route path="/quadratic" element={<Quadratic_Hashing_Page />}>
          <Route index element={<Navigate to="quad-insert" replace />} />
          <Route path="quad-insert" element={<QuadraticInsert />} />
          <Route path="quad-search" element={<QuadraticSearch />} />
          <Route path="quad-delete" element={<QuadraticDelete />} />
        </Route>

        {/* --- 4. DOUBLE HASHING SECTION --- */}
        <Route path="/double" element={<Double_Hashing_Page />}>
          <Route index element={<Navigate to="double-insert" replace />} />
          <Route path="double-insert" element={<DoubleInsert />} />
          <Route path="double-search" element={<DoubleSearch />} />
          <Route path="double-delete" element={<DoubleDelete />} />
        </Route>

        {/* --- 5. SEPARATE CHAINING SECTION --- */}
        <Route path="/chaining" element={<Chaining_Hashing_Page />}>
          <Route index element={<Navigate to="chaining-insert" replace />} />
          <Route path="chaining-insert" element={<ChainingInsert />} />
          <Route path="chaining-search" element={<ChainingSearch />} />
          <Route path="chaining-delete" element={<ChainingDelete />} />
        </Route>

        {/* Catch-all: Redirect unknown routes back home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;