/*
# Create chaos_scores table (single-tenant, no auth)

1. New Tables
- `chaos_scores`
  - `id` (uuid, primary key)
  - `player_name` (text, not null, defaults to 'Anonymous')
  - `score` (integer, not null)
  - `survival_time_ms` (bigint, not null)
  - `max_chaos` (integer, not null)
  - `events_survived` (integer, not null)
  - `title` (text, not null)
  - `created_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `chaos_scores`.
- Allow anon + authenticated to read all scores (public leaderboard).
- Allow anon + authenticated to insert new scores (no sign-in needed).

3. Indexes
- Index on `score` descending for fast leaderboard queries.
- Index on `created_at` descending for recent score queries.
*/

CREATE TABLE IF NOT EXISTS chaos_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Anonymous',
  score integer NOT NULL,
  survival_time_ms bigint NOT NULL,
  max_chaos integer NOT NULL,
  events_survived integer NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chaos_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scores" ON chaos_scores;
CREATE POLICY "anon_select_scores" ON chaos_scores FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scores" ON chaos_scores;
CREATE POLICY "anon_insert_scores" ON chaos_scores FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_chaos_scores_score_desc ON chaos_scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_chaos_scores_created_at_desc ON chaos_scores (created_at DESC);
