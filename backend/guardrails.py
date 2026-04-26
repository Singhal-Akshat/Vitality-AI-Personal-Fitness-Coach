def check_fitness_goal(current_weight, target_weight, weeks):
    """
    Checks if a weight loss goal is realistic.
    """
    if weeks <= 0:
        return None
    
    loss_per_week = (current_weight - target_weight) / weeks
    if loss_per_week > 1.5:  # More than 1.5kg per week is generally considered aggressive
        return {
            "type": "warning",
            "message": f"A target of {loss_per_week:.1f}kg/week is very aggressive. Experts usually recommend 0.5kg - 1kg/week for sustainable health. Consider a longer timeline.",
            "suggestion": "Adjust timeline to 12 weeks"
        }
    return None

def check_activity_spike(recent_avg_duration, new_activity_duration):
    """
    Checks if a new activity represents a dangerous spike in intensity.
    """
    if recent_avg_duration == 0:
        return None
        
    spike_factor = new_activity_duration / recent_avg_duration
    if spike_factor > 3.0:  # 300% increase in duration
        return {
            "type": "warning",
            "message": f"This session is {spike_factor:.1f}x your recent average duration. Increasing intensity too quickly can lead to overtraining or injury. Listen to your body.",
            "suggestion": "Consider a shorter recovery session"
        }
    return None

def check_overtraining(weekly_sessions, weekly_duration):
    """
    Checks for signs of overtraining.
    """
    if weekly_sessions > 14:  # More than 2 sessions per day on average
        return {
            "type": "caution",
            "message": "You've logged over 14 sessions this week. Make sure you're scheduling enough rest days for muscle recovery.",
            "suggestion": "Add a dedicated rest day"
        }
    
    if weekly_duration > 1200:  # More than 20 hours per week
        return {
            "type": "caution",
            "message": "Your total activity time this week exceeds 20 hours. High volume requires high recovery. Prioritize sleep and nutrition.",
            "suggestion": "Schedule a light recovery day"
        }
    return None
