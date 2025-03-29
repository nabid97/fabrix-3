interface Config {
  jwtSecret: string;
  port: number;
  mongoURI: string;
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
}

const config: Config = {
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/fabrix',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    user: process.env.EMAIL_USER || 'your-email@example.com',
    password: process.env.EMAIL_PASSWORD || 'your-email-password',
    from: process.env.EMAIL_FROM || 'your-email@example.com',
  },
};

export default config;