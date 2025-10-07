export const getApiBaseUrl = () =>
  process.env.JSON_SERVER_BASE_URL ?? 'http://localhost:4000';
