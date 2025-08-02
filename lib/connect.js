import mongoose from 'mongoose';

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST = 'localhost',
  MONGO_PORT = '27017',
  MONGO_DB = 'userManagement'
} = process.env;

const authPart = MONGO_USERNAME && MONGO_PASSWORD ? `${MONGO_USERNAME}:${MONGO_PASSWORD}@` : '';

const connectionString = `mongodb+srv://abhijith:mongodb@cluster0.ppkyk1l.mongodb.net/user_management?retryWrites=true&w=majority&appName=Cluster0`;

export const connect = () => {
  mongoose.connect(connectionString)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
}
