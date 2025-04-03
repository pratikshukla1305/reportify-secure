
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, File, Plus, ArrowRight, FileText, CalendarDays, Map, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const MyReports = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;

      try {
        setIsLoadingReports(true);
        const { data, error } = await supabase
          .from('crime_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('report_date', { ascending: false });

        if (error) throw error;
        setReports(data || []);
        setFilteredReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === value));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">Draft</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Submitted</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">Processing</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Shield className="h-12 w-12 text-shield-blue animate-pulse" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Reports</h1>
              <p className="text-gray-600">
                View and manage all your submitted crime reports
              </p>
            </div>
            
            <Button asChild className="bg-shield-blue hover:bg-blue-600">
              <Link to="/continue-report">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="mb-8" onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-5 w-full max-w-md mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoadingReports ? (
                <div className="py-16 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-500">Loading reports...</p>
                </div>
              ) : filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">{report.title}</h3>
                              {getStatusBadge(report.status)}
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {report.description || 'No description provided.'}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                {new Date(report.report_date).toLocaleDateString()}
                              </div>
                              
                              {report.location && (
                                <div className="flex items-center">
                                  <Map className="h-4 w-4 mr-1" />
                                  {report.location}
                                </div>
                              )}
                              
                              {report.is_anonymous && (
                                <div className="flex items-center">
                                  <Info className="h-4 w-4 mr-1" />
                                  Anonymous
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-6 flex flex-col justify-center items-center sm:w-48">
                            <Link to={`/view-draft-report?id=${report.id}`}>
                              <Button variant="outline" className="whitespace-nowrap">
                                View Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-16 text-center">
                  <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports found</h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'all' 
                      ? "You haven't created any reports yet." 
                      : `You don't have any ${activeTab} reports.`}
                  </p>
                  <Button asChild>
                    <Link to="/continue-report">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Report
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyReports;
