import mongoose from 'mongoose';

const Post = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
  color: { type: String, required: false },
  webGPU: {type: String, required: false }, 
  question: {type: String, required: false}
});

const PostSchema = mongoose.model('Post', Post);

export default PostSchema;
