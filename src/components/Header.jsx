import React from "react";

const Header = ({ setIsSidebarOpen }) => {
  return (
    <div className="bg-[#222222] h-fit w-full rounded-lg">
      <div className="flex justify-between p-6 items-center">
        <div className="flex gap-5">
          <img
            src="/svgs/hamberger.svg"
            alt="menu"
            className="invert w-[32px] h-[32px] xl:hidden block cursor-pointer"
            onClick={() => setIsSidebarOpen(true)} // open
          />
          <img src="/svgs/left.svg" alt="left" className="invert max-560:hidden" />
          <img src="/svgs/right.svg" alt="right" className="invert max-560:hidden" />
        </div>
        <div className="flex gap-6">
          <button className="text-[#9a8e88] font-bold hover:text-white">Sign Up</button>
          <button className="bg-white text-black rounded-full px-4 py-2 font-semibold hover:scale-110 transition">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
