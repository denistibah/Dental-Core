import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { getUsers, getCurrentUser, setCurrentUser, saveUsers } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login logic
  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  // Register logic
  const register = (email: string, password: string, role: string): boolean => {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    // Create a new user
    // const newUser: User = { email, password, role };
    // users.push(newUser);
    // saveUsers(users); // Save the updated users list

    // setUser(newUser);
    // setIsAuthenticated(true);
    // setCurrentUser(newUser);
    return true;
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register, // Add register function to the context
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
