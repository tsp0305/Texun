import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  // Determine pastel badge style based on the manufacturing product type
  const getBadgeStyle = (prod) => {
    switch (prod) {
      case 'Fibre Manufacturing':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-100 dark:border-sky-900/50';
      case 'Yarn Manufacturing':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50';
      case 'Fabric Manufacturing':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-100 dark:border-purple-900/50';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700/50';
    }
  };

  const readTime = Math.max(1, Math.round((post.content?.replace(/<[^>]*>/g, '').length || 0) / 1000));

  return (
    <div className='group flex flex-col w-full sm:w-[340px] h-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300'>
      <Link to={`/post/${post.slug}`} className="relative block h-[180px] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img
          src={post.image}
          alt={post.title}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </Link>
      <div className='p-4 flex flex-col justify-between flex-grow gap-2'>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(post.product)}`}>
              {post.product || 'General'}
            </span>
            {post.category && post.category !== 'uncategorized' && (
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {post.category}
              </span>
            )}
          </div>
          <Link to={`/post/${post.slug}`}>
            <h4 className='text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              {post.title}
            </h4>
          </Link>
        </div>
        <div className='flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto'>
          <span>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} min read
          </span>
        </div>
      </div>
    </div>
  );
}
