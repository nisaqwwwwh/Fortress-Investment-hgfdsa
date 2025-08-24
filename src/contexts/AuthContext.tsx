import React, { createContext, useContext } from 'react';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  portfolio: {
    balance: number;
    balances: {
      USDT: number;
      [key: string]: number;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const userData = useQuery(api.users.getFullUser, isAuthenticated ? {} : "skip");
  
  const isLoading = authLoading || (isAuthenticated && userData === undefined);
  
  const user: User | null = userData ? {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    image: userData.image,
    portfolio: {
      balance: userData.portfolio?.balances?.USDT || 0,
      balances: userData.portfolio?.balances || { USDT: 0 }
    }
  } : null;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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
