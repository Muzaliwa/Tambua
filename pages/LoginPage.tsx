import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Mock authentication logic
    // In a real app, this would be an API call
    if (email.toLowerCase() === 'admin@tambua.com' && password === 'admin123') {
      login({ name: 'Admin Goma', role: 'Superviseur', avatar: 'AG' });
      navigate('/dashboard');
    } else if (email.toLowerCase() === 'agent@tambua.com' && password === 'agent123') {
      login({ name: 'Agent Tambua', role: 'Agent', avatar: 'AT' });
      navigate('/agent-dashboard');
    } else {
      setError('Adresse e-mail ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--brand-50]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Welcome Text */}
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold text-[--text-main] mb-4">Bienvenue Sur Tambua</h1>
          <p className="text-[--text-muted] mb-8">Collaborez en toute sécurité avec vos équipes. Rôles, permissions, traçabilité des actions.</p>
          <ul className="space-y-4 text-[--text-muted]">
            <li className="flex items-center">
              <svg className="w-6 h-6 text-[--brand-400] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Authentification sécurisée</span>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-[--brand-400] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>Accès instantané au tableau de bord</span>
            </li>
            <li className="flex items-center">
               <svg className="w-6 h-6 text-[--brand-400] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9"></path></svg>
              <span>Support prioritaire</span>
            </li>
          </ul>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-white/90 to-white/85 p-8 rounded-xl shadow-glass border border-black/5">
          <h2 className="text-2xl font-bold text-center text-[--text-main] mb-2">Connexion</h2>
          <p className="text-center text-[--text-muted] mb-8">Accédez à votre compte Tambua</p>
          <form onSubmit={handleLogin}>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">{error}</p>}
            <div className="mb-4">
              <label className="block text-[--text-muted] text-base font-bold mb-2" htmlFor="email">Adresse e-mail</label>
              <input
                className="shadow-sm appearance-none border border-black/10 bg-white text-[--text-main] rounded-lg w-full py-3 px-4 text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[--brand-400] placeholder:text-gray-400"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: admin@tambua.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[--text-muted] text-base font-bold mb-2" htmlFor="password">Mot de passe</label>
              <input
                className="shadow-sm appearance-none border border-black/10 bg-white text-[--text-main] rounded-lg w-full py-3 px-4 text-base mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[--brand-400] placeholder:text-gray-400"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex: admin123"
                required
              />
              <a className="inline-block align-baseline font-bold text-sm text-[--brand-400] hover:text-[--brand-600]" href="#">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-[--text-muted] text-sm">
                <input className="form-checkbox h-4 w-4 text-[--brand-400] transition duration-150 ease-in-out" type="checkbox" />
                <span className="ml-2">Se souvenir de moi</span>
              </label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button className="bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-shadow" type="submit">
                Se connecter
              </button>
            </div>
            <div className="text-center mt-6 text-xs text-[--text-muted] p-3 bg-brand-50 rounded-lg">
                <p className="font-semibold">Pour la démo :</p>
                <p>Admin: <span className="font-mono">admin@tambua.com</span> / <span className="font-mono">admin123</span></p>
                <p>Agent: <span className="font-mono">agent@tambua.com</span> / <span className="font-mono">agent123</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;