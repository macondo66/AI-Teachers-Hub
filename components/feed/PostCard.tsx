
import React, { useState } from 'react';
import { Post, AICompetence, PostCategory } from '../../types';
import { Book, Lightbulb, FlaskConical, Milestone, Search } from 'lucide-react';

const competenceStyles = {
    [AICompetence.Principiante]: 'border-blue-400',
    [AICompetence.Intermedio]: 'border-green-500',
    [AICompetence.Avanzato]: 'border-orange-500',
};

const categoryStyles: Record<PostCategory, { icon: React.ReactNode, color: string, bgColor: string }> = {
    [PostCategory.Formazione]: { icon: <Book size={14}/>, color: 'text-purple-700', bgColor: 'bg-purple-100' },
    [PostCategory.Didattica]: { icon: <Lightbulb size={14}/>, color: 'text-blue-700', bgColor: 'bg-blue-100' },
    [PostCategory.Strumenti]: { icon: <FlaskConical size={14}/>, color: 'text-green-700', bgColor: 'bg-green-100' },
    [PostCategory.Esperienze]: { icon: <Milestone size={14}/>, color: 'text-orange-700', bgColor: 'bg-orange-100' },
    [PostCategory.Ricerca]: { icon: <Search size={14}/>, color: 'text-pink-700', bgColor: 'bg-pink-100' },
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const author = post.author;
    const competence = author?.ai_competence || AICompetence.Principiante;
    
    const categoryStyle = categoryStyles[post.category];
    const needsTruncation = post.content.length > 300;
    const displayContent = isExpanded ? post.content : `${post.content.substring(0, 300)}${needsTruncation ? '...' : ''}`;
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <div className="p-6">
                <div className="flex items-start space-x-4">
                    <img
                        src={author?.profile_image_url || 'https://picsum.photos/200'}
                        alt={author?.full_name}
                        className={`h-12 w-12 rounded-full object-cover border-2 ${competenceStyles[competence]}`}
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-neutral-dark">{author?.full_name}</p>
                                <p className="text-xs text-neutral">{author?.school_name}</p>
                            </div>
                            <span className="text-xs text-neutral">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${categoryStyle.bgColor} ${categoryStyle.color}`}>
                        {categoryStyle.icon}
                        <span>{post.category}</span>
                    </div>

                    {post.title && <h3 className="text-lg font-bold mt-3 text-neutral-dark">{post.title}</h3>}
                    
                    <p className="mt-2 text-neutral-dark whitespace-pre-wrap">{displayContent}</p>
                    
                    {needsTruncation && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-primary font-semibold text-sm mt-2">
                            {isExpanded ? 'Leggi meno' : 'Leggi tutto'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
