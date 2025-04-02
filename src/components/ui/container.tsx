
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = ({ className, children, ...props }: ContainerProps) => {
  return (
    <div className={cn("container mx-auto px-4", className)} {...props}>
      {children}
    </div>
  );
};
