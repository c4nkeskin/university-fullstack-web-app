import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İsteklere kimlik doğrulama belirteci (token) ekle
api.interceptors.request.use((config) => {
  // Önce yönetici belirtecini (token) kontrol et
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Öğrenci belirtecini (token) kontrol et
  const studentToken = localStorage.getItem('student_token');
  if (studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }
  
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const newsAPI = {
  getAll: () => api.get('/news'),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const academicUnitsAPI = {
  getAll: (type) => api.get('/academic-units', { params: { unit_type: type } }),
  getById: (id) => api.get(`/academic-units/${id}`),
  create: (data) => api.post('/academic-units', data),
  update: (id, data) => api.put(`/academic-units/${id}`, data),
  delete: (id) => api.delete(`/academic-units/${id}`),
};

export const sliderAPI = {
  getAll: () => api.get('/slider'),
  create: (data) => api.post('/slider', data),
  update: (id, data) => api.put(`/slider/${id}`, data),
  delete: (id) => api.delete(`/slider/${id}`),
};

export const contactAPI = {
  get: () => api.get('/contact'),
  update: (data) => api.put('/contact', data),
};

export const quickLinksAPI = {
  getAll: () => api.get('/quick-links'),
  create: (data) => api.post('/quick-links', data),
  update: (id, data) => api.put(`/quick-links/${id}`, data),
  delete: (id) => api.delete(`/quick-links/${id}`),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const contactMessagesAPI = {
  getAll: () => api.get('/contact-messages'),
  create: (data) => api.post('/contact-messages', data),
  markRead: (id) => api.put(`/contact-messages/${id}/read`),
  delete: (id) => api.delete(`/contact-messages/${id}`),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const footerAPI = {
  getSettings: () => api.get('/footer-settings'),
  updateSettings: (data) => api.put('/footer-settings', data),
  getLinks: (category) => api.get('/footer-links', { params: { category } }),
  createLink: (data) => api.post('/footer-links', data),
  updateLink: (id, data) => api.put(`/footer-links/${id}`, data),
  deleteLink: (id) => api.delete(`/footer-links/${id}`),
};

export const academicStaffAPI = {
  getAll: () => api.get('/academic-staff'),
  getById: (id) => api.get(`/academic-staff/${id}`),
  create: (data) => api.post('/academic-staff', data),
  update: (id, data) => api.put(`/academic-staff/${id}`, data),
  delete: (id) => api.delete(`/academic-staff/${id}`),
};

export const academicCalendarAPI = {
  getAll: () => api.get('/academic-calendar'),
  getById: (id) => api.get(`/academic-calendar/${id}`),
  create: (data) => api.post('/academic-calendar', data),
  update: (id, data) => api.put(`/academic-calendar/${id}`, data),
  delete: (id) => api.delete(`/academic-calendar/${id}`),
};

export const courseDepartmentsAPI = {
  getAll: () => api.get('/course-departments'),
  getById: (id) => api.get(`/course-departments/${id}`),
  create: (data) => api.post('/course-departments', data),
  update: (id, data) => api.put(`/course-departments/${id}`, data),
  delete: (id) => api.delete(`/course-departments/${id}`),
};

export const courseSchedulesAPI = {
  getAll: (departmentId) => api.get('/course-schedules', { params: { department_id: departmentId } }),
  getById: (id) => api.get(`/course-schedules/${id}`),
  create: (data) => api.post('/course-schedules', data),
  update: (id, data) => api.put(`/course-schedules/${id}`, data),
  delete: (id) => api.delete(`/course-schedules/${id}`),
};

export const contactPageSettingsAPI = {
  get: () => api.get('/contact-page-settings'),
  update: (data) => api.put('/contact-page-settings', data),
};

export const aboutSettingsAPI = {
  get: () => api.get('/about-settings'),
  update: (data) => api.put('/about-settings', data),
};

export const studentAPI = {
  register: (data) => api.post('/students/register', data),
  login: (data) => api.post('/students/login', data),
  getMe: () => api.get('/students/me'),
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  approve: (id) => api.put(`/students/${id}/approve`),
  reject: (id) => api.put(`/students/${id}/reject`),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  
  getGrades: (id) => api.get(`/students/${id}/grades`),
  createGrade: (data) => api.post('/students/grades', data),
  updateGrade: (id, data) => api.put(`/students/grades/${id}`, data),
  deleteGrade: (id) => api.delete(`/students/grades/${id}`),
  
  getAttendance: (id) => api.get(`/students/${id}/attendance`),
  createAttendance: (data) => api.post('/students/attendance', data),
  updateAttendance: (id, data) => api.put(`/students/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/students/attendance/${id}`),
};