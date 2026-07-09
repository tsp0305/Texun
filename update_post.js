import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './api/models/post.model.js';

dotenv.config();

async function updateDb() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected!');
    
    // Find the post with title "Carding process" and update it
    const post = await Post.findOne({ title: "Carding process" });
    if (post) {
      console.log('Found post:', post.title);
      post.category = 'Ring Spinning';
      post.department = 'Carding';
      await post.save();
      console.log('Post updated successfully!');
    } else {
      console.log('Post "Carding process" not found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateDb();
