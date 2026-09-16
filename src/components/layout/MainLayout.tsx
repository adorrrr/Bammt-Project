import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { WaterAtmosphere } from '../effects/WaterAtmosphere';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll restoration on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gangchill-canvas text-gangchill-ink antialiased">
      {/* Skip to Content for Keyboard & Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gangchill-green focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        মূল বিষয়বস্তুতে যান (Skip to main content)
      </a>

      <WaterAtmosphere />
      <DesktopHeader />
      <MobileHeader />
      <main id="main-content" className="flex-1 w-full relative z-10 pb-36 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
