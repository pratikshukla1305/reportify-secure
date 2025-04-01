
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAllKycVerifications, 
  updateKycVerificationStatus, 
  KycVerification
} from '@/data/kycVerificationsData';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KycVerificationListProps {
  limit?: number;
}

const KycVerificationList = ({ limit }: KycVerificationListProps) => {
  const [verifications, setVerifications] = useState<KycVerification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<KycVerification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();

  useEffect(() => {
    // Load verifications from shared data store
    loadVerifications();
  }, [limit]);

  const loadVerifications = () => {
    const allVerifications = getAllKycVerifications();
    setVerifications(limit ? allVerifications.slice(0, limit) : allVerifications);
  };

  const handleView = (verification: KycVerification) => {
    setSelectedVerification(verification);
    setIsDialogOpen(true);
    setActiveTab('details');
  };

  const handleApprove = (id: string) => {
    // Officer badge would come from auth context in a real app
    const officerBadge = "P-12345";
    const updated = updateKycVerificationStatus(id, "approved", officerBadge);
    
    if (updated) {
      // Refresh the list
      loadVerifications();
      
      // Close dialog if open
      if (isDialogOpen) {
        setIsDialogOpen(false);
      }
      
      toast({
        title: "Verification Approved",
        description: "The user's identity has been verified successfully.",
      });
    }
  };

  const handleReject = (id: string) => {
    // Officer badge would come from auth context in a real app
    const officerBadge = "P-12345";
    const updated = updateKycVerificationStatus(id, "rejected", officerBadge);
    
    if (updated) {
      // Refresh the list
      loadVerifications();
      
      // Close dialog if open
      if (isDialogOpen) {
        setIsDialogOpen(false);
      }
      
      toast({
        title: "Verification Rejected",
        description: "The user's identity verification has been rejected.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {verifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No verification requests found</p>
        </div>
      ) : (
        verifications.map((verification) => (
          <div 
            key={verification.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <Avatar>
                <AvatarImage src={verification.photo} alt={verification.name} />
                <AvatarFallback>{verification.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{verification.name}</h4>
                <p className="text-sm text-gray-500">{verification.email}</p>
                <div className="mt-1">
                  {getStatusBadge(verification.status)}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 self-end sm:self-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => handleView(verification)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {verification.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    onClick={() => handleApprove(verification.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleReject(verification.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {/* Detail Dialog */}
      {selectedVerification && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>KYC Verification Details</DialogTitle>
              <DialogDescription>
                Review user identification documents and information
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="documents">ID Documents</TabsTrigger>
                <TabsTrigger value="selfie">Selfie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 mb-4 col-span-2">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={selectedVerification.photo} alt={selectedVerification.name} />
                      <AvatarFallback>{selectedVerification.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">{selectedVerification.name}</p>
                      <p className="text-sm text-gray-500">{selectedVerification.email}</p>
                      <div className="mt-1">{getStatusBadge(selectedVerification.status)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                    
                    <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                      <div>
                        <Label className="text-xs text-gray-500">Full Name</Label>
                        <p className="font-medium">{selectedVerification.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Email</Label>
                        <p className="font-medium">{selectedVerification.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Submission Date</Label>
                        <p className="font-medium">
                          {new Date(selectedVerification.submissionDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedVerification.status)}</div>
                      </div>
                      
                      {selectedVerification.reviewDate && (
                        <>
                          <div>
                            <Label className="text-xs text-gray-500">Review Date</Label>
                            <p className="font-medium">
                              {new Date(selectedVerification.reviewDate).toLocaleString()}
                            </p>
                          </div>
                          {selectedVerification.reviewedBy && (
                            <div>
                              <Label className="text-xs text-gray-500">Reviewed By</Label>
                              <p className="font-medium">{selectedVerification.reviewedBy}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="py-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">ID Document</h3>
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={selectedVerification.document} 
                        alt="ID Document" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  {/* We'd add back document here too if it was available in the data */}
                </div>
              </TabsContent>
              
              <TabsContent value="selfie" className="py-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">User Selfie</h3>
                  <div className="border rounded-md overflow-hidden flex justify-center">
                    <img 
                      src={selectedVerification.photo} 
                      alt="User Selfie" 
                      className="max-h-80"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="gap-2 mt-4">
              {selectedVerification.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleReject(selectedVerification.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject Verification
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedVerification.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve Verification
                  </Button>
                </>
              )}
              {selectedVerification.status !== 'pending' && (
                <Button
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default KycVerificationList;
