
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Users, FileText, MapPin, AlertTriangle, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OfficerNavbar from '@/components/officer/OfficerNavbar';
import SOSAlertsList from '@/components/officer/SOSAlertsList';
import KycVerificationList from '@/components/officer/KycVerificationList';
import OfficerAdvisoryPanel from '@/components/officer/OfficerAdvisoryPanel';
import OfficerCriminalPanel from '@/components/officer/OfficerCriminalPanel';
import OfficerCaseMap from '@/components/officer/OfficerCaseMap';

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Simulate new notifications for demonstration
  const notifications = {
    sos: 3,
    kyc: 5,
    tips: 2,
    reports: 8,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfficerNavbar />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-2xl font-bold mb-6">Officer Portal</h1>
        
        {/* Dashboard Overview Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${activeTab !== 'dashboard' ? 'hidden' : ''}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                SOS Alerts
                {notifications.sos > 0 && (
                  <Badge variant="destructive" className="ml-2">{notifications.sos} New</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{notifications.sos}</div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setActiveTab('sos')}
              >
                View alerts
              </button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                KYC Verifications
                {notifications.kyc > 0 && (
                  <Badge variant="default" className="ml-2">{notifications.kyc} Pending</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{notifications.kyc}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setActiveTab('kyc')}
              >
                Verify identities
              </button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                User Tips
                {notifications.tips > 0 && (
                  <Badge variant="outline" className="ml-2">{notifications.tips} New</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{notifications.tips}</div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setActiveTab('criminals')}
              >
                View tips
              </button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                User Reports
                {notifications.reports > 0 && (
                  <Badge variant="secondary" className="ml-2">{notifications.reports} New</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{notifications.reports}</div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setActiveTab('cases')}
              >
                View reports
              </button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="sos" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              SOS Alerts
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              KYC Verification
            </TabsTrigger>
            <TabsTrigger value="advisories" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Advisories
            </TabsTrigger>
            <TabsTrigger value="criminals" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Criminal Profiles
            </TabsTrigger>
            <TabsTrigger value="cases" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Case Mapping
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent SOS Alerts</CardTitle>
                  <CardDescription>Latest emergency alerts from citizens</CardDescription>
                </CardHeader>
                <CardContent>
                  <SOSAlertsList limit={3} />
                </CardContent>
                <CardFooter>
                  <button 
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setActiveTab('sos')}
                  >
                    View all alerts
                  </button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending KYC Verifications</CardTitle>
                  <CardDescription>User identities waiting for verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <KycVerificationList limit={3} />
                </CardContent>
                <CardFooter>
                  <button 
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setActiveTab('kyc')}
                  >
                    View all verifications
                  </button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* SOS Alerts Tab */}
          <TabsContent value="sos" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Emergency SOS Alerts</CardTitle>
                <CardDescription>Manage and respond to citizen emergency requests</CardDescription>
              </CardHeader>
              <CardContent>
                <SOSAlertsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* KYC Verification Tab */}
          <TabsContent value="kyc" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>User KYC Verification</CardTitle>
                <CardDescription>Verify user identities and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <KycVerificationList />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advisories Tab */}
          <TabsContent value="advisories" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Manage Advisories</CardTitle>
                <CardDescription>Create and manage public safety advisories</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficerAdvisoryPanel />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Criminal Profiles Tab */}
          <TabsContent value="criminals" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Criminal Database Management</CardTitle>
                <CardDescription>Manage wanted individuals and user tips</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficerCriminalPanel />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Case Mapping Tab */}
          <TabsContent value="cases" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Case Mapping</CardTitle>
                <CardDescription>Update case information and location data</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficerCaseMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OfficerDashboard;
