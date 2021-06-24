import { host } from '../constants/apiMethods';

import axios, { AxiosError, AxiosResponse } from 'axios';

interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    'correct_answer': string;
    'incorrect_answers': string[];
}

export interface IQuiz {
    response_code: number;
    results: Question[];
}

export const fetchQuizQuestions = async (numQuestions: number): Promise<IQuiz> => {
    return await axios
        .get<never, AxiosResponse<IQuiz>>(`${host}/api.php?amount=${numQuestions}`)
        .then((res) => res?.data)
        .catch((err: AxiosError) => {
            throw err?.response?.status;
        });
};
