export function getTitle(score: number, eventsSurvived: number, maxChaos: number): string {
  if (score >= 5000) return 'Chaos Legend';
  if (score >= 3500) return 'Master of Disaster';
  if (score >= 2500) return 'Professional Disaster Manager';
  if (score >= 1800) return 'Crisis Whisperer';
  if (score >= 1200) return 'Certified Button Masher';
  if (score >= 800) return 'The One Who Almost Made It';
  if (score >= 500) return 'Average Human';
  if (score >= 200) return 'The One Who Caused Everything';
  if (eventsSurvived >= 10) return 'Survivor of the Absurd';
  if (maxChaos >= 80) return 'Agent of Chaos';
  return 'Rookie World Saver';
}

export function getShareText(score: number, time: number, title: string): string {
  const seconds = Math.floor(time / 1000);
  return `I survived INTERNET CHAOS for ${seconds}s with a score of ${score}! I earned the title: "${title}" Can you do better?`;
}
