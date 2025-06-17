import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen text-center flex flex-col justify-center items-center p-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to WindowPro</h2>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Upgrade your home’s curb appeal by visualizing your new windows before you buy. Use our
        realistic Window Visualizer tool to explore styles and colors on your actual house.
      </p>
      <Link to="/visualizer">
        <button className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700">
          🧰 Launch Window Visualizer
        </button>
      </Link>
    </div>
  );
}
