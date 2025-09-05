
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Profile, AICompetence, AIInterest, AIInterests } from '../types';
import { Edit, Save, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<Profile>>(user || {});

    useEffect(() => {
        setProfileData(user || {});
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleInterestChange = (interest: AIInterest) => {
        const currentInterests = profileData.ai_interests || [];
        const newInterests = currentInterests.includes(interest)
            ? currentInterests.filter(i => i !== interest)
            : [...currentInterests, interest];
        setProfileData(prev => ({ ...prev, ai_interests: newInterests }));
    };

    const handleSave = async () => {
        await updateProfile(profileData);
        setIsEditing(false);
    };

    if (!user) {
        return <div>Profilo non trovato.</div>;
    }
    
    const competence = user.ai_competence || AICompetence.Principiante;
    const competenceStyles = {
        [AICompetence.Principiante]: { border: 'border-blue-400', bg: 'bg-blue-100', text: 'text-blue-700' },
        [AICompetence.Intermedio]: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-700' },
        [AICompetence.Avanzato]: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' },
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
                    <img
                        src={user.profile_image_url || 'https://picsum.photos/id/1027/200/200'}
                        alt={user.full_name}
                        className={`absolute top-24 left-8 h-32 w-32 rounded-full object-cover border-4 ${competenceStyles[competence].border} shadow-lg`}
                    />
                     <div className="absolute top-4 right-4">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={handleSave} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:bg-gray-400" disabled={loading}><Save size={20} /></button>
                                <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><X size={20} /></button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="bg-white text-primary p-2 rounded-full hover:bg-gray-100"><Edit size={20} /></button>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 p-8">
                    <h2 className="text-3xl font-bold font-heading">{user.full_name}</h2>
                    <p className="text-neutral">{user.school_name}</p>

                    <div className="mt-6 space-y-6">
                        {renderField('bio', 'Biografia Professionale', profileData.bio, handleInputChange, isEditing, 'textarea')}
                        {renderField('subjects', 'Materie Insegnate', profileData.subjects?.join(', '), handleInputChange, isEditing, 'text', 'Es. Matematica, Scienze')}
                        {renderSelect('ai_competence', 'Competenze AI', profileData.ai_competence, handleInputChange, isEditing, Object.values(AICompetence))}
                        {renderCheckboxes('ai_interests', 'Interessi Specifici AI', profileData.ai_interests, handleInterestChange, isEditing)}
                        {renderField('ai_tools_used', 'Strumenti AI Utilizzati', profileData.ai_tools_used, handleInputChange, isEditing, 'text')}
                        {renderField('ai_projects', 'Progetti AI Realizzati', profileData.ai_projects, handleInputChange, isEditing, 'textarea')}
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderField = (name: keyof Profile, label: string, value: any, onChange: any, isEditing: boolean, type: 'text' | 'textarea', placeholder?: string) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
            type === 'textarea' ?
            <textarea name={name} value={value || ''} onChange={onChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" rows={3}></textarea> :
            <input type="text" name={name} value={value || ''} placeholder={placeholder} onChange={onChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        ) : (
            <p className="text-neutral-dark mt-1">{value || 'Non specificato'}</p>
        )}
    </div>
);

const renderSelect = (name: keyof Profile, label: string, value: any, onChange: any, isEditing: boolean, options: string[]) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
            <select name={name} value={value || ''} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <p className="text-neutral-dark mt-1">{value || 'Non specificato'}</p>
        )}
    </div>
);

const renderCheckboxes = (name: keyof Profile, label: string, value: any, onChange: (interest: AIInterest) => void, isEditing: boolean) => (
     <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-2 flex flex-wrap gap-2">
            {AIInterests.map(interest => (
                isEditing ? (
                     <label key={interest} className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer">
                        <input type="checkbox" checked={value?.includes(interest) || false} onChange={() => onChange(interest)} className="rounded text-primary focus:ring-primary"/>
                        <span>{interest}</span>
                    </label>
                ) : (
                    value?.includes(interest) && <span key={interest} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">{interest}</span>
                )
            ))}
            {!isEditing && (!value || value.length === 0) && <p className="text-neutral-dark">Nessun interesse specificato</p>}
        </div>
    </div>
);

export default ProfilePage;
