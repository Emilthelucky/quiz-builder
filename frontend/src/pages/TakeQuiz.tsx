import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizApi, Quiz } from '../services/api';

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await quizApi.getQuizById(id);
        setQuiz(data);
      } catch (e) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'If you leave now, your progress will be saved to exam history.';
      return 'If you leave now, your progress will be saved to exam history.';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState({ exam: true }, '', window.location.href);
      setShowLeaveWarning(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    window.history.pushState({ exam: true }, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      const exists = current.includes(option);
      const next = exists ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [questionId]: next };
    });
  };

  const onSubmit = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      const res = await quizApi.submitQuiz(id, { answers });
      navigate(`/quizzes/${id}/results/${res.id}`);
    } catch (e) {
      setError('Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  const onLeaveExam = async () => {
    if (!id) return;
    try {
      setIsLeaving(true);
      await quizApi.submitQuiz(id, { answers });
      navigate('/quizzes');
    } catch (e) {
      setError('Failed to save exam progress');
      setIsLeaving(false);
    }
  };

  const handleLeaveClick = () => {
    setShowLeaveWarning(true);
  };

  const confirmLeave = () => {
    setShowLeaveWarning(false);
    window.history.replaceState(null, '', window.location.href);
    onLeaveExam();
  };

  const cancelLeave = () => {
    setShowLeaveWarning(false);
    window.history.replaceState({ exam: true }, '', window.location.href);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLeaving) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Saving your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return <div className="text-center text-red-600">{error || 'Quiz not found'}</div>;
  }

  return (
    <div className="w-full max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{quiz.title}</h1>
        <p className="text-gray-500 mt-1">Answer the questions below and submit your exam.</p>
      </div>
      {quiz.questions.map((q, idx) => {
        const qid = (q.id as string);
        return (
        <div key={qid} className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Question {idx + 1}</h3>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-lg">{q.type}</span>
          </div>
          <p className="mb-6 text-lg text-gray-700">{q.text}</p>

          {q.type === 'BOOLEAN' && (
            <div className="space-y-4">
              <div className="flex space-x-6">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <input
                    type="radio"
                    name={`q-${qid}`}
                    value="true"
                    checked={(answers[qid] as string) === 'true'}
                    onChange={() => setAnswer(qid, 'true')}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-gray-900">True</span>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <input
                    type="radio"
                    name={`q-${qid}`}
                    value="false"
                    checked={(answers[qid] as string) === 'false'}
                    onChange={() => setAnswer(qid, 'false')}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium text-gray-900">False</span>
                </label>
              </div>
            </div>
          )}

          {q.type === 'INPUT' && (
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Your answer"
              value={(answers[qid] as string) || ''}
              onChange={(e) => setAnswer(qid, e.target.value)}
            />
          )}

          {q.type === 'CHECKBOX' && (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <input
                    type="checkbox"
                    className="mr-3 text-indigo-600 focus:ring-indigo-500"
                    checked={Array.isArray(answers[qid]) ? (answers[qid] as string[]).includes(opt) : false}
                    onChange={() => toggleCheckbox(qid, opt)}
                  />
                  <span className="font-medium text-gray-900">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      );})}

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          disabled={submitting}
          onClick={handleLeaveClick}
          className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors"
        >
          Leave Exam
        </button>
        <button
          disabled={submitting}
          onClick={onSubmit}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
        >
          {submitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>

      {showLeaveWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave Exam?</h3>
              <p className="text-gray-600 mb-6">
                If you leave now, your current progress will be saved to exam history. You can review your answers later.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelLeave}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLeave}
                  disabled={isLeaving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
                >
                  {isLeaving ? 'Saving...' : 'Leave Exam'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;


