import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { signUp } from '../api';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      await signUp(formData);
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
      setLoading(false);
    }
  };
  return (
    <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950/20'>
      <div className='max-w-4xl w-full flex flex-col md:flex-row gap-10 items-stretch md:items-center'>
        {/* left pane */}
        <div className='flex-1 flex flex-col justify-center gap-4'>
          <Link to="/" className="flex items-center gap-2 group self-start -ml-1 sm:-ml-2">
            <span className="font-extrabold text-2xl tracking-wider text-slate-800 dark:text-slate-100 font-sans">
              TEX <span className="text-indigo-600 dark:text-indigo-400">∞</span> <span className="text-slate-700 dark:text-slate-300">UN</span>
            </span>
          </Link>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            Create an Author Account
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
            Join our expert community. Sign up to submit technical papers, draft posts using documentation references, and discuss manufacturing best practices.
          </p>
        </div>

        {/* right pane */}
        <div className='flex-grow md:w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label value='Username' className="text-xs font-semibold text-slate-650 dark:text-slate-400 uppercase tracking-wider" />
              </div>
              <TextInput
                type='text'
                placeholder='E.g., yarn_master'
                id='username'
                required
                onChange={handleChange}
              />
            </div>
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
                  <span className='pl-3'>Creating Account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-xs mt-6 text-slate-500 dark:text-slate-400 justify-center border-t border-slate-100 dark:border-slate-800 pt-4'>
            <span>Already have an account?</span>
            <Link to='/sign-in' className='text-indigo-600 dark:text-indigo-400 font-semibold hover:underline'>
              Sign In
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
