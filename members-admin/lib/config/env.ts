export const getGraphqlEndpoint = () =>
  process.env.GRAPHQL_API_ENDPOINT ??
  'https://report.development.opexa.io/graphql';

export const getAuthSessionEndpoint = () =>
  process.env.AUTH_SESSION_ENDPOINT ??
  'https://auth.development.opexa.io/sessions?ttl=24h';

export const getAuthBasicToken = () =>
  process.env.AUTH_BASIC_TOKEN ??
  'Basic YmFieWVuZ2luZWVyOjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDg=';

export const getAuthPlatformCode = () =>
  process.env.AUTH_PLATFORM_CODE ?? 'Z892';

export const getAuthRole = () => process.env.AUTH_ROLE ?? 'OPERATOR';
