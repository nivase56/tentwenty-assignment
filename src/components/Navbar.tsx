import React from "react";

interface NavbarProps {
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName }) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-8">
          <span className="text-xl font-semibold text-gray-900">ticktock</span>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center text-sm text-gray-700 hover:text-gray-900 bg-white rounded px-3 py-1.5">
              <span>{userName || "User"}</span>
              
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
