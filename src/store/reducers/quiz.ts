import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { IQuiz } from 'api/quiz';
import { fetchQuizQuestion } from 'store/actions/quiz';
import { FetchStatus } from 'types/api';

export interface QuizState {
    quiz: IQuiz;
    fetchStatus: FetchStatus;
    error: unknown;
}

const initialState: QuizState = {
    fetchStatus: FetchStatus.INITIAL,
    quiz: {
        response_code: -1,
        results: [],
    },
    error: null,
};

const quizSlice = createSlice<QuizState, SliceCaseReducers<QuizState>>({
    name: 'quiz',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchQuizQuestion.pending, (state) => {
            state.fetchStatus = FetchStatus.FETCHING;
            state.error = null;
        });
        builder.addCase(fetchQuizQuestion.fulfilled, (state, { payload }) => {
            state.fetchStatus = FetchStatus.FETCHED;
            state.quiz = payload;
        });
        builder.addCase(fetchQuizQuestion.rejected, (state, { error }) => {
            state.fetchStatus = FetchStatus.ERROR;
            state.error = error;
        });
    },
});

export const quizReducer = quizSlice.reducer;
