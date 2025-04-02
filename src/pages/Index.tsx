
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import UploadCard from '@/components/upload/UploadCard';
import ReportCard from '@/components/ReportCard';
import CompareCard from '@/components/CompareCard';
import AuthButton from '@/components/AuthButton';
import { Shield, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section className="section-padding bg-shield-light" id="how-it-works">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-white shadow-sm mb-4">
              <span className="text-xs font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How <span className="text-shield-blue">Midshield</span> Works</h2>
            <p className="text-gray-600 text-lg">
              Our platform streamlines the entire process from evidence collection to analysis, with blockchain security at every step.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-shield-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
              <UploadCard className="h-full" />
            </div>
            
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-shield-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
              <CompareCard className="h-full" />
            </div>
            
            <div className="relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-shield-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
              <ReportCard className="h-full" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Rewards Section */}
      <section className="section-padding bg-white" id="rewards">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-up">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-white shadow-sm mb-4">
                <Shield className="h-4 w-4 text-shield-blue mr-2" />
                <span className="text-xs font-medium">Crypto Rewards</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Get <span className="text-shield-blue">Rewarded</span> for<br />Promoting Public Safety</h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Midshield incentivizes active participation in public safety by rewarding users with cryptocurrency for reporting crimes and submitting evidence.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Earn tokens for verified submissions', 'Rewards increase with quality of evidence', 'Special bonuses for critical information', 'Direct deposits to your crypto wallet'].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-shield-blue text-white hover:bg-blue-600 transition-all"
                  to="/connect-wallet"
                >
                  Connect Wallet
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
                  to="/learn-about-rewards"
                >
                  Learn About Rewards
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative animate-fade-in">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 bg-shield-blue rounded-3xl blur-3xl opacity-5 transform rotate-6"></div>
                <div className="glass-card p-8 relative">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-shield-blue mr-2" />
                      <span className="text-xl font-semibold">Reward Center</span>
                    </div>
                    <AuthButton />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-shield-light">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Available Balance</span>
                        <div className="flex items-center text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">+25% this month</span>
                        </div>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold mr-2">250</span>
                        <span className="text-xl text-shield-blue font-medium">SHIELD</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">≈ $125.00 USD</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 10L12 15L17 10" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 15V3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Evidence #1024</div>
                            <div className="text-xs text-gray-500">Yesterday at 2:30 PM</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+75 SHIELD</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M23 7L16 12L23 17V7Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Video Report #891</div>
                            <div className="text-xs text-gray-500">Aug 15, 2023</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+125 SHIELD</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 10H3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 6H3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 14H3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 18H3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Written Report #745</div>
                            <div className="text-xs text-gray-500">Jul 28, 2023</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+50 SHIELD</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className="w-full border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all"
                        to="/view-all-rewards"
                      >
                        View All Rewards
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10">
                  <div className="glass-card p-3 shadow-lg transform rotate-12">
                    <div className="text-xs font-medium">Rewards verified by</div>
                    <div className="text-sm font-semibold text-shield-blue">Smart Contract</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-shield-blue relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400 opacity-20"></div>
          <div className="absolute top-1/3 -left-32 w-72 h-72 rounded-full bg-blue-300 opacity-10"></div>
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-blue-200 opacity-20"></div>
        </div>
        
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to make a difference?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join Midshield today and become part of a community that's revolutionizing crime reporting while earning rewards for your contributions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-shield-blue hover:bg-blue-50 transition-all"
                to="/get-started"
              >
                Get Started Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 transition-all"
                to="/request-demo"
              >
                Request a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
