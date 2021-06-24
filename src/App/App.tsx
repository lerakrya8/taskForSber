import React from 'react';
import { Provider } from 'react-redux';
import { Quiz } from 'pages/Quiz';
import { store } from 'store/store';

import './App.scss';

export const App: React.FC = () => {
    return (
        <React.StrictMode>
            <Provider store={store}>
               <Quiz />
            </Provider>
        </React.StrictMode>
    );
};
