import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, QuizSummary } from '../services/api';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizApi.deleteQuiz(id);
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
          } catch (err) {
      setError('Failed to delete quiz');
    }
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const safeTotal = Math.max(1, totalPages);
    if (currentPage > safeTotal) {
      setCurrentPage(safeTotal);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">All Quizzes</h1>
          <p className="text-gray-500 mt-1">Create, take, and review your quizzes.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link
            to="/create"
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2 px-5 rounded shadow transition"
          >
            + Create Quiz
          </Link>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">No quizzes found</h2>
          <p className="text-gray-500 mb-6">Create your first quiz to get started!</p>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Quiz
          </Link>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">No quizzes match your search</h2>
          <p className="text-gray-500 mb-6">Try a different search term or create a new quiz.</p>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Quiz
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{quiz.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Created {new Date(quiz.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    to={`/quizzes/${quiz.id}/edit`}
                    className="text-blue-500 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition"
                    title="Edit quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-500 hover:text-red-600 p-2 rounded hover:bg-red-50 transition"
                    title="Delete quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{quiz._count.questions} question{quiz._count.questions !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition"
                >
                  View Details
                </Link>
                <Link
                  to={`/quizzes/${quiz.id}/take`}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition"
                >
                  Take Exam
                </Link>
              </div>
            </div>
            ))}
          </div>

          <div className="mt-12">
            <nav className="flex items-center">
              <div className="flex-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md border border-gray-300 bg-white text-gray-700">
                  Page {currentPage} of {Math.max(1, totalPages)}
                </span>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setCurrentPage(Math.min(Math.max(1, totalPages), currentPage + 1))}
                  disabled={currentPage === Math.max(1, totalPages)}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;
