import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Onboarding from '../components/Onboarding';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Fitness Info
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goal, setGoal] = useState('weight_loss');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const endpoint = isSignup ? '/register' : '/login';
      const payload = isSignup ? {
        email,
        password,
        profile: {
          name,
          email,
          age,
          height,
          current_weight: currentWeight,
          goal,
          weeks: '12'
        }
      } : { email, password };

      const response = await api.post(endpoint, payload);
      
      // Save Auth
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      if (response.data.profile) {
        localStorage.setItem('userProfile', JSON.stringify(response.data.profile));
        localStorage.setItem('userName', response.data.profile.name);
      } else if (isSignup) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userProfile', JSON.stringify(payload.profile));
      }

      onLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-surface overflow-y-auto py-12">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary opacity-10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full bg-surface-container-lowest p-8 md:p-10 rounded-[32px] ambient-shadow border border-surface-container-high relative z-10 space-y-8 my-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-xl fill">auto_awesome</span>
            </div>
            <span className="text-xl font-black text-primary tracking-tighter uppercase">Vitality AI</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-outline text-sm">{isSignup ? 'Set up your fitness profile to begin.' : 'Log in to continue your fitness journey.'}</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-4 animate-in shake duration-500 text-sm font-bold border border-red-100 dark:border-red-900/50">
            <span className="material-symbols-outlined">warning</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {isSignup && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-12 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-12 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Password</label>
              <div className="relative">
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 pl-12 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
              </div>
            </div>

            {isSignup && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Age</label>
                  <input
                    type="number" required value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Height (cm)</label>
                  <input
                    type="number" required value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Goal</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Weight (kg)</label>
                  <input
                    type="number" required value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="75"
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl text-lg shadow-xl hover:opacity-90 active:scale-[0.98] transition-all mt-4"
          >
            {isSignup ? 'Sign Up & Begin' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-outline">
            {isSignup ? 'Already have an account?' : "Don't have an account?"} 
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-bold hover:underline ml-1"
            >
              {isSignup ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
