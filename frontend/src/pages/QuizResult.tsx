import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { quizApi, Quiz, QuizResultSummary } from '../services/api';

const QuizResult: React.FC = () => {
  const { id, resultId } = useParams<{ id: string; resultId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResultSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id || !resultId) return;
      try {
        setLoading(true);
        const [q, results] = await Promise.all([
          quizApi.getQuizById(id),
          quizApi.getQuizResults(id),
        ]);
        setQuiz(q);
        const found = results.find((r) => r.id === resultId) || null;
        setResult(found);
      } catch (e) {
        setError('Failed to load result');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, resultId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !quiz || !result) {
    return <div className="text-center text-red-600">{error || 'Result not found'}</div>;
  }

  const percentStr = `${result.percent.toFixed(1)}%`;
  const scoreBadgeColor = result.percent >= 70 ? 'bg-green-100 text-green-700' : result.percent >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

  return (
    <div className="w-full max-w-none">
      <div className="mb-8">
        <Link to={`/quizzes/${quiz.id}`} className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium">
          ← Back to Quiz
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Result</h1>
        <h2 className="text-xl text-gray-700 mb-6">{quiz.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-semibold text-gray-600 mb-2">Total Questions</div>
          <div className="text-3xl font-bold text-gray-900">{result.total}</div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-semibold text-gray-600 mb-2">Correct</div>
          <div className="text-3xl font-bold text-green-600">{result.correctCount}</div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm font-semibold text-gray-600 mb-2">Score</div>
          <div className={`inline-flex items-center px-4 py-2 rounded-lg font-bold text-lg ${scoreBadgeColor}`}>{percentStr}</div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button 
          onClick={() => navigate(`/quizzes/${quiz.id}/take`)} 
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Retake Exam
        </button>
      </div>
    </div>
  );
};

export default QuizResult;


