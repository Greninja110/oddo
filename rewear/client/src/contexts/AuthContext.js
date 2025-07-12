// In rewear/client/src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Placeholder functions
  const login = async (email, password) => {
    console.log('Login attempted with:', email);
    // This would be replaced with actual API calls
    setUser({ username: 'Demo User', email });
    return true;
  };
  
  const register = async (email, username, password) => {
    console.log('Register attempted with:', email, username);
    return true;
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    user,
    login,
    register,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}