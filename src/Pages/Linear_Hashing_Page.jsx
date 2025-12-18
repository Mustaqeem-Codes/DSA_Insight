import React from 'react';
import { Outlet } from 'react-router-dom';
import LinearNavbar from '../components/Hashing_Navbar';

function Linear_Hashing_Page() {
  return (
    <div className="hashing-page-container">
      {/* Navbar will touch the top of the screen */}
      <LinearNavbar />
      
      <div className="operation-viewer">
        {/* The visualization components (Insert/Search) render here */}
        <Outlet />
      </div>
    </div>
  );
}

export default Linear_Hashing_Page;