export const Auth = {
  currentAuthenticatedUser: async () => {
    return {
      attributes: {
        email: 'test@example.com',
        sub: '123',
        name: 'Test User'
      }
    };
  },
  signIn: async (email: string, password: string) => {
    return {
      attributes: {
        email: email,
        sub: '123',
        name: email.split('@')[0]
      }
    };
  },
  signUp: async (params: {
    username: string;
    password: string;
    attributes: {
      email: string;
      name: string;
    };
  }) => {
    return {
      user: {
        username: params.username
      }
    };
  },
  signOut: async () => ({}),
  forgotPassword: async (email: string) => ({}),
  forgotPasswordSubmit: async (email: string, code: string, newPassword: string) => ({})
};