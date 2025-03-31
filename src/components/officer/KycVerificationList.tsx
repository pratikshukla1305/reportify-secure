
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
import { 
  User,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Flag,
  CheckCircle,
  X,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Mock KYC data
const mockKycData = [
  {
    id: 'kyc-001',
    userId: 'user-123',
    fullName: 'Sarah Johnson',
    dob: '1985-03-12',
    nationality: 'United States',
    idType: 'national_id',
    idNumber: 'US9876543',
    address: '123 Main St, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@example.com',
    documents: {
      idFront: '/placeholder.svg',
      idBack: '/placeholder.svg',
      selfie: '/placeholder.svg'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'pending'
  },
  {
    id: 'kyc-002',
    userId: 'user-456',
    fullName: 'Michael Chen',
    dob: '1992-07-24',
    nationality: 'Canada',
    idType: 'passport',
    idNumber: 'CA87654321',
    address: '456 Oak Ave, Toronto, ON M5V 2T6',
    phone: '+1 (555) 987-6543',
    email: 'michael.chen@example.com',
    documents: {
      idFront: '/placeholder.svg',
      idBack: null,
      selfie: '/placeholder.svg'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: 'pending'
  },
  {
    id: 'kyc-003',
    userId: 'user-789',
    fullName: 'Emma Rodriguez',
    dob: '1988-11-05',
    nationality: 'Mexico',
    idType: 'driving_license',
    idNumber: 'MX12345678',
    address: '789 Pine St, Mexico City, 03100',
    phone: '+52 55 1234 5678',
    email: 'emma.rodriguez@example.com',
    documents: {
      idFront: '/placeholder.svg',
      idBack: '/placeholder.svg',
      selfie: '/placeholder.svg'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: 'pending'
  },
  {
    id: 'kyc-004',
    userId: 'user-101',
    fullName: 'David Wilson',
    dob: '1976-05-15',
    nationality: 'United Kingdom',
    idType: 'passport',
    idNumber: 'GB654321',
    address: '10 Baker St, London, SW1A 1AA',
    phone: '+44 20 1234 5678',
    email: 'david.wilson@example.com',
    documents: {
      idFront: '/placeholder.svg',
      idBack: null,
      selfie: '/placeholder.svg'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'approved'
  },
  {
    id: 'kyc-005',
    userId: 'user-202',
    fullName: 'Olivia Martinez',
    dob: '1995-09-30',
    nationality: 'Spain',
    idType: 'national_id',
    idNumber: 'ES98765432',
    address: '15 Gran Via, Madrid, 28013',
    phone: '+34 91 123 45 67',
    email: 'olivia.martinez@example.com',
    documents: {
      idFront: '/placeholder.svg',
      idBack: '/placeholder.svg',
      selfie: '/placeholder.svg'
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    status: 'rejected'
  }
];

interface KycVerificationListProps {
  limit?: number;
}

const KycVerificationList = ({ limit }: KycVerificationListProps) => {
  const [selectedKyc, setSelectedKyc] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);
  const [imageToView, setImageToView] = useState<string | null>(null);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getFilteredKyc = () => {
    let filtered = [...mockKycData];
    
    if (currentTab === 'pending') {
      filtered = filtered.filter(kyc => kyc.status === 'pending');
    } else if (currentTab === 'approved') {
      filtered = filtered.filter(kyc => kyc.status === 'approved');
    } else if (currentTab === 'rejected') {
      filtered = filtered.filter(kyc => kyc.status === 'rejected');
    }
    
    // Sort by most recent first
    filtered.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
    
    // Apply limit if provided
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };
  
  const handleViewDetails = (kyc: any) => {
    setSelectedKyc(kyc);
    setVerificationStatus(kyc.status);
    setDetailsOpen(true);
  };
  
  const handleViewImage = (imageUrl: string) => {
    setImageToView(imageUrl);
    setImageViewOpen(true);
  };
  
  const handleVerification = () => {
    // In a real app, this would make an API call to update the status
    toast({
      title: `Verification ${verificationStatus === 'approved' ? 'approved' : 'rejected'}`,
      description: `User ${selectedKyc?.fullName}'s KYC has been ${verificationStatus === 'approved' ? 'approved' : 'rejected'}.`,
    });
    
    setDetailsOpen(false);
  };
  
  const getIdTypeDisplay = (idType: string) => {
    switch (idType) {
      case 'passport': return 'Passport';
      case 'national_id': return 'National ID';
      case 'driving_license': return 'Driving License';
      default: return idType;
    }
  };

  return (
    <div>
      {!limit && (
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Verifications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="space-y-4">
        {getFilteredKyc().map(kyc => (
          <Card key={kyc.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-medium">
                  {kyc.fullName}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Application ID: {kyc.id}
                </p>
              </div>
              <Badge
                variant={
                  kyc.status === 'pending' ? 'outline' : 
                  kyc.status === 'approved' ? 'default' : 'destructive'
                }
              >
                {kyc.status === 'pending' ? 'Pending Review' : 
                 kyc.status === 'approved' ? 'Approved' : 'Rejected'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">
                    {getIdTypeDisplay(kyc.idType)}: {kyc.idNumber}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">{kyc.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm">Submitted: {formatDate(kyc.submittedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-blue-600"
                onClick={() => handleViewDetails(kyc)}
              >
                Review Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {getFilteredKyc().length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No verifications found</h3>
            <p className="text-gray-500 mt-1">There are no KYC verifications matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* KYC Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedKyc && (
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>KYC Verification Review</DialogTitle>
              <DialogDescription>
                Review the user's identity verification documents
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Full Name</div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedKyc.fullName}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Date of Birth</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedKyc.dob}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Nationality</div>
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedKyc.nationality}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">ID Document</div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{getIdTypeDisplay(selectedKyc.idType)}: {selectedKyc.idNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <span>{selectedKyc.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedKyc.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{selectedKyc.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Submission Date</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{formatDate(selectedKyc.submittedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Verification Documents</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="relative aspect-[3/2] bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={selectedKyc.documents.idFront} 
                        alt="ID Front" 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute bottom-1 right-1 h-7 opacity-80 hover:opacity-100"
                        onClick={() => handleViewImage(selectedKyc.documents.idFront)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="text-xs text-center">ID Front</div>
                  </div>
                  
                  {selectedKyc.documents.idBack && (
                    <div className="space-y-1">
                      <div className="relative aspect-[3/2] bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={selectedKyc.documents.idBack} 
                          alt="ID Back" 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute bottom-1 right-1 h-7 opacity-80 hover:opacity-100"
                          onClick={() => handleViewImage(selectedKyc.documents.idBack)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="text-xs text-center">ID Back</div>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="relative aspect-[3/2] bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={selectedKyc.documents.selfie} 
                        alt="Selfie" 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute bottom-1 right-1 h-7 opacity-80 hover:opacity-100"
                        onClick={() => handleViewImage(selectedKyc.documents.selfie)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="text-xs text-center">Selfie</div>
                  </div>
                </div>
              </div>
              
              {selectedKyc.status === 'pending' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Verification Decision</div>
                  <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approve Verification</SelectItem>
                      <SelectItem value="rejected">Reject Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {selectedKyc.status === 'pending' && (
                <>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setDetailsOpen(false)}
                  >
                    Review Later
                  </Button>
                  
                  <Button 
                    onClick={handleVerification}
                    className={`w-full sm:w-auto ${
                      verificationStatus === 'approved' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : verificationStatus === 'rejected'
                        ? 'bg-red-600 hover:bg-red-700'
                        : ''
                    }`}
                    disabled={verificationStatus === 'pending'}
                  >
                    {verificationStatus === 'approved' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Verification
                      </>
                    ) : verificationStatus === 'rejected' ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Reject Verification
                      </>
                    ) : (
                      'Select a Decision'
                    )}
                  </Button>
                </>
              )}
              {selectedKyc.status !== 'pending' && (
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close Details
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Full Image View Dialog */}
      <Dialog open={imageViewOpen} onOpenChange={setImageViewOpen}>
        {imageToView && (
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Document View</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={imageToView} 
                alt="Document" 
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default KycVerificationList;
