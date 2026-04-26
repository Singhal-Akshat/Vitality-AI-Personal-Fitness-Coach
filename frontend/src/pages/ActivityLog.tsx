import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ActivityLog: React.FC = () => {
  const [activity, setActivity] = useState('run');
  const [duration, setDuration] = useState(45);
  const [intensity, setIntensity] = useState('medium');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/activities');
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWarning(null);

    try {
      const response = await api.post('/log-activity', {
        type: activity,
        duration,
        intensity,
        timestamp: new Date().toISOString()
      });

      if (response.data.warning) {
        setWarning(response.data.warning.message);
      }
      
      fetchLogs();
    } catch (error) {
      console.error("Error saving log", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-1">Log Activity</h1>
        <p className="text-lg text-outline">Record your latest session to keep your insights accurate.</p>
      </div>

      <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 ambient-shadow">
        {warning && (
          <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <span className="material-symbols-outlined fill">warning</span>
            <p className="text-sm font-bold">{warning}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-wider text-on-surface-variant mb-4 uppercase">ACTIVITY TYPE</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'run', label: 'Run', icon: 'directions_run' },
                { id: 'swim', label: 'Swim', icon: 'pool' },
                { id: 'cycle', label: 'Cycle', icon: 'pedal_bike' },
                { id: 'weights', label: 'Weights', icon: 'fitness_center' },
                { id: 'yoga', label: 'Yoga', icon: 'self_improvement' },
                { id: 'hiit', label: 'HIIT', icon: 'bolt' },
                { id: 'walking', label: 'Walking', icon: 'directions_walk' },
                { id: 'sports', label: 'Sports', icon: 'sports_tennis' }
              ].map((item) => (
                <label key={item.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="activity"
                    className="peer sr-only"
                    checked={activity === item.id}
                    onChange={() => setActivity(item.id)}
                  />
                  <div className="rounded-xl border border-outline-variant p-4 flex flex-col items-center gap-1 peer-checked:bg-primary-container/10 peer-checked:border-primary peer-checked:text-primary transition-all text-on-surface-variant bg-surface group hover:border-primary/50">
                    <span className="material-symbols-outlined fill group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-wider text-on-surface-variant mb-4 uppercase">DURATION (MINUTES)</label>
              <div className="relative">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-shadow"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">schedule</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-on-surface-variant mb-4 uppercase">INTENSITY</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-lg text-on-surface focus:ring-2 focus:ring-primary/20 transition-shadow appearance-none cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary text-lg font-bold py-4 rounded-xl mt-4 hover:opacity-90 transition-all flex justify-center items-center gap-2 active:scale-[0.98] shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined">add_circle</span>
                Save Activity
              </>
            )}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-on-surface mb-6">Recent History</h2>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-outline italic">No activities logged yet.</p>
          ) : (
            logs.slice().reverse().map((log, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 ambient-shadow flex items-center gap-6 group hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-variant">
                <div className="bg-surface-container w-12 h-12 rounded-full flex items-center justify-center text-primary shrink-0 uppercase">
                  <span className="material-symbols-outlined fill">
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
                  <h4 className="text-lg font-bold text-on-surface capitalize">{log.type} Session</h4>
                  <p className="text-sm text-outline">{new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-on-surface">{log.duration} min</p>
                  <p className="text-sm text-outline capitalize">{log.intensity}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ActivityLog;
