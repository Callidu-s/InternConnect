
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'company') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (profileData: Partial<User>) => void;
  isLoading: boolean;
  getUserById: (id: string) => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load user from localStorage on initial render
    const loadUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    loadUser();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };
    
    const handleCustomEvent = () => {
      const updatedUser = localStorage.getItem('currentUser');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userStateChange', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChange', handleCustomEvent);
    };
  }, []);
  
  const login = async (email: string, password: string, role: 'student' | 'company'): Promise<boolean> => {
    setIsLoading(true);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const foundUser = users.find((u: any) => 
      u.email === email && 
      u.password === password &&
      u.role === role
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      window.dispatchEvent(new Event('userStateChange'));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userStateChange'));
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === user.id ? { ...u, ...profileData } : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    window.dispatchEvent(new Event('userStateChange'));
  };
  
  const getUserById = (id: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.id === id);
    return foundUser || null;
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      updateUserProfile,
      isLoading,
      getUserById,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
