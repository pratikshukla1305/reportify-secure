
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, Mail, MapPin, Calendar, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import OfficerNavbar from '@/components/officer/OfficerNavbar';
import { useNavigate } from 'react-router-dom';

const OfficerProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Example officer data - in a real app, this would come from authentication/database
  const officer = {
    name: "Officer John Smith",
    badge: "P-12345",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    department: "City Police Department",
    rank: "Detective",
    phone: "+1 (555) 123-4567",
    email: "john.smith@citypd.gov",
    address: "123 Central Precinct, Downtown",
    joinDate: "January 15, 2018",
    certifications: ["Criminal Investigation", "Crisis Intervention", "Cyber Crime"]
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing feature in development",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change feature in development",
    });
  };

  const navigateToSettings = () => {
    navigate('/officer-settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfficerNavbar />
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-6">Officer Profile</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Avatar className="h-20 w-20 mr-4 border-2 border-shield-blue">
                    <AvatarImage src={officer.avatar} alt={officer.name} />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{officer.name}</CardTitle>
                    <CardDescription>
                      <Badge className="mt-1">{officer.rank}</Badge>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Shield className="h-4 w-4 mr-1" />
                        Badge: {officer.badge}
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleEditProfile}>Edit Profile</Button>
                  <Button variant="outline" onClick={navigateToSettings}>Settings</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Department Information</h3>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.phone}</p>
                      <p className="text-xs text-gray-500">Office Phone</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.email}</p>
                      <p className="text-xs text-gray-500">Official Email</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.address}</p>
                      <p className="text-xs text-gray-500">Precinct Address</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Professional Information</h3>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.joinDate}</p>
                      <p className="text-xs text-gray-500">Join Date</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Certifications</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {officer.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleChangePassword}>
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficerProfile;
