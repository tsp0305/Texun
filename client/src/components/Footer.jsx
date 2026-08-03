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
            <Link to="/" className="flex items-center gap-2 group -ml-1 sm:-ml-2">
              <span className="font-semibold text-sm tracking-[0.25em] text-slate-800 dark:text-slate-100">
                TEX <span className="text-indigo-600 dark:text-indigo-400">∞</span> <span className="text-slate-700 dark:text-slate-300">UN</span>
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
            by="TEX ∞ UN. All rights reserved."
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
