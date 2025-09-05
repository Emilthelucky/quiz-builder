import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API || 'http://localhost:20001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Question {
  id?: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  text: string;
  options: string[];
  correct: string[];
  order?: number;
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: string;
  title: string;
  createdAt: string;
  _count: {
    questions: number;
  };
}

export interface CreateQuizRequest {
  title: string;
  questions: Omit<Question, 'id' | 'order'>[];
}

export interface SubmitAnswersRequest {
  answers: Record<string, string[] | string>;
}

export interface QuizResultSummary {
  id: string;
  quizId: string;
  createdAt?: string;
  total: number;
  correctCount: number;
  percent: number;
}

export interface QuizResultWithTitle extends QuizResultSummary {
  quizTitle?: string;
}

export const quizApi = {
  createQuiz: async (data: CreateQuizRequest): Promise<Quiz> => {
    const response = await api.post('/quizzes', data);
    return response.data;
  },

  getAllQuizzes: async (): Promise<QuizSummary[]> => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  submitQuiz: async (id: string, data: SubmitAnswersRequest): Promise<QuizResultSummary> => {
    const response = await api.post(`/quizzes/${id}/submit`, data);
    return response.data;
  },

  getQuizResults: async (id: string): Promise<QuizResultSummary[]> => {
    const response = await api.get(`/quizzes/${id}/results`);
    return response.data;
  },

  getAllResults: async (): Promise<QuizResultWithTitle[]> => {
    const response = await api.get('/results');
    return response.data;
  },

  updateQuiz: async (id: string, data: CreateQuizRequest): Promise<Quiz> => {
    const response = await api.put(`/quizzes/${id}`, data);
    return response.data;
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await api.delete(`/quizzes/${id}`);
  },
};

export default api;
