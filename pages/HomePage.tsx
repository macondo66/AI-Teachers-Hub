import React, { useState, useEffect, useCallback } from 'react';
import { Post, PostCategory } from '../types';
import { supabase } from '../services/supabase';
import PostCard from '../components/feed/PostCard';
import PostCreate from '../components/feed/PostCreate';
import FilterBar from '../components/feed/FilterBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<PostCategory | 'all'>('all');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        // FIX: Restructured query building to correctly handle chaining based on the mock's logic.
        const baseQuery = supabase.from('posts').select(`
            *,
            author: profiles(*)
        `);
        
        const { data, error } = filter === 'all' 
            ? await baseQuery.returns()
            : await baseQuery.order('created_at', { ascending: false }).eq('category', filter);

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data as any[] || []);
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = (newPost: Post) => {
        // To show the new post immediately, we add it to the top of the list.
        setPosts(prevPosts => [newPost, ...prevPosts]);
        fetchPosts(); // Refetch to get author details correctly
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    <PostCreate onPostCreated={handlePostCreated} />
                    <div className="mt-6">
                        {loading ? <LoadingSpinner /> : (
                            <div className="space-y-6">
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-24">
                        <FilterBar currentFilter={filter} setFilter={setFilter} />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;