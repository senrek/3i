
import React from 'react';

const LoadingPlaceholder = () => {
  return (
    <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-8">
      <div className="md:col-span-6 lg:col-span-5 space-y-6">
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-3 space-y-6">
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
