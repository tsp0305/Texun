import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import { signOut } from '../api';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await signOut();
      dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar fluid className='border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200 px-2 sm:px-3 lg:px-4'>
      <Link to="/" className="flex items-center gap-2 group -ml-1 sm:-ml-2">
        <div className="flex flex-col leading-tight">
          <span className="font-black text-xl tracking-[0.18em] text-slate-900 dark:text-slate-100">
            TEX <span className="text-indigo-600 dark:text-indigo-400">∞</span> <span className="text-slate-700 dark:text-slate-300">UN</span>
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Textile Unlimited
          </span>
        </div>
      </Link>
      <form onSubmit={handleSubmit} className="hidden lg:block relative">
        <TextInput
          type='text'
          placeholder='Search articles...'
          rightIcon={AiOutlineSearch}
          className='w-64 xl:w-80'
          theme={{
            field: {
              input: {
                base: 'w-full focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-150 placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg text-sm transition-all',
              }
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to="/search" className='lg:hidden'>
        <Button className='w-10 h-10' color='gray' pill>
          <AiOutlineSearch className="w-5 h-5" />
        </Button>
      </Link>
      <div className='flex gap-2 md:order-2 items-center'>
        <Button
          className='w-10 h-10 flex items-center justify-center'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded size="sm" />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm font-semibold text-slate-700 dark:text-slate-300'>@{currentUser.username}</span>
              <span className='block text-xs text-slate-500 dark:text-slate-400 truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item className="text-sm">Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} className="text-sm text-red-500 hover:text-red-600">Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button size="sm" gradientDuoTone='purpleToBlue' outline className="font-medium">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'} className="font-medium">
          <Link to='/' className={path === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'} className="font-medium">
          <Link to='/about' className={path === '/about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'}>About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
