import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-3xl mx-auto py-1">
        {/* Main grid for footer content */}
        <div className="flex flex-wrap justify-between items-center sm:flex-row">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" style={{ position: 'relative', display: 'inline-block' }}>
              {/* "Texun" Logo */}
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.6rem', // Slightly smaller font size
                  color: 'transparent',
                  background: 'linear-gradient(to right, #2c3e50, #2980b9)',
                  WebkitBackgroundClip: 'text',
                  letterSpacing: '0.1rem',
                }}
              >
                TEX<span style={{ marginLeft: '0.25rem' }}></span>UN
              </span>
            </Link>
          </div>

          {/* Footer Links Section */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-1">
            <div>
              <Footer.Title title="About" className="text-sm" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  Sahand's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" className="text-sm" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-sm">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" className="text-sm">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Footer.Divider className="my-1" />

        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center flex-wrap">
          <Footer.Copyright
            href="#"
            by="Texun blog"
            year={new Date().getFullYear()}
            className="text-sm"
          />
          <div className="flex gap-1">
            <Footer.Icon href="#" icon={BsDribbble} className="text-sm" />
          </div>
        </div>
      </div>
    </Footer>
  );
}
