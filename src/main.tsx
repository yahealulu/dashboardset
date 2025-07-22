import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';
import AuthProvider from './components/Auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18n';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <Provider store={store}>
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        <I18nextProvider i18n={i18next}>
                            {' '}
                            <RouterProvider router={router} />
                        </I18nextProvider>
                    </QueryClientProvider>
                </AuthProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>
);
