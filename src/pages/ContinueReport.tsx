
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Save, X, Eye } from 'lucide-react';

const ContinueReport = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-white shadow-sm mb-4">
              <FileText className="h-4 w-4 text-shield-blue mr-2" />
              <span className="text-xs font-medium">In Progress</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Continue Your Report</h1>
            <p className="text-gray-600 text-lg">
              You have a report in progress. Continue where you left off or take other actions.
            </p>
          </div>
          
          <div className="glass-card p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Report #1042</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Draft</span>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created On</p>
                  <p className="font-medium">July 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium">July 16, 2023</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="font-medium">Incident report for downtown area - 3 images uploaded</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Completion</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-shield-blue h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-right text-gray-500">65% complete</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-shield-blue text-white hover:bg-blue-600 transition-all flex-1">
                <Save className="mr-2 h-4 w-4" /> Continue Editing
              </Button>
              
              <Link to="/view-draft-report" className="flex-1">
                <Button variant="outline" className="w-full border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all">
                  <Eye className="mr-2 h-4 w-4" /> View Draft
                </Button>
              </Link>
              
              <Link to="/cancel-report" className="flex-1">
                <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <X className="mr-2 h-4 w-4" /> Cancel Report
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Ready to finalize your report?</p>
            <Link to="/generate-detailed-report">
              <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 transition-all">
                Generate Detailed Report
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ContinueReport;
