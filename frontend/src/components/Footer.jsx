import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './utils/Logo';

function Footer() {
  return (
    <div className='border-t-2 border-t-gray-400/10 relative overflow-hidden bg-gray-box w-full p-5 pl-6 pt-14 pb-20 text-main-text'>
      <br />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Link to='/'>
                    <Logo size='text-5xl' />
                </Link>
              </div>
              <div>
                <a href="https://harshrana.in" target='_blank' rel="noopener noreferrer">
                  <p className="text-sm">&copy; Harsh Rana</p>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-medium uppercase">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Features
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-medium uppercase ">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Account
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Help
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-medium uppercase ">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-sm font-light text-main-text/80 hover:text-main-text" to="/">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Footer;
