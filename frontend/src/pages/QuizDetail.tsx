import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizApi, Quiz } from '../services/api';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id]);

  const fetchQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const data = await quizApi.getQuizById(quizId);
      setQuiz(data);
    } catch (err) {
      setError('Failed to fetch quiz details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-red-600 mb-4">
          {error || 'Quiz not found'}
        </h2>
        <Link
          to="/quizzes"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const renderQuestion = (question: any, index: number) => {
    return (
      <div key={question.id} className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Question {index + 1}
          </h3>
          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg">
            {question.type}
          </span>
        </div>

        <p className="text-gray-700 mb-6 text-lg">{question.text}</p>

        {question.type === 'BOOLEAN' && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-600">Options:</p>
            <div className="flex space-x-6">
              <div className="flex items-center p-3 border-2 border-gray-200 rounded-lg">
                <input
                  type="radio"
                  checked={question.correct.includes('true')}
                  readOnly
                  className="mr-3 text-indigo-600"
                />
                <span className="text-gray-700 font-medium">True</span>
              </div>
              <div className="flex items-center p-3 border-2 border-gray-200 rounded-lg">
                <input
                  type="radio"
                  checked={question.correct.includes('false')}
                  readOnly
                  className="mr-3 text-indigo-600"
                />
                <span className="text-gray-700 font-medium">False</span>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800">
                Correct Answer: {question.correct[0] === 'true' ? 'True' : 'False'}
              </p>
            </div>
          </div>
        )}

        {question.type === 'INPUT' && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-600">Expected Answer:</p>
            <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">{question.correct[0] || 'No answer specified'}</p>
            </div>
          </div>
        )}

        {question.type === 'CHECKBOX' && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-600">Options:</p>
            <div className="space-y-3">
              {question.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center p-3 border-2 border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={question.correct.includes(option)}
                    readOnly
                    className="mr-3 text-indigo-600"
                  />
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800">
                Correct Answers: {question.correct.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-none">
      <div className="mb-8">
        <Link
          to="/quizzes"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium"
        >
          ← Back to Quizzes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-2">Created: {new Date(quiz.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-gray-600">{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="mt-2 flex space-x-4">
            <Link
              to={`/quizzes/${quiz.id}/edit`}
              className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Edit Quiz
            </Link>
            <Link
              to={`/quizzes/${quiz.id}/take`}
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Take Exam
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
        {quiz.questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions in this quiz.</p>
          </div>
        ) : (
          quiz.questions.map((question, index) => renderQuestion(question, index))
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
