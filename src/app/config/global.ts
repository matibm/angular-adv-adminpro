// import { URL_ENVIRONMENT } from './../../environments/environment';

// export const URL_SERVICIOS = URL_ENVIRONMENT
// export const URL_SERVICIOS = 'http://test.imperial.mburgos.xyz';
export const URL_SERVICIOS = window.location.origin.includes('localhost:') ? 'http://localhost:4000' : window.location.origin;
// export const URL_SERVICIOS = 'http://localhost:4000'
// export const URL_SERVICIOS = 'http://192.168.0.18:4000'
