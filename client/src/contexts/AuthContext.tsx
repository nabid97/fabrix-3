import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Auth } from 'aws-amplify';

interface User {
  email: string;
  sub: string;
  name?: string;
}



interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signOut: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser({
        email: userData.attributes.email,
        sub: userData.attributes.sub,
        name: userData.attributes.name,
      });
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Inside your login method
const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const userData = await Auth.signIn(email, password);
    setIsAuthenticated(true);
    setUser({
      email: userData.attributes.email,
      sub: userData.attributes.sub,
      name: userData.attributes.name || userData.attributes.email.split('@')[0] || 'User',
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    // More detailed error handling
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'UserNotFoundException') {
        throw new Error('User not found. Please check your email address or sign up.');
      } else if (error.code === 'NotAuthorizedException') {
        throw new Error('Incorrect email or password. Please try again.');
      } else if (error.code === 'UserNotConfirmedException') {
        throw new Error('Please confirm your account by clicking the link in the verification email.');
      }
    }
    // Re-throw the error if it doesn't match our known error types
    throw error;
  } finally {
    setLoading(false);
  }
};
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await Auth.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    signOut: logout, // Add signOut alias for logout to match interface requirements
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Remove or comment out this line if you're using the named export
// export default AuthContext;

// Or keep this line if you want to export both:
export default AuthContext;