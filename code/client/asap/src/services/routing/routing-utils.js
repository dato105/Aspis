import { ROUTES } from './routes';

export const getRoutesForRole = role => ROUTES.filter(route => route.roles && route.roles.includes(role));
