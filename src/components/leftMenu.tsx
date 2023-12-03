import React from 'react';
import { NavLink } from 'react-router-dom';
import { SVGComponent } from './stacksSvg';
import ConnectWallet from './connectWallet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const LeftMenu = () => {
  const getNavLinkClass = ({ isActive }: any) => {
    return isActive
      ? 'flex items-center gap-5 bg-blue-500 rounded-xl font-bold text-md text-white py-3 px-4'
      : 'flex items-center gap-5 bg-white hover:bg-blue-50 rounded-xl font-bold text-md text-gray-900 py-3 px-4';
  };
  return (
    <aside className="fixed inset-y-0 left-0 bg-white shadow-md w-80 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow">
          <div className="px-4 py-6 text-center border-b flex flex-row items-center justify-center gap-2">
            <SVGComponent />
            <h1 className="text-xl font-normal leading-none">
              <span className="text-blue-500">sFriend</span>.tech
            </h1>
          </div>
          <div className="p-4">
            <ul className="space-y-5">
              <li>
                <NavLink to={'/home'} className={getNavLinkClass}>
                  <img src="assets/home.png" alt="" width={50} />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={'/chats'} className={getNavLinkClass}>
                  <img src="assets/chats.png" alt="" width={50} />
                  Chats
                </NavLink>
              </li>
              <li>
                <NavLink to={'/explore'} className={getNavLinkClass}>
                  <img src="assets/search.png" alt="" width={50} />
                  Explore
                </NavLink>
              </li>
              <li>
                <NavLink to={'/profile'} className={getNavLinkClass}>
                  <img src="assets/profile.png" alt="" width={50} />
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-10 pb-25">
          <ConnectWallet />
        </div>
      </div>
    </aside>
  );
};

export default LeftMenu;
