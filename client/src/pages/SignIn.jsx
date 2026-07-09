import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20'>
      <div className='max-w-4xl w-full flex flex-col md:flex-row gap-10 items-stretch md:items-center'>
        {/* left pane */}
        <div className='flex-1 flex flex-col justify-center gap-4'>
          <Link to="/" className="flex items-center gap-2 group self-start">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-slate-800 dark:text-slate-100 font-sans">
              TEX<span className="text-indigo-600 dark:text-indigo-400">UN</span>
            </span>
          </Link>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            The Textile Manufacturing &amp; Technology Journal
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
            Access advanced technical manuals, research reports, and industry insights. Sign in to collaborate, leave feedback, or use the Gemini RAG blogging assistant.
          </p>
        </div>

        {/* right pane */}
        <div className='flex-grow md:w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label value='Email Address' className="text-xs font-semibold text-slate-650 dark:text-slate-400 uppercase tracking-wider" />
              </div>
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value='Password' className="text-xs font-semibold text-slate-650 dark:text-slate-400 uppercase tracking-wider" />
              </div>
              <TextInput
                type='password'
                placeholder='••••••••'
                id='password'
                required
                onChange={handleChange}
              />
            </div>
            <Button
              color='indigo'
              type='submit'
              disabled={loading}
              className="font-semibold text-sm py-0.5 mt-2"
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-xs mt-6 text-slate-500 dark:text-slate-400 justify-center border-t border-slate-100 dark:border-slate-800 pt-4'>
            <span>Don't have an account yet?</span>
            <Link to='/sign-up' className='text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-4 text-xs' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
