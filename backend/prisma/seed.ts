import { PrismaClient } from '@prisma/client';

type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

const prisma = new PrismaClient();

async function main() {
  const sampleQuiz = await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics',
      questions: {
        create: [
          {
            type: 'BOOLEAN' as QuestionType,
            text: 'JavaScript is a compiled language',
            options: [],
            correct: ['false'],
            order: 1,
          },
          {
            type: 'INPUT' as QuestionType,
            text: 'What does DOM stand for?',
            options: [],
            correct: ['Document Object Model'],
            order: 2,
          },
          {
            type: 'CHECKBOX' as QuestionType,
            text: 'Which are JavaScript data types?',
            options: ['String', 'Number', 'Boolean', 'Object', 'Array', 'Function'],
            correct: ['String', 'Number', 'Boolean', 'Object'],
            order: 3,
          },
          {
            type: 'BOOLEAN' as QuestionType,
            text: 'JavaScript can only run in browsers',
            options: [],
            correct: ['false'],
            order: 4,
          },
          {
            type: 'INPUT' as QuestionType,
            text: 'What keyword is used to declare a variable in modern JavaScript?',
            options: [],
            correct: ['let'],
            order: 5,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
