
import React, { useState, useRef, useEffect } from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff,
  Send, 
  MapPin, 
  Phone,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { policeStations } from '@/data/policeStations';
import { calculateDistance } from '@/utils/locationUtils';

interface SOSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
}

const SOSModal = ({ open, onOpenChange, userLocation }: SOSModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [textMessage, setTextMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [nearestStation, setNearestStation] = useState<any | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Find nearest police station based on user location
  useEffect(() => {
    if (userLocation && policeStations.length > 0) {
      let nearest = policeStations[0];
      let minDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        nearest.coordinates.lat,
        nearest.coordinates.lng
      );

      policeStations.forEach(station => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.coordinates.lat,
          station.coordinates.lng
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearest = station;
        }
      });

      setNearestStation(nearest);
    }
  }, [userLocation]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setRecordedAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio messages",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Voice message recorded successfully",
      });
    }
  };

  const handleSendSOS = async () => {
    if (!userLocation) {
      toast({
        title: "Location unavailable",
        description: "We couldn't determine your location. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (!textMessage && !recordedAudio) {
      toast({
        title: "No message to send",
        description: "Please record a voice message or type a text message",
        variant: "destructive"
      });
      return;
    }
    
    setStatus('sending');
    
    // Simulate sending SOS (in a real app, this would call an API)
    setTimeout(() => {
      setStatus('sent');
      
      toast({
        title: "SOS Alert Sent",
        description: `Your alert has been sent to ${nearestStation?.name || 'the nearest police station'}`,
      });
      
      // Auto-close after showing success
      setTimeout(() => {
        onOpenChange(false);
        setStatus('idle');
        setTextMessage('');
        setRecordedAudio(null);
      }, 3000);
    }, 2000);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="bg-red-50">
          <DrawerTitle className="text-xl font-bold text-red-600 flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6" />
            Emergency SOS Alert
          </DrawerTitle>
          <p className="text-gray-600 mt-2">
            Send your location and message to the nearest police station
          </p>
        </DrawerHeader>
        
        <div className="p-6 space-y-6">
          {nearestStation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Nearest Police Station</h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{nearestStation.name}</p>
                  <p className="text-sm text-gray-600">{nearestStation.address}</p>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Phone className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <p className="text-sm">{nearestStation.phone}</p>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">Your Location</h3>
            <div className="bg-gray-100 p-3 rounded-lg flex items-center">
              <MapPin className="h-5 w-5 text-gray-600 mr-2" />
              {userLocation ? (
                <p className="text-sm">
                  Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-red-500">Location unavailable</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Voice Message</h3>
            <div className="flex items-center space-x-2">
              {!recordedAudio ? (
                <>
                  <Button 
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className="flex-1"
                    disabled={status === 'sending' || status === 'sent'}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Record Voice Message
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex-1 bg-green-50 p-2 rounded-lg flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Voice message recorded</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setRecordedAudio(null)}
                    disabled={status === 'sending' || status === 'sent'}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Text Message</h3>
            <Textarea
              placeholder="Describe your emergency situation..."
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="w-full resize-none"
              rows={3}
              disabled={status === 'sending' || status === 'sent'}
            />
          </div>
        </div>
        
        <DrawerFooter className="border-t">
          <Button 
            onClick={handleSendSOS} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={status === 'sending' || status === 'sent'}
          >
            {status === 'idle' && (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send SOS Alert
              </>
            )}
            {status === 'sending' && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Alert...
              </>
            )}
            {status === 'sent' && (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Alert Sent
              </>
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={status === 'sending'}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SOSModal;
