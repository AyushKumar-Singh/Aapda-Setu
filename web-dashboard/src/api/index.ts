// Export API client
export { default as apiClient, useMockData } from './client';

// Export types
export * from './types';

// Export endpoint modules
export * as auth from './endpoints/auth';
export * as reports from './endpoints/reports';
export * as alerts from './endpoints/alerts';
export * as analytics from './endpoints/analytics';
export * as users from './endpoints/users';
