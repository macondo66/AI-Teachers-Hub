
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage';
import Header from './ui/Header';

export type Page = 'home' | 'profile';

const AppRouter: React.FC = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('home');

    if (!user) {
        return <AuthPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <HomePage />;
        }
    }

    return (
        <>
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main>
                {renderPage()}
            </main>
        </>
    );
};

export default AppRouter;
