import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { getPosts } from '../api';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts('limit=6');
        setPosts(data.posts);
      } catch (error) {
        console.error(error.message || 'Error fetching posts');
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20">
      {/* Editorial Hero Section */}
      <div className='max-w-5xl mx-auto px-4 py-16 md:py-24 flex flex-col gap-6 text-center items-center'>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
          <span>AI-Powered Textile Research</span>
        </div>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white max-w-3xl leading-tight'>
          The Textile Manufacturing &amp; Technology Journal
        </h1>
        <p className='max-w-2xl text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed'>
          Explore deep technical insights on Fibre, Yarn, and Fabric manufacturing. Powered by MERN and Gemini-2.5-Flash RAG pipelines to assist you in drafting factual, documentation-constrained articles from manuals and reports.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <Link
            to='/search'
            className='px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all'
          >
            Explore articles
          </Link>
          <Link
            to='/dashboard?tab=profile'
            className='px-5 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 shadow-sm transition-all'
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Featured Manufacturing Areas */}
      <div className='border-y border-slate-200 dark:border-slate-850 bg-slate-100/50 dark:bg-slate-900/30 py-12 px-4 transition-colors duration-200'>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-sans tracking-wide uppercase">Interactive Area Reference</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select manufacturing sections to browse or launch specialized research scopes</p>
          </div>
          <CallToAction />
        </div>
      </div>

      {/* Recent Articles Section */}
      <div className='max-w-6xl mx-auto px-4 py-16 flex flex-col gap-8'>
        {posts && posts.length > 0 ? (
          <div className='flex flex-col gap-8'>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white tracking-tight'>Recent Publications</h2>
              <Link
                to={'/search'}
                className='text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
              >
                View all articles &rarr;
              </Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to={'/search'}
                className='px-6 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all'
              >
                Load More Articles
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No articles available. Sign in as Admin to draft new posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
