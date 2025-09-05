import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import QuizDetail from './pages/QuizDetail';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import ResultsHistory from './pages/ResultsHistory';
import EditQuiz from './pages/EditQuiz';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-12 py-12 max-w-7xl">
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
            <Route path="/quizzes/:id/take" element={<TakeQuiz />} />
            <Route path="/quizzes/:id/results/:resultId" element={<QuizResult />} />
            <Route path="/quizzes/:id/edit" element={<EditQuiz />} />
            <Route path="/results" element={<ResultsHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
