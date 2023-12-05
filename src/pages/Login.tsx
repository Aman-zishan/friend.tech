import { SVGComponent } from '@/components/stacksSvg';
import useConnect from '@/lib/hooks/useConnect';
import React from 'react';

const LoginPage: React.FC = () => {
  const { connectWallet } = useConnect();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white w-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="px-4 py-6 text-center flex flex-row items-center justify-center gap-2">
            <SVGComponent />
            <h1 className="text-3xl font-normal leading-none">
              <span className="text-blue-500 text-5xl">sFriend</span>
              <span className=" text-5xl">.tech</span>
            </h1>
          </div>
        </div>

        <p className="text-gray-600 mb-28">The marketplace for your friends</p>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-4 hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
