import { Button, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

const product = {
  'Fibre Manufacturing': {
    types: {
      Type: ['Natural fibre', 'Manmade fibre'],
      Process: [],
    },
  },
  'Yarn Manufacturing': {
    types: {
      'Ring Spinning': [
        'Mixing',
        'Blowroom',
        'Carding',
        'Breaker Drawframe',
        'Lapformer',
        'Comber',
        'Finisher Drawframe',
        'Speedframe',
        'Ringframe',
        'Autoconer',
      ],
      'Open End Spinning': ['Mixing', 'Blowroom', 'Carding', 'Finisher Drawframe'],
      'Air Jet Spinning': ['Mixing', 'Blowroom', 'Carding', 'Finisher Drawframe'],
      Accessories: [
        'Wire clothing',
        'Cots',
        'Apron',
        'Rings & Traveller',
        'Bobbin transport',
        'OHTC',
        'Yarn clearers',
        'WCS Plant',
        'Humidification plant',
        'Compressor',
        'Yarn conditioning',
      ],
      Costing: ['Yarn realisation', 'Count conversion costing', 'Store consumption costing'],
    },
  },
  'Fabric Manufacturing': {
    types: {
      Knitting: [],
      Weaving: ['Warping', 'Sizing', 'Looms'],
      Garmenting: ['Scouring', 'Finishing', 'Cutting', 'Sewing'],
    },
  },
};

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    product: 'nil',
    category: 'uncategorized',
    department: 'not selected',
    articleType: 'Others',
  });

  const [subCategories, setSubCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;
    setSidebarData((prev) => ({ ...prev, product: selectedProduct, category: 'uncategorized', department: 'not selected' }));
    setSubCategories(Object.keys(product[selectedProduct]?.types || {}));
    setTypes([]);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const typesForCategory = product[sidebarData.product]?.types[selectedCategory] || [];
    setSidebarData((prev) => ({ ...prev, category: selectedCategory, department: 'not selected' }));
    setTypes(typesForCategory);
  };

  const handleTypeChange = (e) => {
    setSidebarData((prev) => ({ ...prev, department: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(sidebarData)) {
      urlParams.set(key, value);
    }
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const productFromUrl = urlParams.get('product') || '';
    const categoryFromUrl = urlParams.get('category') || '';
    const departmentFromUrl = urlParams.get('department') || '';
    const articleTypeFromUrl = urlParams.get('articleType') || '';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      product: productFromUrl || 'nil',
      category: categoryFromUrl || 'uncategorized',
      department: departmentFromUrl || 'not selected',
      articleType: articleTypeFromUrl || 'Others',
    });

    if (productFromUrl && productFromUrl !== 'nil' && product[productFromUrl]) {
      setSubCategories(Object.keys(product[productFromUrl].types || {}));
      if (categoryFromUrl && categoryFromUrl !== 'uncategorized' && product[productFromUrl].types[categoryFromUrl]) {
        setTypes(product[productFromUrl].types[categoryFromUrl]);
      } else {
        setTypes([]);
      }
    } else {
      setSubCategories([]);
      setTypes([]);
    }

    const fetchPosts = async () => {
      setLoading(true);
      const cleanedParams = new URLSearchParams();
      if (searchTermFromUrl) cleanedParams.set('searchTerm', searchTermFromUrl);
      if (sortFromUrl) cleanedParams.set('order', sortFromUrl);
      if (productFromUrl && productFromUrl !== 'nil') cleanedParams.set('product', productFromUrl);
      if (categoryFromUrl && categoryFromUrl !== 'uncategorized' && categoryFromUrl !== '') cleanedParams.set('category', categoryFromUrl);
      if (departmentFromUrl && departmentFromUrl !== 'not selected' && departmentFromUrl !== '') cleanedParams.set('department', departmentFromUrl);
      if (articleTypeFromUrl && articleTypeFromUrl !== 'Others') cleanedParams.set('articleType', articleTypeFromUrl);

      try {
        const res = await fetch(`/api/post/getposts?${cleanedParams.toString()}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    
    const cleanedParams = new URLSearchParams();
    const searchTerm = urlParams.get('searchTerm');
    const sort = urlParams.get('sort') || 'desc';
    const productVal = urlParams.get('product');
    const categoryVal = urlParams.get('category');
    const departmentVal = urlParams.get('department');
    const articleTypeVal = urlParams.get('articleType');

    if (searchTerm) cleanedParams.set('searchTerm', searchTerm);
    if (sort) cleanedParams.set('order', sort);
    if (productVal && productVal !== 'nil') cleanedParams.set('product', productVal);
    if (categoryVal && categoryVal !== 'uncategorized' && categoryVal !== '') cleanedParams.set('category', categoryVal);
    if (departmentVal && departmentVal !== 'not selected' && departmentVal !== '') cleanedParams.set('department', departmentVal);
    if (articleTypeVal && articleTypeVal !== 'Others') cleanedParams.set('articleType', articleTypeVal);
    cleanedParams.set('startIndex', startIndex);

    try {
      const res = await fetch(`/api/post/getposts?${cleanedParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-slate-50/30 dark:bg-slate-950/20'>
      {/* Filters Sidebar */}
      <div className='p-6 md:p-8 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 w-full md:w-80 flex-shrink-0 transition-colors duration-200'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Filter Articles</h3>
          
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide'>Product Scope</label>
            <Select id='product' value={sidebarData.product} onChange={handleProductChange} className="w-full">
              <option value='nil'>Select Product</option>
              {Object.keys(product).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Select>
          </div>
 
          {subCategories.length > 0 && (
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide'>Category</label>
              <Select id='category' value={sidebarData.category} onChange={handleCategoryChange} className="w-full">
                <option value='uncategorized'>Select Category</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </Select>
            </div>
          )}
 
          {types.length > 0 && (
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide'>Department</label>
              <Select id='department' value={sidebarData.department} onChange={handleTypeChange} className="w-full">
                <option value='not selected'>Select Department</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          )}
 
          <div className='flex flex-col gap-2'>
            <label className='text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide'>Article Type</label>
            <Select id='articleType' value={sidebarData.articleType} onChange={handleChange} className="w-full">
              <option value='Others'>Select Article Type</option>
              <option value='Machines'>Machines</option>
              <option value='MOP'>MOP</option>
              <option value='Manual'>Manual</option>
              <option value='Formulas'>Formulas</option>
            </Select>
          </div>
 
          <Button type='submit' color="indigo" className="font-semibold mt-2">
            Apply Filters
          </Button>
        </form>
      </div>
 
      {/* Results grid */}
      <div className='w-full'>
        <div className="border-b border-slate-200 dark:border-slate-800 p-5 mt-2 flex items-center justify-between">
          <h1 className='text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Publication Results
          </h1>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {posts ? posts.length : 0} articles matched
          </span>
        </div>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'>
          {!loading && posts.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
              <p className='text-base'>No articles matched the filter selection.</p>
            </div>
          )}
          {loading && (
            <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className='mt-3 text-sm'>Loading publications...</p>
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <div className="col-span-full flex justify-center w-full mt-4">
              <button
                onClick={handleShowMore}
                className='px-6 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all'
              >
                Show More Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
