
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Page } from '../AppRouter';
import { User, Home, LogOut } from 'lucide-react';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    const { user, logout } = useAuth();

    const navLinkClasses = (page: Page) => 
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === page 
            ? 'bg-primary/10 text-primary' 
            : 'text-neutral hover:bg-neutral-light hover:text-neutral-dark'
        }`;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold font-heading text-primary">AI Teachers Hub</h1>
                        </div>
                        <nav className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <button onClick={() => setCurrentPage('home')} className={navLinkClasses('home')}>
                                    <Home size={18} />
                                    <span>Feed</span>
                                </button>
                                <button onClick={() => setCurrentPage('profile')} className={navLinkClasses('profile')}>
                                    <User size={18} />
                                    <span>Profilo</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-sm text-neutral-dark">{user?.full_name}</p>
                            <p className="text-xs text-neutral">{user?.school_name}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-neutral bg-neutral-light hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
                 {/* Mobile Navigation */}
                <nav className="md:hidden flex justify-around py-2 border-t border-neutral-light">
                     <button onClick={() => setCurrentPage('home')} className={navLinkClasses('home')}>
                        <Home size={20} />
                        <span>Feed</span>
                    </button>
                    <button onClick={() => setCurrentPage('profile')} className={navLinkClasses('profile')}>
                        <User size={20} />
                        <span>Profilo</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
