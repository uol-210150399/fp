export default () => ({
  port: process.env.PORT,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  nodeEnv: process.env.NODE_ENV,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
});
