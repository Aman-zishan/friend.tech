import LeftMenu from '@/components/leftMenu';
import React from 'react';

const Explore = () => {
  return (
    <body className="relative bg-blue-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">Coming Soon</h1>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default Explore;
