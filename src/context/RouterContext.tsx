import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface RouterContextValue {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

const normalizePath = (raw: string): string => {
  if (raw.startsWith('#')) {
    const withoutHash = raw.slice(1);
    return withoutHash ? (withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`) : '/';
  }
  const clean = raw.split('?')[0].split('#')[0];
  return clean || '/';
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    if (window.location.hash.startsWith('#/')) {
      return normalizePath(window.location.hash);
    }
    return normalizePath(window.location.pathname);
  });

  const navigate = useCallback(
    (path: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
      const normalized = normalizePath(path);
      const targetUrl = path.startsWith('#') ? path : normalized;

      if (options?.replace) {
        window.history.replaceState({}, '', targetUrl);
      } else {
        window.history.pushState({}, '', targetUrl);
      }

      setCurrentPath(normalized);

      if (options?.scrollToTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash.startsWith('#/')) {
        setCurrentPath(normalizePath(window.location.hash));
      } else {
        setCurrentPath(normalizePath(window.location.pathname));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextValue => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, className, children, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !props.target && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (href.startsWith('/') || href.startsWith('#/')) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
