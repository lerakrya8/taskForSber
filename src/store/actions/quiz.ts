import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuizQuestions } from 'api/quiz';

export const fetchQuizQuestion = createAsyncThunk('quizQuestion/fetchQuizQuestion', async (amount: number) => {
    return await fetchQuizQuestions(amount);
});
