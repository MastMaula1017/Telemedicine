
// Access environment variables (support both legacy and current key names)
let rawApi =
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_API_URL ||
	(import.meta.env.PROD
		? 'https://telemedicine-backend-7z21.onrender.com/api'
		: 'http://localhost:5000/api');

// Strip whitespace and trailing slashes
rawApi = rawApi.trim().replace(/\/+$/, '');

// If the user provided the backend host without '/api', ensure '/api' is appended
const API_BASE_URL = rawApi.endsWith('/api') ? rawApi : `${rawApi}/api`;

// Derive SOCKET_URL by removing '/api'
const SOCKET_URL = API_BASE_URL.replace(/\/api$/, '');

export { API_BASE_URL, SOCKET_URL };

