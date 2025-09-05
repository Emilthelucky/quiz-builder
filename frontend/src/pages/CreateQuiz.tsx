import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quizApi, Question } from '../services/api';

const questionSchema = z.object({
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).optional(),
  correct: z.array(z.string()).optional(),
});

const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

type CreateQuizForm = z.infer<typeof createQuizSchema>;

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateQuizForm>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'BOOLEAN',
          text: '',
          options: [],
          correct: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  const addQuestion = () => {
    append({
      type: 'BOOLEAN',
      text: '',
      options: [],
      correct: [],
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: CreateQuizForm) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const processedQuestions = data.questions.map((question) => {
        const processed: Omit<Question, 'id' | 'order'> = {
          type: question.type,
          text: question.text,
          options: question.options || [],
          correct: question.correct || [],
        };

        if (question.type === 'BOOLEAN') {
          processed.correct = question.correct && question.correct[0]
            ? [question.correct[0]]
            : ['true'];
        } else if (question.type === 'INPUT') {
          processed.correct = [question.correct && question.correct[0] ? question.correct[0] : ''];
        } else if (question.type === 'CHECKBOX') {
          const options = question.options || [];
          const correct = question.correct || [];
          processed.correct = correct.filter((c) => options.includes(c));
        }

        return processed;
      });

      await quizApi.createQuiz({
        title: data.title,
        questions: processedQuestions,
      });

      navigate('/quizzes');
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Create New Quiz</h1>
        <p className="text-gray-500 mt-1">Define your quiz title, questions, and answers.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
            placeholder="Enter quiz title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Questions ({fields.length})
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              + Add Question
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Question {index + 1}</h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Question Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      value="BOOLEAN"
                      {...register(`questions.${index}.type`)}
                      className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">True/False</div>
                      <div className="text-sm text-gray-500 mt-1">Simple yes/no question</div>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      value="INPUT"
                      {...register(`questions.${index}.type`)}
                      className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Text Input</div>
                      <div className="text-sm text-gray-500 mt-1">Short text answer</div>
                    </div>
                  </label>
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      value="CHECKBOX"
                      {...register(`questions.${index}.type`)}
                      className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Multiple Choice</div>
                      <div className="text-sm text-gray-500 mt-1">Several correct answers</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  {...register(`questions.${index}.text`)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your question"
                />
                {errors.questions?.[index]?.text && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.questions[index]?.text?.message}
                  </p>
                )}
              </div>

              {watchedQuestions[index]?.type === 'CHECKBOX' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Multiple Choice Options
                  </label>
                  <div className="space-y-2">
                    {watchedQuestions[index]?.options?.map((option: string, optionIndex: number) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          value={option}
                          {...register(`questions.${index}.correct` as const)}
                          checked={watchedQuestions[index]?.correct?.includes(option) || false}
                          onChange={(e) => {
                            const current = getValues(`questions.${index}.correct`) || [];
                            const next = e.target.checked
                              ? Array.from(new Set([...current, option]))
                              : current.filter((c: string) => c !== option);
                            setValue(`questions.${index}.correct`, next, { shouldDirty: true, shouldValidate: true });
                          }}
                        />
                        <input
                          type="text"
                          {...register(`questions.${index}.options.${optionIndex}` as const)}
                          value={option}
                          onChange={(e) => {
                            const options = getValues(`questions.${index}.options`) || [];
                            const currentCorrect = getValues(`questions.${index}.correct`) || [];
                            const previousOption = options[optionIndex] ?? '';
                            const newOptions = [...options];
                            newOptions[optionIndex] = e.target.value;
                            setValue(`questions.${index}.options`, newOptions, { shouldDirty: true, shouldValidate: true });
                            if (currentCorrect.includes(previousOption)) {
                              const updatedCorrect = currentCorrect
                                .map((c: string) => (c === previousOption ? e.target.value : c))
                                .filter((c: string) => c !== '')
                                .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i);
                              setValue(`questions.${index}.correct`, updatedCorrect, { shouldDirty: true, shouldValidate: true });
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const options = getValues(`questions.${index}.options`) || [];
                            const toRemove = options[optionIndex];
                            const newOptions = options.filter((_: any, i: number) => i !== optionIndex);
                            setValue(`questions.${index}.options`, newOptions, { shouldDirty: true, shouldValidate: true });
                            const currentCorrect = getValues(`questions.${index}.correct`) || [];
                            const newCorrect = currentCorrect.filter((c: string) => c !== toRemove);
                            setValue(`questions.${index}.correct`, newCorrect, { shouldDirty: true, shouldValidate: true });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const currentOptions = getValues(`questions.${index}.options`) || [];
                        const newOptions = [...currentOptions, ''];
                        setValue(`questions.${index}.options`, newOptions, { shouldDirty: true, shouldValidate: true });
                      }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      + Add Option
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Check the boxes next to the correct answers
                  </p>
                </div>
              )}

              {watchedQuestions[index]?.type === 'INPUT' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    {...register(`questions.${index}.correct.0`)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}

              {watchedQuestions[index]?.type === 'BOOLEAN' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Correct Answer
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <input
                        type="radio"
                        value="true"
                        {...register(`questions.${index}.correct.0`)}
                        className="mr-3 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">True</span>
                    </label>
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <input
                        type="radio"
                        value="false"
                        {...register(`questions.${index}.correct.0`)}
                        className="mr-3 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-gray-900">False</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}

          {errors.questions && (
            <p className="mt-1 text-sm text-red-600">{errors.questions.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
