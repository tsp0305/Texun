import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    product: {
      type: String,
      default: 'uncategorized',
    },
    category : {
      type : String,
      default : 'not applicable'
    },
    subCategory : {
      type : String,
      defaut : 'not applicable'
    },
    department : {
      type : String,
      default : 'not applicable'
     },

     articleType : {
        type : String,
        default : 'others'
     },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
