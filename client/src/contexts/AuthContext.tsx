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
  register: (username: string, password: string, name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  verifyAccount: (username: string, code: string) => Promise<boolean>;
  resendVerificationCode: (username: string) => Promise<boolean>;
  updateUserAttributes: (attributes: Record<string, string>) => Promise<boolean>;
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

  const login = async (emailOrUsername: string, password: string) => {
    setLoading(true);
    try {
      let username = emailOrUsername;
      if (emailOrUsername.includes('@')) {
        username = emailOrUsername.split('@')[0];
      }
      const userData = await Auth.signIn(username, password);
      setIsAuthenticated(true);
      setUser({
        email: userData.attributes.email,
        sub: userData.attributes.sub,
        name: userData.attributes.name || userData.attributes.email.split('@')[0] || 'User',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'UserNotFoundException') {
        throw new Error('Account not found. Please check your username or register.');
      } else if (error.code === 'NotAuthorizedException') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.message.includes('email format')) {
        throw new Error('Please enter your username, not email address.');
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, name: string, email: string) => {
    setLoading(true);
    try {
      const { user } = await Auth.signUp({
        username: username,
        password,
        attributes: {
          name,
          email
        }
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

  const verifyAccount = async (username: string, code: string) => {
    try {
      await Auth.confirmSignUp(username, code);
      return true;
    } catch (error) {
      console.error('Error confirming sign up', error);
      throw error;
    }
  };

  const resendVerificationCode = async (username: string) => {
    try {
      await Auth.resendSignUp(username);
      return true;
    } catch (error) {
      console.error('Error resending code', error);
      throw error;
    }
  };

  const updateUserAttributes = async (attributes: Record<string, string>) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, attributes);
      return true;
    } catch (error) {
      console.error('Error updating user attributes:', error);
      throw error;
    }
  };

  // Add this to log user state changes
  useEffect(() => {
    console.log("Current user data:", user);
  }, [user]);

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
    verifyAccount,
    resendVerificationCode,
    updateUserAttributes
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Remove or comment out this line if you're using the named export
// export default AuthContext;

// Or keep this line if you want to export both:
export default AuthContext;