
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, ArrowUp } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      const elements = heroRef.current.querySelectorAll('.parallax');
      
      elements.forEach((el) => {
        const speed = Number((el as HTMLElement).dataset.speed) || 1;
        const moveX = x * speed * 20;
        const moveY = y * speed * 20;
        (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-shield-light pt-16"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="parallax absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-100 opacity-50" data-speed="0.5"></div>
        <div className="parallax absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-blue-50 opacity-70" data-speed="0.3"></div>
        <div className="parallax absolute -bottom-10 right-1/4 w-80 h-80 rounded-full bg-shield-light opacity-80" data-speed="0.4"></div>
      </div>
      
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-white shadow-sm mb-6 animate-fade-in">
              <Shield className="h-4 w-4 text-shield-blue mr-2" />
              <span className="text-xs font-medium">Blockchain + AI Security</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-shield-dark mb-6 animate-fade-up" style={{animationDelay: '0.1s'}}>
              <span className="text-shield-blue">Report</span> crimes.<br />
              <span className="text-shield-blue">Secure</span> evidence.<br />
              <span className="text-shield-blue">Earn</span> rewards.
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{animationDelay: '0.2s'}}>
              Midshield combines blockchain and AI to revolutionize crime reporting and evidence management, ensuring data integrity while incentivizing public participation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{animationDelay: '0.3s'}}>
              <Button size="lg" className="bg-shield-blue text-white hover:bg-blue-600 transition-all">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-shield-blue text-shield-blue hover:bg-shield-blue hover:text-white transition-all">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto lg:mx-0 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-shield-blue rounded-3xl blur-3xl opacity-5 transform -rotate-6"></div>
              <div className="parallax glass-card p-8 relative" data-speed="0.8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-shield-blue mr-2" />
                    <span className="text-xl font-semibold">Evidence Vault</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-shield-blue/10 flex items-center justify-center">
                    <ArrowUp className="h-5 w-5 text-shield-blue" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-40 rounded-xl bg-gray-100 shimmer"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-20 rounded-lg bg-gray-100 shimmer"></div>
                    <div className="h-20 rounded-lg bg-gray-100 shimmer"></div>
                    <div className="h-20 rounded-lg bg-gray-100 shimmer"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100 shimmer"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-100 shimmer"></div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-shield-blue text-white hover:bg-blue-600 transition-all">
                      Submit Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 parallax" data-speed="1.2">
              <div className="glass-card p-4 shadow-lg transform rotate-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Verified on Blockchain</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 parallax" data-speed="1">
              <div className="glass-card p-3 shadow-lg transform -rotate-12">
                <div className="text-xs font-semibold text-shield-blue">+250 SHIELD</div>
                <div className="text-[10px] text-gray-500">Reward Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="text-sm text-gray-500 mb-2">Scroll to explore</div>
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-1">
          <div className="w-1 h-1 rounded-full bg-gray-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
