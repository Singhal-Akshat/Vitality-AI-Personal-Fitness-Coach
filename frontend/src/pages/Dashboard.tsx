import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const StatCard = ({ icon, label, value, subtext, colorClass, onAction, actionIcon = "add" }: any) => (
  <div className="bg-surface-container-lowest p-7 rounded-[32px] ambient-shadow border border-surface-container-high flex flex-col justify-between min-h-[160px] transition-all hover:scale-[1.03] hover:shadow-xl group cursor-default relative overflow-hidden">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center transition-transform group-hover:rotate-6`}>
        <span className={`material-symbols-outlined text-xl fill ${colorClass}`}>{icon}</span>
      </div>
      <div className="flex items-center gap-2">
        {label && (
          <div className={`bg-opacity-10 ${colorClass} ${colorClass.replace('text-', 'bg-')} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest`}>
            {label}
          </div>
        )}
        {onAction && (
          <button 
            onClick={(e) => { e.stopPropagation(); onAction(); }}
            className={`w-8 h-8 rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm`}
          >
            <span className={`material-symbols-outlined text-sm font-bold ${colorClass}`}>{actionIcon}</span>
          </button>
        )}
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-on-surface tracking-tighter leading-none mb-1">{value}</h3>
      <p className="text-[11px] font-bold text-outline uppercase tracking-widest">{subtext}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [glasses, setGlasses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const localProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setProfile(localProfile);
    
    // Clear old legacy local water data
    localStorage.removeItem('daily_glasses');
    
    fetchActivities();
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

  const handleAddWater = async () => {
    const newGlasses = glasses + 1;
    setGlasses(newGlasses);
    try {
      await api.post('/log-water', { glasses: newGlasses });
    } catch (error) {
      console.error("Error logging water", error);
    }
  };

  const totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);
  const totalKcal = activities.reduce((acc, curr) => acc + (curr.duration * 10), 0); // Mock kcal
  const progressPercent = Math.min(100, Math.round((totalDuration / 150) * 100)); // Target 150m
  const streak = activities.length > 0 ? 1 : 0; // Simple streak logic: if active today, streak is 1

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <section className="space-y-1 py-4">
        <h2 className="text-4xl font-black text-on-surface tracking-tighter">
          {getGreeting()}, {profile.name || 'Athlete'}
        </h2>
        <p className="text-lg text-outline font-medium">Here is your daily vitality summary.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          icon="local_fire_department" label="Streak" 
          value={`${streak} ${streak === 1 ? 'Day' : 'Days'}`} 
          subtext={streak > 0 ? "You're on fire!" : "Start your streak!"} 
          colorClass="text-primary-container" 
        />
        <StatCard 
          icon="directions_run" label="Activity" 
          value={activities.length} subtext="Total sessions" 
          colorClass="text-secondary" 
          onAction={() => navigate('/logs')}
        />
        <StatCard 
          icon="timer" label="Time" 
          value={`${totalDuration}m`} subtext="Total exercise" 
          colorClass="text-tertiary" 
        />
        <StatCard 
          icon="water_drop" label="Hydration" 
          value={
            <div className="flex items-center gap-1">
              {glasses}
              <span className="material-symbols-outlined text-2xl text-primary opacity-60">local_drink</span>
            </div>
          }
          subtext={`~${(glasses * 0.25).toFixed(1)}L total`} 
          colorClass="text-primary" 
          onAction={handleAddWater}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-[32px] p-10 ambient-shadow border border-surface-container-high lg:col-span-2 flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="42" stroke="currentColor" className="text-surface-container-high" strokeWidth="8"></circle>
              <circle 
                cx="50" cy="50" fill="none" r="42" stroke="currentColor" 
                className="text-primary transition-all duration-1000 ease-out"
                strokeDasharray="263.9" 
                strokeDashoffset={263.9 - (263.9 * progressPercent / 100)} 
                strokeLinecap="round" strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-on-surface tracking-tighter">{progressPercent}%</span>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Goal</span>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="text-2xl font-black text-on-surface tracking-tight">Today's Progress</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {progressPercent < 100 
                ? `You're ${100 - progressPercent}% away from your weekly target. Let's make it happen!` 
                : "You've crushed your weekly goal! Great work on staying consistent."}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <div className="bg-primary/5 text-primary text-[10px] font-bold px-4 py-2 rounded-2xl border border-primary/10 uppercase tracking-widest">{totalKcal} kcal burned</div>
              <div className="bg-tertiary/5 text-tertiary text-[10px] font-bold px-4 py-2 rounded-2xl border border-tertiary/10 uppercase tracking-widest">{totalDuration}m total</div>
            </div>
          </div>
        </div>

        <div className="bg-primary-container/5 rounded-[32px] p-8 ambient-shadow border border-primary-container/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl fill">psychology</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">AI Coach</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm italic">"Based on your heavy leg workout yesterday and slightly elevated resting heart rate today, I suggest active recovery."</p>
          </div>
          <button 
            onClick={() => navigate('/advice')}
            className="mt-8 w-full bg-primary text-on-primary font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Get AI Advice
          </button>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-[32px] p-8 ambient-shadow border border-surface-container-high">
        <div className="flex justify-between items-center mb-8 px-2">
          <h3 className="text-2xl font-black text-on-surface tracking-tight">Recent Sessions</h3>
          <button className="text-primary font-bold text-sm hover:underline tracking-tight">View Full History</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.length === 0 ? (
            <p className="text-outline italic col-span-3 text-center py-10 bg-surface-container-low rounded-3xl border border-dashed border-outline/20">No sessions logged yet.</p>
          ) : (
            activities.slice(-3).reverse().map((log, idx) => (
              <div key={idx} className="flex items-center p-5 rounded-[24px] bg-surface-container-low/50 hover:bg-surface-container-low transition-all group cursor-pointer border border-transparent hover:border-surface-container-high shadow-sm hover:shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mr-5 shadow-inner">
                  <span className="material-symbols-outlined text-2xl uppercase">
                    {log.type === 'run' ? 'directions_run' : 
                     log.type === 'swim' ? 'pool' : 
                     log.type === 'cycle' ? 'pedal_bike' : 
                     log.type === 'weights' ? 'fitness_center' : 
                     log.type === 'hiit' ? 'bolt' : 
                     log.type === 'walking' ? 'directions_walk' :
                     log.type === 'sports' ? 'sports_tennis' :
                     'self_improvement'}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors capitalize">{log.type}</h4>
                  <p className="text-[11px] font-bold text-outline uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-on-surface tracking-tighter">{log.duration}m</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
