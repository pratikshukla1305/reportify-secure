
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SOSButton from '@/components/sos/SOSButton';
import SOSModal from '@/components/sos/SOSModal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  const handleSOSClick = () => {
    // Get user location when SOS is clicked
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowSOSModal(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Show modal anyway but without location
          setUserLocation(null);
          setShowSOSModal(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(null);
      setShowSOSModal(true);
    }
  };

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
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              Features
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              How it works
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Locate
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white">
                    <div className="grid gap-3 p-4 w-[400px]">
                      <Link 
                        to="/police-stations" 
                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="bg-blue-100 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-shield-blue" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Nearby Police Stations</h4>
                          <p className="text-xs text-gray-500">Find police stations near your location</p>
                        </div>
                      </Link>
                      <Link 
                        to="/case-heatmap" 
                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="bg-red-100 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Case Density Map</h4>
                          <p className="text-xs text-gray-500">View case reporting density across regions</p>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link to="/e-kyc" className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors">
              e-KYC
            </Link>
            
            {/* Help Us Link */}
            <Link 
              to="/help-us" 
              className="text-sm font-medium text-gray-700 hover:text-shield-blue transition-colors flex items-center"
            >
              <AlertCircle className="mr-1 h-4 w-4" />
              Help Us
            </Link>
            
            {/* SOS Button in Navbar */}
            <SOSButton onClick={handleSOSClick} className="scale-90" />
            
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
          <div className="md:hidden flex items-center space-x-3">
            <SOSButton onClick={handleSOSClick} className="scale-75" />
            <button
              className="text-gray-700"
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
            <div className="border-t border-gray-100 pt-2">
              <p className="text-base font-medium text-gray-700 mb-2">Locate</p>
              <Link
                to="/police-stations"
                className="block ml-4 py-2 text-sm text-gray-600 hover:text-shield-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nearby Police Stations
              </Link>
              <Link
                to="/case-heatmap"
                className="block ml-4 py-2 text-sm text-gray-600 hover:text-shield-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Case Density Map
              </Link>
            </div>
            <Link 
              to="/e-kyc" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              e-KYC
            </Link>
            
            {/* Help Us Mobile Link */}
            <Link 
              to="/help-us" 
              className="block text-base font-medium text-gray-700 hover:text-shield-blue transition-colors flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <AlertCircle className="mr-1 h-4 w-4" />
              Help Us
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

      {/* SOS Modal */}
      <SOSModal 
        open={showSOSModal} 
        onOpenChange={setShowSOSModal} 
        userLocation={userLocation} 
      />
    </header>
  );
};

export default Navbar;
