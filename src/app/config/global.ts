// import { URL_ENVIRONMENT } from './../../environments/environment';

// export const URL_SERVICIOS = URL_ENVIRONMENT
// export const URL_SERVICIOS = 'https://imperial.dondehoy.com';
export const URL_SERVICIOS = window.location.origin.includes('localhost:') ? 'http://localhost:4000' : window.location.origin;
// export const URL_SERVICIOS = 'http://localhost:4000'
// export const URL_SERVICIOS = 'http://192.168.0.18:4000'

// URL del editor de flyers que se embebe como iframe para generar la portada
// del aviso fúnebre. En localhost apunta al `vite dev` por defecto (puerto 5173).
export const FLYER_GEN_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://flyer.imperialencarnacion.com.py';
