import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

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
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
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
    <Navbar className='border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200'>
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors duration-250">
          <svg
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-wider text-slate-800 dark:text-slate-100 font-sans">
          TEX<span className="text-indigo-600 dark:text-indigo-400">UN</span>
        </span>
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
