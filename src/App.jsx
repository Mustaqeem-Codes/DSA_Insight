import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home'; 

// --- HASHING PAGE WRAPPERS ---
import Linear_Hashing_Page from './Pages/Linear_Hashing_Page';
import Quadratic_Hashing_Page from './Pages/Quadratic_Hashing_Page';
import Double_Hashing_Page from './Pages/Double_Hashing_Page';
import Chaining_Hashing_Page from './Pages/Chaining_Hashing_Page';

// --- ARRAY PAGE WRAPPER ---
import Array_Page from './Pages/Array_Page';

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
// 1D Array Operations (only the ones that exist)
import ArrayInsert from './components/ArrayInsert';
import ArrayDelete from './components/ArrayDelete';
import ArraySearch from './components/ArraySearch';

// 2D Array Operations  
import A2D_Array_Insert from './components/A2D_Array_Insert';
import A2D_Array_Delete from './components/A2D_Array_Delete';
import A2D_Array_Search from './components/A2D_Array_Search';

// 3D Array Operations
import A3D_Array_Insert from './components/A3D_Array_Insert';
import A3D_Array_Delete from './components/A3D_Array_Delete';
import A3D_Array_Search from './components/A3D_Array_Search';

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
        
        {/* --- 1D ARRAY SECTION --- */}
        <Route path="/array" element={<Array_Page />}>
          <Route index element={null} /> {/* Shows welcome page */}
          <Route path="insert" element={<ArrayInsert />} />
          <Route path="delete" element={<ArrayDelete />} />
          <Route path="search" element={<ArraySearch />} />
        </Route>

        {/* --- 2D ARRAY SECTION --- */}
        <Route path="/2d-array" element={<Array_Page />}>
          <Route index element={null} /> {/* Shows welcome page */}
          <Route path="insert" element={<A2D_Array_Insert />} />
          <Route path="delete" element={<A2D_Array_Delete />} />
          <Route path="search" element={<A2D_Array_Search />} />
        </Route>

        {/* --- 3D ARRAY SECTION --- */}
        <Route path="/3d-array" element={<Array_Page />}>
          <Route index element={null} /> {/* Shows welcome page */}
          <Route path="insert" element={<A3D_Array_Insert />} />
          <Route path="delete" element={<A3D_Array_Delete />} />
          <Route path="search" element={<A3D_Array_Search />} />
        </Route>

        {/* --- LINEAR PROBING SECTION --- */}
        <Route path="/hashing" element={<Linear_Hashing_Page />}>
          <Route index element={<Navigate to="linear-insert" replace />} />
          <Route path="linear-insert" element={<LinearHashing />} />
          <Route path="linear-search" element={<LinearSearch />} />
          <Route path="linear-delete" element={<LinearDelete />} />
        </Route>

        {/* --- QUADRATIC PROBING SECTION --- */}
        <Route path="/quadratic" element={<Quadratic_Hashing_Page />}>
          <Route index element={<Navigate to="quad-insert" replace />} />
          <Route path="quad-insert" element={<QuadraticInsert />} />
          <Route path="quad-search" element={<QuadraticSearch />} />
          <Route path="quad-delete" element={<QuadraticDelete />} />
        </Route>

        {/* --- DOUBLE HASHING SECTION --- */}
        <Route path="/double" element={<Double_Hashing_Page />}>
          <Route index element={<Navigate to="double-insert" replace />} />
          <Route path="double-insert" element={<DoubleInsert />} />
          <Route path="double-search" element={<DoubleSearch />} />
          <Route path="double-delete" element={<DoubleDelete />} />
        </Route>

        {/* --- SEPARATE CHAINING SECTION --- */}
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