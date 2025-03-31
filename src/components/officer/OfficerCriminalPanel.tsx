
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  User, 
  MapPin, 
  Edit, 
  Trash2, 
  Bell, 
  Eye,
  Save,
  XCircle,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { wantedIndividuals } from '@/data/wantedIndividuals';

// Mock tips data
const mockTips = [
  {
    id: 'tip-001',
    criminalId: 'criminal-001',
    criminalName: 'John Doe',
    submittedBy: 'Anonymous',
    contactInfo: 'anonymous@example.com',
    location: 'Downtown Central Square',
    description: 'I believe I saw this person at the Central Square coffee shop around 3 PM today. He was wearing a red jacket and black cap.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: 'new'
  },
  {
    id: 'tip-002',
    criminalId: 'criminal-003',
    criminalName: 'Michael Smith',
    submittedBy: 'Jane Wilson',
    contactInfo: '+1 (555) 987-6543',
    location: 'West Side Mall, near the food court',
    description: 'This individual has been frequently visiting the mall food court in the evenings. Approximately 7-8 PM. Usually sits alone at the corner table.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: 'investigating'
  },
  {
    id: 'tip-003',
    criminalId: 'criminal-002',
    criminalName: 'Robert Johnson',
    submittedBy: 'Store Manager',
    contactInfo: 'manager@example.com',
    location: 'Riverside Gas Station',
    description: 'The security camera footage from last night shows someone matching this description using a suspicious credit card at our gas station around 11:30 PM.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'resolved'
  }
];

const OfficerCriminalPanel = () => {
  const [criminalData, setCriminalData] = useState(wantedIndividuals);
  const [tipData, setTipData] = useState(mockTips);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCriminal, setSelectedCriminal] = useState<any | null>(null);
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const [criminalDetailsOpen, setCriminalDetailsOpen] = useState(false);
  const [tipDetailsOpen, setTipDetailsOpen] = useState(false);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('criminals');
  const [tipStatus, setTipStatus] = useState('new');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for adding/editing criminals
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    lastKnownLocation: '',
    charges: '',
    caseNumber: '',
    dangerLevel: 'Medium',
    photoUrl: '/placeholder.svg',
    description: ''
  });
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getFilteredCriminals = () => {
    if (!searchQuery) return criminalData;
    
    const query = searchQuery.toLowerCase();
    return criminalData.filter(
      criminal => 
        criminal.name.toLowerCase().includes(query) || 
        criminal.charges.toLowerCase().includes(query) ||
        criminal.lastKnownLocation.toLowerCase().includes(query) ||
        criminal.caseNumber.toLowerCase().includes(query)
    );
  };
  
  const getFilteredTips = () => {
    if (!searchQuery) return tipData;
    
    const query = searchQuery.toLowerCase();
    return tipData.filter(
      tip => 
        tip.criminalName.toLowerCase().includes(query) || 
        tip.location.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query)
    );
  };
  
  const handleViewCriminalDetails = (criminal: any) => {
    setSelectedCriminal(criminal);
    setCriminalDetailsOpen(true);
  };
  
  const handleViewTipDetails = (tip: any) => {
    setSelectedTip(tip);
    setTipStatus(tip.status);
    setTipDetailsOpen(true);
  };
  
  const handleAddCriminal = () => {
    // Reset form
    setFormData({
      id: '',
      name: '',
      age: '',
      height: '',
      weight: '',
      lastKnownLocation: '',
      charges: '',
      caseNumber: '',
      dangerLevel: 'Medium',
      photoUrl: '/placeholder.svg',
      description: ''
    });
    setIsEditing(false);
    setAddEditOpen(true);
  };
  
  const handleEditCriminal = (criminal: any) => {
    setFormData({
      ...criminal
    });
    setIsEditing(true);
    setAddEditOpen(true);
  };
  
  const handleDeleteClick = (criminal: any) => {
    setSelectedCriminal(criminal);
    setDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedCriminal) {
      // Filter out the criminal to delete
      const updatedCriminals = criminalData.filter(c => c.id !== selectedCriminal.id);
      setCriminalData(updatedCriminals);
      
      toast({
        title: "Profile deleted",
        description: `Criminal profile for "${selectedCriminal.name}" has been deleted.`,
      });
      
      setDeleteConfirmOpen(false);
    }
  };
  
  const handleSaveCriminal = () => {
    // Validate form
    if (!formData.name || !formData.charges || !formData.lastKnownLocation || !formData.caseNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditing) {
      // Update existing criminal
      const updatedCriminals = criminalData.map(c => 
        c.id === formData.id ? { ...formData } : c
      );
      setCriminalData(updatedCriminals);
      
      toast({
        title: "Profile updated",
        description: `Criminal profile for "${formData.name}" has been updated.`,
      });
    } else {
      // Add new criminal
      const newCriminal = {
        ...formData,
        id: `criminal-${Date.now()}`
      };
      
      setCriminalData([...criminalData, newCriminal]);
      
      toast({
        title: "Profile created",
        description: `New criminal profile for "${formData.name}" has been created.`,
      });
    }
    
    setAddEditOpen(false);
  };
  
  const handleUpdateTipStatus = () => {
    if (selectedTip) {
      // Update tip status
      const updatedTips = tipData.map(t => 
        t.id === selectedTip.id ? { ...t, status: tipStatus } : t
      );
      setTipData(updatedTips);
      
      toast({
        title: "Tip status updated",
        description: `Tip status has been updated to ${tipStatus}.`,
      });
      
      setTipDetailsOpen(false);
    }
  };
  
  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'High':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'Medium':
        return <Badge variant="default">Medium Risk</Badge>;
      case 'Low':
        return <Badge variant="outline">Low Risk</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };
  
  const getTipStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'investigating':
        return <Badge variant="default">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={currentTab === 'criminals' ? "Search criminal database..." : "Search tips..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {currentTab === 'criminals' && (
          <Button 
            onClick={handleAddCriminal}
            className="bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Criminal Profile
          </Button>
        )}
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="criminals">Criminal Database</TabsTrigger>
          <TabsTrigger value="tips">Citizen Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criminals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getFilteredCriminals().map(criminal => (
              <Card key={criminal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{criminal.name}</CardTitle>
                    {getDangerBadge(criminal.dangerLevel)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Last seen: {criminal.lastKnownLocation}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="aspect-w-3 aspect-h-4 mb-3">
                    <img
                      src={criminal.photoUrl}
                      alt={`Wanted: ${criminal.name}`}
                      className="object-cover w-full h-[150px] rounded-md"
                    />
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{criminal.charges}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-semibold mr-1">Case #:</span> {criminal.caseNumber}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewCriminalDetails(criminal)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditCriminal(criminal)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(criminal)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {getFilteredCriminals().length === 0 && (
              <div className="col-span-3 text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-600">No criminal profiles found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery 
                    ? "No criminal profiles match your search criteria."
                    : "There are no criminal profiles in the database."
                  }
                </p>
                <Button 
                  onClick={handleAddCriminal}
                  className="mt-4 bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Criminal Profile
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-6">
          <div className="space-y-4">
            {getFilteredTips().map(tip => (
              <Card key={tip.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base font-medium flex items-center">
                      <Bell className="h-4 w-4 text-blue-500 mr-2" />
                      Tip for: {tip.criminalName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {tip.location}
                    </p>
                  </div>
                  {getTipStatusBadge(tip.status)}
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{tip.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>From: {tip.submittedBy}</span>
                    <span>Received: {formatDate(tip.date)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-blue-600"
                    onClick={() => handleViewTipDetails(tip)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Tip Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {getFilteredTips().length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-600">No tips found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery 
                    ? "No tips match your search criteria."
                    : "There are no submitted tips to review."
                  }
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Criminal Details Dialog */}
      <Dialog open={criminalDetailsOpen} onOpenChange={setCriminalDetailsOpen}>
        {selectedCriminal && (
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                {selectedCriminal.name}
                <span className="ml-auto">{getDangerBadge(selectedCriminal.dangerLevel)}</span>
              </DialogTitle>
              <DialogDescription>
                Case #: {selectedCriminal.caseNumber}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedCriminal.photoUrl}
                  alt={`Wanted: ${selectedCriminal.name}`}
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-2">{selectedCriminal.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Height:</span>
                      <span className="ml-2">{selectedCriminal.height}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-2">{selectedCriminal.weight}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk Level:</span>
                      <span className="ml-2">{selectedCriminal.dangerLevel}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Last Known Location</h3>
                  <p className="text-sm">{selectedCriminal.lastKnownLocation}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Charges</h3>
                  <p className="text-sm">{selectedCriminal.charges}</p>
                </div>
                
                {selectedCriminal.description && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Additional Information</h3>
                    <p className="text-sm">{selectedCriminal.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setCriminalDetailsOpen(false)}
              >
                Close
              </Button>
              <Button 
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setCriminalDetailsOpen(false);
                  handleDeleteClick(selectedCriminal);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </Button>
              <Button 
                className="w-full sm:w-auto"
                onClick={() => {
                  setCriminalDetailsOpen(false);
                  handleEditCriminal(selectedCriminal);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Tip Details Dialog */}
      <Dialog open={tipDetailsOpen} onOpenChange={setTipDetailsOpen}>
        {selectedTip && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Bell className="h-4 w-4 text-blue-500 mr-2" />
                Tip Details
                <span className="ml-auto">{getTipStatusBadge(selectedTip.status)}</span>
              </DialogTitle>
              <DialogDescription>
                For Case: {selectedTip.criminalName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium">Submitted By</div>
                  <div className="text-sm">{selectedTip.submittedBy}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Received</div>
                  <div className="text-sm">{formatDate(selectedTip.date)}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Contact Information</div>
                <div className="text-sm">{selectedTip.contactInfo}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm">{selectedTip.location}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Tip Information</div>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {selectedTip.description}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Update Status</div>
                <Select value={tipStatus} onValueChange={setTipStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setTipDetailsOpen(false)}
              >
                Close
              </Button>
              
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              
              <Button 
                className="w-full sm:w-auto"
                onClick={handleUpdateTipStatus}
                disabled={tipStatus === selectedTip.status}
              >
                <Save className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Add/Edit Criminal Dialog */}
      <Dialog open={addEditOpen} onOpenChange={setAddEditOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Criminal Profile' : 'Add New Criminal Profile'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the information for this criminal profile' 
                : 'Fill in the details to create a new criminal profile'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height</label>
                  <Input 
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="Height"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight</label>
                  <Input 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="Weight"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Known Location</label>
                <Input 
                  value={formData.lastKnownLocation}
                  onChange={(e) => setFormData({...formData, lastKnownLocation: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Case Number</label>
                <Input 
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                  placeholder="Enter case number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select 
                  value={formData.dangerLevel}
                  onValueChange={(value) => setFormData({...formData, dangerLevel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo URL</label>
                <Input 
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                  placeholder="Enter photo URL"
                />
                <div className="bg-gray-100 rounded-md p-2 aspect-square flex items-center justify-center">
                  {formData.photoUrl ? (
                    <img 
                      src={formData.photoUrl} 
                      alt="Criminal" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Charges</label>
                <Textarea 
                  value={formData.charges}
                  onChange={(e) => setFormData({...formData, charges: e.target.value})}
                  placeholder="Enter charges"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Information</label>
                <Textarea 
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter any additional information"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setAddEditOpen(false)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={handleSaveCriminal}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Profile' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        {selectedCriminal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this criminal profile? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-3 bg-red-50 rounded-md border border-red-100 my-2">
              <p className="font-medium text-red-800">{selectedCriminal.name}</p>
              <p className="text-sm text-red-600 mt-1">Case #: {selectedCriminal.caseNumber}</p>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OfficerCriminalPanel;
