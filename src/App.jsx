// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct imports
// import Home from './Pages/Home';
// import BST_Page from './Pages/BST_Page';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/bst" element={<BST_Page />} />
//         <Route path="/visualize/:id" element={<BST_Page />} /> {/* For dynamic routing */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import BST_Page from "./Pages/BST_Page";
function App() {
  return (
    <div>
      <BST_Page />
    </div>
  );
}
export default App;