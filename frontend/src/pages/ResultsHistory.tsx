import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizApi, QuizResultWithTitle } from '../services/api';

const ResultsHistory: React.FC = () => {
  const [results, setResults] = useState<QuizResultWithTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getAllResults();
        setResults(data);
      } catch (e) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">Exam History</h1>
        <Link to="/quizzes" className="text-indigo-600 hover:text-indigo-700">← Back to Quizzes</Link>
      </div>

      {results.length === 0 ? (
        <div className="text-gray-600">No exam results yet.</div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-3 border-b text-sm font-semibold text-gray-600 bg-gray-50">
            <div>Quiz</div>
            <div>Date</div>
            <div className="text-center">Total</div>
            <div className="text-center">Correct</div>
            <div className="text-center">Score</div>
          </div>
          {results.map((r) => (
            <div key={r.id} className="grid grid-cols-5 gap-4 p-3 border-b last:border-b-0 items-center">
              <div>
                <Link to={`/quizzes/${r.quizId}`} className="text-blue-600 hover:text-blue-800">
                  {r.quizTitle || r.quizId}
                </Link>
              </div>
              <div>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</div>
              <div className="text-center">{r.total}</div>
              <div className="text-center text-green-700">{r.correctCount}</div>
              <div className="text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${r.percent >= 70 ? 'bg-green-100 text-green-700' : r.percent >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {r.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsHistory;


