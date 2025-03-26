
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Check, RotateCcw, Download, Share2, ArrowLeft } from 'lucide-react';

const GenerateDetailedReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link to="/continue-report" className="mr-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Generate Detailed Report</h1>
          </div>
          
          <div className="glass-card p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-shield-light mb-4">
                <FileText className="h-8 w-8 text-shield-blue" />
              </div>
              <h2 className="text-xl font-semibold mb-2">AI-Powered Report Generation</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our advanced AI will analyze all submitted evidence and information to create a 
                comprehensive, detailed report ready for official use. This process ensures accuracy 
                and thoroughness while saving you valuable time.
              </p>
            </div>
            
            <div className="bg-shield-light rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">Report Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Report ID</p>
                  <p className="font-medium">#1042</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Incident Type</p>
                  <p className="font-medium">Public Disturbance</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Evidence Items</p>
                  <p className="font-medium">3 Images, 1 Description</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blockchain Status</p>
                  <p className="font-medium flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" /> Verified
                  </p>
                </div>
              </div>
            </div>
            
            {!isComplete ? (
              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-shield-blue text-white hover:bg-blue-600 transition-all"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-green-700">Report Generated Successfully!</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-shield-blue text-white hover:bg-blue-600 transition-all">
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </Button>
                  <Button variant="outline" className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all">
                    <Share2 className="mr-2 h-4 w-4" /> Share Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default GenerateDetailedReport;
