import React from 'react';
import { Outlet } from 'react-router-dom';
import Hashing_Navbar from '../components/Hashing_Navbar';

function Chaining_Hashing_Page() {
  return (
    <div className="hashing-page-container">
      <Hashing_Navbar />
      <div className="operation-viewer">
        <Outlet />
      </div>
    </div>
  );
}

export default Chaining_Hashing_Page;