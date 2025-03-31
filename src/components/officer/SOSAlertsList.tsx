
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Loader2, 
  MessageSquare,
  User,
  ArrowUpRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

// Mock data for SOS alerts
const mockSOSAlerts = [
  {
    id: 'sos-001',
    userId: 'user-123',
    userName: 'Sarah Johnson',
    userPhone: '+1 (555) 123-4567',
    location: {
      address: 'Central Park, New York',
      lat: 40.785091,
      lng: -73.968285
    },
    message: 'Someone is following me. I feel unsafe. I'm wearing a red jacket near the south entrance.',
    voiceRecording: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'new'
  },
  {
    id: 'sos-002',
    userId: 'user-456',
    userName: 'Michael Chen',
    userPhone: '+1 (555) 987-6543',
    location: {
      address: 'Downtown Mall, Main Street',
      lat: 40.712775,
      lng: -74.005973
    },
    message: 'Witnessed a car break-in. Black sedan, license plate starting with XYZ.',
    voiceRecording: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'in-progress'
  },
  {
    id: 'sos-003',
    userId: 'user-789',
    userName: 'Emma Rodriguez',
    userPhone: '+1 (555) 234-5678',
    location: {
      address: 'Riverside Park, West Side',
      lat: 40.801505,
      lng: -73.972748
    },
    message: 'Medical emergency. Elderly person collapsed on the jogging path near the river viewpoint.',
    voiceRecording: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'new'
  },
  {
    id: 'sos-004',
    userId: 'user-101',
    userName: 'David Wilson',
    userPhone: '+1 (555) 345-6789',
    location: {
      address: '123 Broadway Avenue',
      lat: 40.758896,
      lng: -73.985130
    },
    message: 'Suspicious package left unattended at the bus stop.',
    voiceRecording: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: 'resolved'
  },
  {
    id: 'sos-005',
    userId: 'user-202',
    userName: 'Olivia Martinez',
    userPhone: '+1 (555) 456-7890',
    location: {
      address: 'Grand Central Station',
      lat: 40.752774,
      lng: -73.977280
    },
    message: 'Lost child, approximately 5 years old, wearing blue t-shirt and jeans, last seen near the main entrance.',
    voiceRecording: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    status: 'resolved'
  }
];

interface SOSAlertsListProps {
  limit?: number;
}

const SOSAlertsList = ({ limit }: SOSAlertsListProps) => {
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  const getFilteredAlerts = () => {
    let filtered = [...mockSOSAlerts];
    
    if (currentTab === 'new') {
      filtered = filtered.filter(alert => alert.status === 'new');
    } else if (currentTab === 'in-progress') {
      filtered = filtered.filter(alert => alert.status === 'in-progress');
    } else if (currentTab === 'resolved') {
      filtered = filtered.filter(alert => alert.status === 'resolved');
    }
    
    // Sort by most recent first
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit if provided
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };
  
  const handleViewDetails = (alert: any) => {
    setSelectedAlert(alert);
    setDetailsOpen(true);
  };
  
  const handleUpdateStatus = (alertId: string, newStatus: string) => {
    // In a real app, this would make an API call to update the status
    toast({
      title: "Status updated",
      description: `Alert ${alertId} marked as ${newStatus}`,
    });
    
    setDetailsOpen(false);
  };

  return (
    <div>
      {!limit && (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="space-y-4">
        {getFilteredAlerts().map(alert => (
          <Card key={alert.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  Emergency SOS Alert
                </CardTitle>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatTime(alert.timestamp)}
                </p>
              </div>
              <Badge
                variant={
                  alert.status === 'new' ? 'destructive' : 
                  alert.status === 'in-progress' ? 'default' : 'outline'
                }
              >
                {alert.status === 'new' ? 'New Alert' : 
                 alert.status === 'in-progress' ? 'In Progress' : 'Resolved'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start">
                  <User className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{alert.userName}</span>
                    <span className="text-sm text-gray-500 ml-2">{alert.userPhone}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <span className="text-sm">{alert.location.address}</span>
                </div>
                <p className="text-sm mt-2 line-clamp-2">{alert.message}</p>
                {alert.voiceRecording && (
                  <div className="mt-1 px-2 py-1 bg-gray-100 rounded-md inline-flex items-center text-xs">
                    <span>Voice recording available</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600"
                onClick={() => handleViewDetails(alert)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {getFilteredAlerts().length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No alerts found</h3>
            <p className="text-gray-500 mt-1">There are no SOS alerts matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Alert Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedAlert && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                SOS Alert Details
              </DialogTitle>
              <DialogDescription>
                Alert ID: {selectedAlert.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Reported by</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{selectedAlert.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{selectedAlert.userPhone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Reported</div>
                  <div className="text-gray-500">
                    {formatTime(selectedAlert.timestamp)}
                  </div>
                  <Badge 
                    variant={
                      selectedAlert.status === 'new' ? 'destructive' : 
                      selectedAlert.status === 'in-progress' ? 'default' : 'outline'
                    }
                    className="mt-1"
                  >
                    {selectedAlert.status === 'new' ? 'New Alert' : 
                     selectedAlert.status === 'in-progress' ? 'In Progress' : 'Resolved'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Location</div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <div>{selectedAlert.location.address}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Coordinates: {selectedAlert.location.lat.toFixed(6)}, {selectedAlert.location.lng.toFixed(6)}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  View on Map
                </Button>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Message</div>
                <div className="p-3 bg-gray-50 rounded-md text-gray-800">
                  {selectedAlert.message}
                </div>
              </div>
              
              {selectedAlert.voiceRecording && (
                <div>
                  <div className="text-sm font-medium mb-1">Voice Recording</div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <audio controls className="w-full">
                      <source src="/mocked-audio-file.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {selectedAlert.status === 'new' && (
                <Button 
                  onClick={() => handleUpdateStatus(selectedAlert.id, 'in-progress')}
                  className="w-full sm:w-auto"
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </Button>
              )}
              
              {(selectedAlert.status === 'new' || selectedAlert.status === 'in-progress') && (
                <Button 
                  onClick={() => handleUpdateStatus(selectedAlert.id, 'resolved')}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Dispatch Team
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact User
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SOSAlertsList;
