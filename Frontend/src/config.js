
// Access environment variables (support both legacy and current key names)
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_API_URL ||
	'http://localhost:5000/api';

// Derive SOCKET_URL from API_BASE_URL (removing '/api' if present)
// If API_BASE_URL is http://localhost:5000/api, SOCKET_URL becomes http://localhost:5000
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export { API_BASE_URL, SOCKET_URL };
