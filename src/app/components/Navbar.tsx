"use client";

import { CgProfile } from "react-icons/cg";
import { IoNotifications } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar flex justify-between items-center p-4 px-8  ">
      <div className="logo">
        <h1 className="text-2xl font-bold text-[#2aa5ff]">
          Crypto Blue Blocks
        </h1>
      </div>
      <div className="menu flex gap-8">
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="">
              Marketplace
            </a>
          </li>
          <li>
            <a href="#" className="">
              Workspace
            </a>
          </li>
          <li>
            <a href="#" className="">
              Docs
            </a>
          </li>
          <li>
            <a href="#" className="">
              Help
            </a>
          </li>
        </ul>
        <div className="flex gap-4 items-center">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <FaWallet size={24} className="text-[#2aa5ff]" />
          </button>
          <IoNotifications size={24} className="" />
          <CgProfile size={24} className="" />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
