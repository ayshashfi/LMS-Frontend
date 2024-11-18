import axios from "axios";

// Get CSRF token from cookie
const getCSRFToken = () => {
  const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  return csrfToken ? csrfToken.split('=')[1] : null;
};

// Set CSRF token in headers for axios requests
axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();

export default axios;
