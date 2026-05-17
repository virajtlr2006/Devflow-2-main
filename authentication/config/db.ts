import mongoose from 'mongoose';
export const ConnectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://parekhyash1103_db_user:Yash-Parekh-1103@cluster0.6thw74j.mongodb.net/Devflow?appName=Cluster0');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
