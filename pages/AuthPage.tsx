
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold font-heading text-primary">
            AI Teachers Hub
          </h1>
          <p className="mt-2 text-center text-sm text-neutral">
            {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
          </p>
        </div>
        
        <div className="bg-white p-8 shadow-lg rounded-lg">
            {isLogin ? <LoginForm /> : <RegisterForm />}
            <div className="text-center mt-6">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-medium text-sm text-primary hover:text-blue-500"
                >
                    {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
