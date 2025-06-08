import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene una propiedad data, la devolvemos
    if (response.data) {
      return response.data;
    }
    // Si no tiene data, devolvemos la respuesta completa
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const message = error.response.data?.message || 'Error del servidor';
      console.error('Error de API:', {
        status: error.response.status,
        message: message,
        data: error.response.data
      });
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de red:', error.request);
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Error al configurar la petición
      console.error('Error de configuración:', error.message);
      return Promise.reject(error);
    }
  }
);

export const authService = {
  async login({ email, password }) {
    try {
      const response = await api.post('/auth/login', {
        correo: email,
        password: password
      });
      
      if (!response.token || !response.user) {
        throw new Error('Respuesta del servidor inválida');
      }
      
      return {
        token: response.token,
        user: response.user
      };
    } catch (error) {
      if (error.message.includes('401')) {
        throw new Error('Credenciales incorrectas');
      }
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
      // Continuamos con el logout local incluso si falla el servidor
    }
  }
};

export const dashboardService = {
  async getStats() {
    return api.get('/dashboard/stats');
  },
  
  async getIndicadores() {
    return api.get('/dashboard/indicadores');
  }
};

export const bodegaService = {
  async getData() {
    return api.get('/bodegas/data');
  }
};

export const productService = {
  async getAll() {
    return api.get('/productos');
  },
  
  async getById(id) {
    return api.get(`/productos/${id}`);
  },
  
  async getUbicaciones(id) {
    return api.get(`/productos/${id}/ubicaciones`);
  },
  
  async getCategorias() {
    return api.get('/categorias');
  },
  
  async create(product) {
    return api.post('/productos', product);
  },
  
  async update(id, product) {
    return api.put(`/productos/${id}`, product);
  },
  
  async delete(id) {
    return api.delete(`/productos/${id}`);
  }
};

export const categoryService = {
  async getAll() {
    return api.get('/productos/categorias');
  },
  
  async getById(id) {
    return api.get(`/productos/categorias/${id}`);
  },
  
  async create(category) {
    return api.post('/categorias', category);
  },
  
  async update(id, category) {
    return api.put(`/categorias/${id}`, category);
  },
  
  async delete(id) {
    return api.delete(`/categorias/${id}`);
  }
};

export default api; 