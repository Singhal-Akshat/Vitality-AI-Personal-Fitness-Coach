import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Trends: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [milestone, setMilestone] = useState<string>("Set your Gemini API key in settings to see personalized milestones!");
  const [, setLoadingMilestone] = useState(false);
  const [, setGlasses] = useState(0);

  useEffect(() => {
    fetchActivities();
    fetchMilestone();
    fetchWater();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const fetchWater = async () => {
    try {
      const response = await api.get('/get-water');
      setGlasses(response.data.glasses);
    } catch (error) {
      console.error("Error fetching water", error);
    }
  };

  const fetchMilestone = async () => {
    const apiKey = localStorage.getItem('ai_api_key');
    if (!apiKey) {
      setMilestone("Set your Gemini API key in settings to see personalized milestones!");
      return;
    }
    
    try {
      setLoadingMilestone(true);
      setMilestone("Generating your weekly insight...");
      const response = await api.post('/get-milestone');
      if (response.data.milestone) {
        setMilestone(response.data.milestone);
      }
    } catch (error) {
      console.error("Milestone error:", error);
      setMilestone("You're making great progress! Keep logging to see AI insights.");
    } finally {
      setLoadingMilestone(false);
    }
  };

  const streak = activities.length > 0 ? 1 : 0;

  // Calculate weekly activity (Monday-Sunday)
  const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
  activities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dayIndex = (date.getDay() + 6) % 7;
    weeklyActivity[dayIndex] += activity.duration;
  });

  const maxDuration = Math.max(...weeklyActivity, 1);

  // Calculate distribution with hybrid scoring
  let cardioPoints = 0;
  let strengthPoints = 0;
  let flexPoints = 0;

  activities.forEach(a => {
    const type = a.type.toLowerCase();
    if (type === 'swim' || type === 'sports') {
      cardioPoints += 0.5;
      strengthPoints += 0.5;
    } else if (['run', 'cycle', 'cardio', 'walking'].includes(type)) {
      cardioPoints += 1;
    } else if (['weights', 'gym', 'lifting', 'hiit'].includes(type)) {
      strengthPoints += 1;
    } else if (['yoga', 'stretch', 'meditation', 'self_improvement'].includes(type)) {
      flexPoints += 1;
    } else {
      cardioPoints += 1; 
    }
  });

  const totalPoints = cardioPoints + strengthPoints + flexPoints;

  const stats = {
    cardio: totalPoints > 0 ? Math.round((cardioPoints / totalPoints) * 100) : 0,
    strength: totalPoints > 0 ? Math.round((strengthPoints / totalPoints) * 100) : 0,
    flexibility: totalPoints > 0 ? Math.round((flexPoints / totalPoints) * 100) : 0,
  };

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-1">Your Progress</h1>
          <p className="text-lg text-outline font-medium">
            {streak > 0 ? `You're on a ${streak}-day streak! Keep going.` : "Start your fitness journey today!"}
          </p>
        </div>
        <div className="bg-primary-container/10 p-5 rounded-[32px] flex items-center gap-4 border border-primary-container/10">
          <div className="bg-primary-container text-on-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-2xl fill">local_fire_department</span>
          </div>
          <div>
            <p className="text-3xl font-black text-primary-container tracking-tighter leading-none">{streak}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-container opacity-70">Day Streak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-surface-container-lowest rounded-[32px] p-8 ambient-shadow border border-surface-container-high">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-on-surface tracking-tight">Weekly Activity</h3>
            <div className="flex gap-1.5">
              {days.map((day, idx) => (
                <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  weeklyActivity[idx] > 0 ? 'bg-primary text-on-primary shadow-lg scale-110' : 'bg-surface-container-high text-outline/40'
                }`}>
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-56 flex items-end justify-between gap-3 px-2 bg-surface-container-low/30 rounded-3xl p-4 border border-surface-container-low">
            {weeklyActivity.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                <div 
                  className={`w-full rounded-2xl transition-all duration-1000 ease-out relative group-hover:opacity-80 shadow-inner ${
                    val > 0 ? 'bg-gradient-to-t from-primary via-primary to-primary-container shadow-lg shadow-primary/30 border-2 border-white/20' : 'bg-surface-container-high/40'
                  }`}
                  style={{ height: val > 0 ? `${(val / maxDuration) * 90 + 10}%` : '10%' }}
                >
                  {val > 0 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-black py-2 px-3 rounded-2xl border border-surface-container-high opacity-0 group-hover:opacity-100 transition-all shadow-2xl whitespace-nowrap z-20 scale-90 group-hover:scale-100">
                      {val} min
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${val > 0 ? 'text-primary' : 'text-outline opacity-30'}`}>{days[idx]}</span>
              </div>
            ))}
          </div>
          {activities.length === 0 && (
            <p className="text-center text-xs text-outline mt-8 font-medium italic">Complete your first session to see your weekly trends!</p>
          )}
        </section>

        <section className="bg-surface-container-lowest rounded-[32px] p-8 ambient-shadow border border-surface-container-high flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-on-surface tracking-tight mb-8">Activity Distribution</h3>
            <div className="space-y-8">
              {[
                { label: 'Cardio', value: stats.cardio, color: 'bg-primary-container', icon: 'directions_run' },
                { label: 'Strength', value: stats.strength, color: 'bg-secondary', icon: 'fitness_center' },
                { label: 'Flexibility', value: stats.flexibility, color: 'bg-tertiary', icon: 'self_improvement' }
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 font-bold text-on-surface">
                      <div className={`w-8 h-8 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-sm ${item.color.replace('bg-', 'text-')}`}>{item.icon}</span>
                      </div>
                      <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-outline">{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-surface-variant/50 flex justify-between items-center">
            <p className="text-xs text-outline font-medium italic leading-relaxed max-w-[200px]">"Consistency is the secret to transforming your health."</p>
            <span className="text-[10px] font-black text-primary-container bg-primary-container/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">VITALITY QUOTE</span>
          </div>
        </section>
      </div>

      <section className="bg-[#191C1D] rounded-3xl p-10 text-white ambient-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined fill text-white">emoji_events</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Personal Milestone</h3>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl italic">
            "{milestone}"
          </p>
          <button className="bg-white text-[#191C1D] font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl active:scale-95">
            View Achievements
          </button>
        </div>
      </section>
    </div>
  );
};

export default Trends;
