import React from 'react';
import   ErrorSvg  from './error.png';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <img src={ErrorSvg} alt="404" className="w-96" />
      <p className="text-lg mt-10 text-gray-600">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
