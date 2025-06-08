const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Función para manejar errores de localStorage
const safeStorage = {
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  },
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error leyendo de localStorage:', error);
      return null;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
      return false;
    }
  }
};

export const auth = {
  setToken(token) {
    return safeStorage.set(TOKEN_KEY, token);
  },

  getToken() {
    return safeStorage.get(TOKEN_KEY);
  },

  removeToken() {
    return safeStorage.remove(TOKEN_KEY);
  },

  setUser(user) {
    try {
      const userString = JSON.stringify(user);
      return safeStorage.set(USER_KEY, userString);
    } catch (error) {
      console.error('Error serializando usuario:', error);
      return false;
    }
  },

  getUser() {
    try {
      const userString = safeStorage.get(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parseando usuario:', error);
      this.removeUser(); // Limpiar datos corruptos
      return null;
    }
  },

  removeUser() {
    return safeStorage.remove(USER_KEY);
  },

  login(token, user) {
    const tokenSet = this.setToken(token);
    const userSet = this.setUser(user);
    return tokenSet && userSet;
  },

  logout() {
    this.removeToken();
    this.removeUser();
    // Limpiar cualquier otro dato de sesión si es necesario
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  },

  // Método para verificar y limpiar datos corruptos
  validateStoredData() {
    try {
      const user = this.getUser();
      const token = this.getToken();

      if (!user || !token) {
        this.logout();
        return false;
      }

      // Verificar que el usuario tenga la estructura esperada
      if (!user.id || !user.nombre || !user.correo) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validando datos almacenados:', error);
      this.logout();
      return false;
    }
  }
}; 