import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  switchUserRole: (role: Role) => void;
  switchUserAccount: (userId: string) => void;
  allDemoUsers: User[];
  logout: () => void;
  loginAs: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Default to Business Owner (Rajesh Kumar - Apex Tech)

  const switchUserRole = (role: Role) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || {
      ...currentUser,
      role,
    };
    setCurrentUser(targetUser);
  };

  const switchUserAccount = (userId: string) => {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    // Demo fallback logout
    setCurrentUser({
      id: 'logged_out',
      name: 'Guest User',
      email: 'guest@spincityalliance.com',
      role: 'BUSINESS_OWNER',
      status: 'SUSPENDED',
      lastActive: 'Offline',
    });
  };

  const loginAs = (email: string) => {
    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // If unknown email, create a new demo Business Owner
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].toUpperCase() + ' Business',
      email,
      role: 'BUSINESS_OWNER',
      allianceId: 'all_blr',
      allianceName: 'Bangalore Business Alliance',
      status: 'ACTIVE',
      lastActive: 'Just now',
    };
    setCurrentUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUserRole,
        switchUserAccount,
        allDemoUsers: INITIAL_USERS,
        logout,
        loginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
