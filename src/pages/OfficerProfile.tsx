
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, Mail, MapPin, Calendar, Award, X, Save, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OfficerNavbar from '@/components/officer/OfficerNavbar';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const OfficerProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Example officer data - in a real app, this would come from authentication/database
  const [officer, setOfficer] = useState({
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
  });

  // Form values for editing
  const [formValues, setFormValues] = useState({...officer});

  const handleEditProfile = () => {
    if (isEditing) {
      // Save the profile changes
      setOfficer({...formValues});
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setFormValues({...officer});
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  const handleSubmitPasswordChange = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send a request to update the password
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });

    // Reset fields and close dialog
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordDialogOpen(false);
  };

  const navigateToSettings = () => {
    navigate('/officer-settings');
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormValues(prev => ({
          ...prev,
          avatar: event.target.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <OfficerNavbar />
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-6">Officer Profile</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="relative mr-4">
                    <Avatar 
                      className={`h-20 w-20 border-2 border-shield-blue cursor-pointer ${isEditing ? 'hover:opacity-80' : ''}`}
                      onClick={handleAvatarClick}
                    >
                      <AvatarImage src={formValues.avatar} alt={formValues.name} />
                      <AvatarFallback>JS</AvatarFallback>
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    {isEditing ? (
                      <Input 
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="text-xl font-bold mb-1"
                      />
                    ) : (
                      <CardTitle className="text-xl">{officer.name}</CardTitle>
                    )}
                    <CardDescription>
                      <Badge className="mt-1">{officer.rank}</Badge>
                      <div className="flex items-center text-sm text-foreground/70 mt-1">
                        <Shield className="h-4 w-4 mr-1" />
                        Badge: {officer.badge}
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleEditProfile} className="flex items-center">
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleEditProfile}>Edit Profile</Button>
                      <Button variant="outline" onClick={navigateToSettings}>Settings</Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Department Information</h3>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="mb-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department"
                            name="department"
                            value={formValues.department}
                            onChange={handleInputChange}
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-medium">{officer.department}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="mb-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{officer.phone}</p>
                          <p className="text-xs text-foreground/60">Office Phone</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="mb-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{officer.email}</p>
                          <p className="text-xs text-foreground/60">Official Email</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="mb-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address"
                            name="address"
                            value={formValues.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{officer.address}</p>
                          <p className="text-xs text-foreground/60">Precinct Address</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Professional Information</h3>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{officer.joinDate}</p>
                      <p className="text-xs text-foreground/60">Join Date</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-foreground/70 mr-2 mt-0.5" />
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
              <Button 
                variant="outline" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" 
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Please enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitPasswordChange}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficerProfile;
