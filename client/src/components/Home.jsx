import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate=useNavigate()
  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Image with overlay */}
      <div className="relative w-full h-full">
        <img
          src="./images/background_home.jpg"
          alt="home"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay only on image */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content over the image */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to Inventory System
        </h1>
        <p className="text-34 md:text-xl mb-6">
          Manage your stock, categories and suppliers easily
        </p>
        <button
          className="bg-blue-500 px-5 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/productslist')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
