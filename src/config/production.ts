export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-django-server.com/api' 
  : 'http://localhost:8000/api';