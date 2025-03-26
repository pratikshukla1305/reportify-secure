
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-2' : 'bg-transparent py-4'
    )}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-shield-blue animate-fade-in" />
            <span className="text-xl font-semibold bg-clip-text text-shield-dark">Midshield</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Features
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              How it works
            </Link>
            <Link to="/signin" className="text-sm font-medium">
              <Button 
                variant="outline" 
                className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/get-started" className="text-sm font-medium">
              <Button className="bg-shield-blue text-white hover:bg-blue-600 transition-all">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-5 space-y-4">
            <Link 
              to="/home" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <div className="pt-4 space-y-3">
              <Link to="/signin" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-center border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/get-started" className="block w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  className="w-full justify-center bg-shield-blue text-white hover:bg-blue-600 transition-all"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
