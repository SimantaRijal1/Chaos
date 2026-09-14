import { supabase } from './supabaseClient';

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  survival_time_ms: number;
  max_chaos: number;
  events_survived: number;
  title: string;
  created_at: string;
}

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('chaos_scores')
    .select('id, player_name, score, survival_time_ms, max_chaos, events_survived, title, created_at')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch leaderboard:', error.message);
    return [];
  }
  return (data ?? []) as LeaderboardEntry[];
}

export async function submitScore(entry: {
  player_name: string;
  score: number;
  survival_time_ms: number;
  max_chaos: number;
  events_survived: number;
  title: string;
}): Promise<boolean> {
  const { error } = await supabase
    .from('chaos_scores')
    .insert(entry);

  if (error) {
    console.error('Failed to submit score:', error.message);
    return false;
  }
  return true;
}
