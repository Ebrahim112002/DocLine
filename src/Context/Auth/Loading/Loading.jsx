import React from 'react';

const Loading = () => {
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
    </div>
  );
};

export default Loading;