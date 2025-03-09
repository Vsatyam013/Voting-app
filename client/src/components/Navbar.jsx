import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-br from-purple-900 to-blue-900 text-white p-4 flex justify-between items-center">
      <div className="text-3xl font-bold">My Vote</div>
      <div className="flex space-x-4 mr-24">
        <a href="/home" className="text-lg">Home</a>
        <a href="/about" className="text-lg">About</a>
      </div>
    </nav>
  );
};

export default Navbar;
