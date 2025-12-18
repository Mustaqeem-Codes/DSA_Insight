import React from 'react';
import { Outlet } from 'react-router-dom';
import Hashing_Navbar from '../components/Hashing_Navbar';

function Quadratic_Hashing_Page() {
  return (
    <div className="hashing-page-container">
      <Hashing_Navbar />
      <div className="operation-viewer">
        <Outlet />
      </div>
    </div>
  );
}

export default Quadratic_Hashing_Page;