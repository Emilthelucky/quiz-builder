import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-12 max-w-7xl">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="text-2xl font-extrabold text-white tracking-tight hover:opacity-90 transition">
            Quiz Builder
          </Link>
          <div className="space-x-2">
            <Link
              to="/quizzes"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                location.pathname === '/quizzes' || location.pathname === '/'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              All Quizzes
            </Link>
            <Link
              to="/create"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                location.pathname === '/create'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Create Quiz
            </Link>
            <Link
              to="/results"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                location.pathname === '/results'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Exam History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
