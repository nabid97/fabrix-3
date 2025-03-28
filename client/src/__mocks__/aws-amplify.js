export const Auth = {
  currentAuthenticatedUser: jest.fn().mockResolvedValue({
    attributes: {
      email: 'test@example.com',
      name: 'Test User'
    },
    username: 'testuser123'
  }),
  signOut: jest.fn(),
  signIn: jest.fn(),
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  forgotPassword: jest.fn(),
  forgotPasswordSubmit: jest.fn()
};

export const API = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn()
};

export const Storage = {
  get: jest.fn(),
  put: jest.fn(),
  remove: jest.fn()
};