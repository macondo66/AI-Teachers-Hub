
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { Post, PostCategory } from '../../types';

interface PostCreateProps {
    onPostCreated: (post: Post) => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<PostCategory | ''>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !category || !user) return;

        setLoading(true);
        const { data, error } = await supabase.from('posts').insert([{
            author_id: user.id,
            title: title || null,
            content,
            category
        }]);

        if (error) {
            console.error('Error creating post:', error);
        } else if (data) {
            onPostCreated({ ...data[0], author: user });
            setTitle('');
            setContent('');
            setCategory('');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-neutral-dark">Crea un nuovo post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Titolo (opzionale)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    maxLength={100}
                />
                <textarea
                    placeholder="Di cosa vuoi parlare?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md h-28 focus:ring-primary focus:border-primary"
                    maxLength={2000}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                     <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as PostCategory)}
                        required
                        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                        <option value="" disabled>Seleziona una categoria</option>
                        {Object.values(PostCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={loading || !content || !category}
                        className="w-full sm:w-auto px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {loading ? 'Pubblicazione...' : 'Pubblica'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostCreate;
