import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 rounded-none shadow-none">
      <div className="w-full max-w-4xl mx-auto py-4">
        {/* Main grid for footer content */}
        <div className="flex flex-wrap justify-between items-center sm:flex-row gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors duration-200">
                <svg
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
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
              <span className="font-bold text-base tracking-wider text-slate-800 dark:text-slate-100 font-sans">
                TEX<span className="text-indigo-600 dark:text-indigo-400">UN</span>
              </span>
            </Link>
          </div>

          {/* Footer Links Section */}
          <div className="flex gap-8 text-sm">
            <div>
              <Footer.Link
                href="/about"
                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                About TEXUN
              </Footer.Link>
            </div>
            <div>
              <Footer.Link href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Footer.Link>
            </div>
            <div>
              <Footer.Link href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                Terms of Service
              </Footer.Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Footer.Divider className="my-4 border-slate-150 dark:border-slate-800" />

        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
          <Footer.Copyright
            href="#"
            by="TEXUN. All rights reserved."
            year={new Date().getFullYear()}
            className="text-slate-400 dark:text-slate-500"
          />
          <div className="flex gap-2">
            <Footer.Icon href="#" icon={BsDribbble} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400" />
          </div>
        </div>
      </div>
    </Footer>
  );
}
