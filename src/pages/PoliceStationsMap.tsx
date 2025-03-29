
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import MapComponent from '@/components/maps/MapComponent';
import PoliceStationCard from '@/components/maps/PoliceStationCard';
import { policeStations } from '@/data/policeStations';

const PoliceStationsMap = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [tokenInputVisible, setTokenInputVisible] = useState(false);

  // Filter police stations based on search query
  const filteredStations = searchQuery 
    ? policeStations.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : policeStations;

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a location in India if geolocation fails
          setUserLocation({ lat: 13.082680, lng: 80.270718 }); // Chennai
          setLoading(false);
          toast({
            title: "Location access denied",
            description: "We're showing police stations in Chennai, India. Allow location access for more accurate results.",
            variant: "destructive"
          });
        }
      );
    } else {
      // Default to a location in India if geolocation is not supported
      setUserLocation({ lat: 13.082680, lng: 80.270718 }); // Chennai
      setLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. We're showing police stations in Chennai, India.",
        variant: "destructive"
      });
    }
  }, []);

  const handleStationClick = (stationId: string) => {
    navigate(`/police-station/${stationId}`);
  };

  const handleMapboxTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenInputVisible(false);
      toast({
        title: "Mapbox token saved",
        description: "Your Mapbox token has been saved for this session.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow mt-16 md:mt-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-shield-dark">Nearby Police Stations</h1>
              <p className="text-gray-600 mt-1">
                Find and connect with police stations in your vicinity
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search police stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button 
                variant="outline"
                onClick={() => setTokenInputVisible(true)}
                className="whitespace-nowrap"
              >
                Set Mapbox Token
              </Button>
            </div>
          </div>

          {tokenInputVisible && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <form onSubmit={handleMapboxTokenSubmit} className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">
                  Please enter your Mapbox public token to enable the map. You can get one from{" "}
                  <a 
                    href="https://account.mapbox.com/access-tokens/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Mapbox
                  </a>
                </p>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="pk.eyJ1Ijo..."
                    value={mapboxToken || ''}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Save Token</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setTokenInputVisible(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-shield-blue animate-spin mb-4" />
                <p className="text-gray-500">Getting your location...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden bg-gray-100 border">
                {userLocation && (
                  <MapComponent 
                    userLocation={userLocation} 
                    policeStations={filteredStations}
                    onStationClick={handleStationClick}
                  />
                )}
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredStations.map(station => (
                  <PoliceStationCard 
                    key={station.id}
                    station={station}
                    userLocation={userLocation}
                    onClick={() => handleStationClick(station.id)}
                  />
                ))}
                {filteredStations.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-900">No stations found</h3>
                    <p className="text-gray-500 mt-1">
                      No police stations match your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoliceStationsMap;
