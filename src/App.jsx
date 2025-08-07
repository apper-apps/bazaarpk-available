import '@/index.css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
import ErrorComponent, { Error } from "@/components/ui/Error";
import Home from "@/components/pages/Home";
import ProductDetail from "@/components/pages/ProductDetail";
import Category from "@/components/pages/Category";
import Cart from "@/components/pages/Cart";
import AdminRoute from "@/components/pages/AdminRoute";
import Unauthorized from "@/components/pages/Unauthorized";
// Browser detection at module level to avoid re-computation
const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const browserInfo = {
    name: 'Unknown',
    version: 'Unknown',
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    screenReader: window.speechSynthesis !== undefined,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches
  };

  // Browser detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserInfo.name = 'Chrome';
    browserInfo.version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browserInfo.name = 'Firefox';
    browserInfo.version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserInfo.name = 'Safari';
    browserInfo.version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Edg')) {
    browserInfo.name = 'Edge';
    browserInfo.version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
  }

  return browserInfo;
};

// Static browser info - computed once
const BROWSER_INFO = detectBrowser();

function AppContent() {
  const navigate = useNavigate();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Ref to track component mount status
  const isMountedRef = useRef(true);

  // Initialize performance monitoring only once
  useEffect(() => {
    console.log('🔍 Browser Compatibility Check:', BROWSER_INFO);
    
    // Track compatibility issues
    if (parseInt(BROWSER_INFO.version) < 80 && BROWSER_INFO.name === 'Chrome') {
      console.warn('⚠️ Chrome version may have compatibility issues');
    }

    // Performance monitoring setup
    const initPerformanceMonitoring = () => {
      if ('performance' in window) {
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        if (navigationTiming && isMountedRef.current) {
          const metrics = {
            pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
            domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
            firstPaint: 0,
            firstContentfulPaint: 0
          };
          
          // Get paint timings
          const paintTimings = performance.getEntriesByType('paint');
          paintTimings.forEach(timing => {
            if (timing.name === 'first-paint') {
              metrics.firstPaint = timing.startTime;
            } else if (timing.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = timing.startTime;
            }
          });
          
          if (isMountedRef.current) {
            setPerformanceMetrics(metrics);
            console.log('📊 Performance Metrics:', metrics);
            
            // Track performance in analytics
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'page_performance', {
                page_load_time: Math.round(metrics.pageLoadTime),
                dom_content_loaded: Math.round(metrics.domContentLoaded),
                first_contentful_paint: Math.round(metrics.firstContentfulPaint),
                browser_name: BROWSER_INFO.name || 'unknown'
              });
            }
          }
        }
      }
};

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background content-layer">
      {/* Admin Loading Progress Bar */}
        <Header />
        
<main>
<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/category" element={<Category />} />
            <Route path="/deals" element={<Category />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
</Routes>
        </main>

        <CartDrawer 
          isOpen={isCartDrawerOpen} 
          onClose={() => setIsCartDrawerOpen(false)} 
        />
<ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* Admin Access Portal - Footer Entry Point */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-display font-bold text-lg mb-4">BazaarPK</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your trusted online marketplace for fresh, organic, and quality products across Pakistan.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
<div>
                <h4 className="font-medium mb-4">System</h4>
                <div className="space-y-2">
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-6 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 BazaarPK. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;