# Quiz Builder

A full-stack web application for creating and managing custom quizzes. Built with Express.js backend and React frontend.

## Features

- **Create Quizzes**: Build custom quizzes with multiple question types
- **Question Types**: Support for Boolean (True/False), Input (Text), and Checkbox (Multiple Choice) questions
- **Quiz Management**: View all quizzes, delete quizzes, and view detailed quiz information
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for both frontend and backend

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- ESLint & Prettier for code quality

### Frontend
- React with TypeScript
- React Router for navigation
- React Hook Form with Zod validation
- Tailwind CSS for styling
- Axios for API calls

## Project Structure

```
quiz-builder/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.tsx        # Main app component
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Database Setup

1. **Install PostgreSQL** and create a database named `quiz_builder`

2. **Create the database**:
   ```sql
   CREATE DATABASE quiz_builder;
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/quiz_builder?schema=public"
   PORT=20001
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Push database schema**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:20001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:20003`

## API Endpoints

### Quizzes

- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes` - Get all quizzes (with question count)
- `GET /api/quizzes/:id` - Get a specific quiz with all questions
- `DELETE /api/quizzes/:id` - Delete a quiz

### Health Check

- `GET /api/health` - Check if the API is running

## Usage

### Creating a Quiz

1. Navigate to the "Create Quiz" page
2. Enter a quiz title
3. Add questions by selecting the question type:
   - **Boolean**: True/False questions
   - **Input**: Text input questions
   - **Checkbox**: Multiple choice questions with multiple correct answers
4. Configure each question with appropriate options and correct answers
5. Submit the form to create the quiz

### Managing Quizzes

- **View All Quizzes**: The home page shows all created quizzes with titles and question counts
- **View Quiz Details**: Click on any quiz to see its full structure and questions
- **Delete Quizzes**: Use the delete button on each quiz card to remove it

## Question Types

### Boolean Questions
- Simple True/False questions
- One correct answer (True or False)

### Input Questions
- Text input questions
- Specify the expected correct answer

### Checkbox Questions
- Multiple choice questions
- Multiple correct answers possible
- Add options one per line

## Development

### Code Quality

Both frontend and backend are configured with:
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better development experience

### Running Linters

**Backend**:
```bash
cd backend
npm run lint
npm run format
```

**Frontend**:
```bash
cd frontend
npm run lint
npm run format
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_builder?schema=public"
PORT=20001
```

### Frontend
The frontend automatically connects to `http://localhost:20001/api` for the backend API.

## Sample Quiz Creation

Here's an example of creating a sample quiz:

1. **Quiz Title**: "JavaScript Basics"
2. **Questions**:
   - Boolean: "JavaScript is a compiled language" (False)
   - Input: "What does DOM stand for?" (Document Object Model)
   - Checkbox: "Which are JavaScript data types?" (String, Number, Boolean, Object)

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure PostgreSQL is running and the database exists
2. **Port Already in Use**: Change the PORT in backend/.env if 20001 is occupied
3. **CORS Issues**: The backend is configured to allow all origins in development

### Database Reset

To reset the database:
```bash
cd backend
npx prisma db push --force-reset
```

## License

This project is created for assessment purposes.
