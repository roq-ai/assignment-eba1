const mapping: Record<string, string> = {
  'activity-logs': 'activity_log',
  episodes: 'episode',
  movies: 'movie',
  organizations: 'organization',
  seasons: 'season',
  series: 'series',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
