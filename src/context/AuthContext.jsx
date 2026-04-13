import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Recuperar datos al montar el componente
  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    
    if (userDetails) {
      try {
        const parsedUser = JSON.parse(userDetails);
        setUser(parsedUser);
        setToken(parsedUser?.token);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error al parsear usuario de localStorage:", err);
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
  }, []);

  // Guardar usuario en localStorage y state
  const login = (userData) => {
    if (userData?.token) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setToken(userData.token);
      setIsAuthenticated(true);
    }
  };

  // Limpiar datos y localStorage
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Actualizar usuario
  const updateUser = (updatedUserData) => {
    const fullUser = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
