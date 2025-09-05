
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    school_name: '',
    experience_years: 0,
    privacy: false,
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri.');
      return;
    }
    if (!formData.privacy) {
        setError('Devi accettare la privacy policy.');
        return;
    }
    setError('');
    const { error } = await register(formData);
    if (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input name="full_name" type="text" placeholder="Nome Completo" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="password" type="password" placeholder="Password (min. 8 caratteri)" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="school_name" type="text" placeholder="Scuola di appartenenza" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="experience_years" type="number" placeholder="Anni di esperienza" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <div className="flex items-center">
        <input id="privacy" name="privacy" type="checkbox" onChange={handleChange} required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
        <label htmlFor="privacy" className="ml-2 block text-sm text-gray-900">Accetto la privacy policy</label>
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
        {loading ? 'Registrazione...' : 'Registrati'}
      </button>
    </form>
  );
};

export default RegisterForm;
