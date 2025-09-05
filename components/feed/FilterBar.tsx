
import React from 'react';
import { PostCategory } from '../../types';

interface FilterBarProps {
    currentFilter: PostCategory | 'all';
    setFilter: (filter: PostCategory | 'all') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, setFilter }) => {
    const filters: (PostCategory | 'all')[] = ['all', ...Object.values(PostCategory)];

    const getButtonClasses = (filter: PostCategory | 'all') => {
        const isActive = currentFilter === filter;
        return `w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-neutral-dark hover:bg-neutral-light'
        }`;
    };
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-md mb-4 text-neutral-dark">Filtra per Categoria</h3>
            <div className="space-y-2">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setFilter(filter)}
                        className={getButtonClasses(filter)}
                    >
                        {filter === 'all' ? 'Tutti i post' : filter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
