import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 20001;
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Quiz Builder API is running!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: 'Database connection successful!' });
  } catch (error: any) {
    res.json({ error: 'Database connection failed', details: error.message });
  }
});
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Title and questions array are required' 
      });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((question: any, index: number) => ({
            type: question.type,
            text: question.text,
            options: question.options || [],
            correct: question.correct || [],
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/quizzes/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body as { answers: Record<string, string[] | string> };

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;
    const total = quiz.questions.length;
    const storedAnswers: string[] = [];

    for (const q of quiz.questions) {
      const raw = answers?.[q.id];
      let submitted: string[] = [];
      if (Array.isArray(raw)) {
        submitted = raw.map(String);
      } else if (typeof raw === 'string') {
        submitted = [raw];
      }

      const normSubmitted = submitted.map((s) => s.trim());
      const normCorrect = q.correct.map((s) => s.trim());

      let isCorrect = false;
      if (q.type === 'CHECKBOX') {
        const a = [...normSubmitted].sort().join('|');
        const b = [...normCorrect].sort().join('|');
        isCorrect = a === b;
      } else {
        isCorrect = (normSubmitted[0] ?? '') === (normCorrect[0] ?? '');
      }

      if (isCorrect) correctCount += 1;
      storedAnswers.push(JSON.stringify({ questionId: q.id, submitted }));
    }

    const percent = total === 0 ? 0 : (correctCount / total) * 100;

    const result = await prisma.result.create({
      data: {
        quizId: id,
        total,
        correctCount,
        percent,
        answers: storedAnswers,
      },
    });

    res.json({
      id: result.id,
      quizId: id,
      total,
      correctCount,
      percent,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quizzes/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await prisma.result.findMany({
      where: { quizId: id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/results', async (_req, res) => {
  try {
    const results = await prisma.result.findMany({
      include: { quiz: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(results.map((r) => ({
      id: r.id,
      quizId: r.quizId,
      quizTitle: r.quiz?.title,
      createdAt: r.createdAt,
      total: r.total,
      correctCount: r.correctCount,
      percent: r.percent,
    })));
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Title and questions array are required' 
      });
    }

    await prisma.question.deleteMany({
      where: { quizId: id },
    });
    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        questions: {
          create: questions.map((question: any, index: number) => ({
            type: question.type,
            text: question.text,
            options: question.options || [],
            correct: question.correct || [],
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});