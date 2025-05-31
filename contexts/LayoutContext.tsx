import React, { createContext, useContext } from 'react';

interface LayoutContextType {
  isSidebarOpen: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = LayoutContext.Provider;

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};
