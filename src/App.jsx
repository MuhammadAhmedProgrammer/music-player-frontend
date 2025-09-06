import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-black w-full h-full flex text-white relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        <Home setIsSidebarOpen={setIsSidebarOpen} />
      </div>
    </div>
  );
};

export default App;
