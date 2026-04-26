import React, { useState } from 'react';

const Onboarding: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    age: '',
    height: '',
    current_weight: '',
    weeks: '12',
    goal: 'weight_loss'
  });

  const goals = [
    { id: 'weight_loss', label: 'Weight Loss', icon: 'trending_down' },
    { id: 'muscle_gain', label: 'Muscle Gain', icon: 'fitness_center' },
    { id: 'endurance', label: 'Endurance', icon: 'timer' },
    { id: 'flexibility', label: 'Flexibility', icon: 'self_improvement' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-background z-[500] flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-2xl fill">auto_awesome</span>
            </div>
            <span className="text-2xl font-black text-primary tracking-tighter">Vitality AI</span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-on-surface tracking-tight">
              {step === 1 ? "What's your name?" : step === 2 ? "Set your goal" : "Your metrics"}
            </h1>
            <p className="text-on-surface-variant text-lg">Help us personalize your coaching.</p>
          </div>
        </div>

        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">FULL NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">AGE</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-xl text-on-surface focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, goal: goal.id })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${
                    formData.goal === goal.id
                      ? 'border-primary bg-primary-container/10 text-primary'
                      : 'border-surface-container-high bg-surface text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform ${formData.goal === goal.id ? 'fill' : ''}`}>
                    {goal.icon}
                  </span>
                  <span className="font-bold text-sm">{goal.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">HEIGHT (CM)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-xl text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">CURRENT (KG)</label>
                <input
                  type="number"
                  value={formData.current_weight}
                  onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
                  placeholder="75"
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-xl text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">TIME (WEEKS)</label>
                <input
                  type="number"
                  value={formData.weeks}
                  onChange={(e) => setFormData({ ...formData, weeks: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-xl text-on-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="pt-8 space-y-4">
            <button
              onClick={handleNext}
              disabled={step === 1 && !formData.name}
              className="w-full bg-primary-container text-on-primary font-bold py-5 rounded-3xl text-xl shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              {step === 3 ? "Let's Begin" : "Next Step"}
            </button>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-primary-container' : 'w-2 bg-surface-container-high'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
