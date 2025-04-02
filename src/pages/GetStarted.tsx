
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shield, User, Mail, Lock, UserPlus, CheckCircle, UserCog } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GetStarted = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/ekyc');
    } catch (error) {
      console.error('Signup error:', error);
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="section-padding bg-background flex items-center justify-center pt-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-center lg:text-left mb-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-background shadow-sm mb-4">
                  <UserPlus className="h-4 w-4 text-shield-blue mr-2" />
                  <span className="text-xs font-medium">Join Us</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get Started with <span className="text-shield-blue">Midshield</span></h2>
                <p className="text-gray-600">Create your account to start reporting crimes, securing evidence, and earning rewards.</p>
              </div>
              
              <div className="glass-card p-8 max-w-md mx-auto lg:mx-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-shield-blue focus:border-shield-blue"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-shield-blue focus:border-shield-blue"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm font-medium text-foreground mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md shadow-sm focus:ring-shield-blue focus:border-shield-blue"
                        placeholder="••••••••"
                        required
                        minLength={5}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-shield-blue focus:ring-shield-blue border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                      I agree to the <a href="#" className="text-shield-blue hover:underline">Terms of Service</a> and <a href="#" className="text-shield-blue hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-shield-blue text-white hover:bg-blue-600 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-gray-500">Or sign up with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <AuthButton />
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="font-medium text-shield-blue hover:text-blue-600">
                      Sign In
                    </a>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      <UserCog className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Are you a law enforcement officer?</span>
                    </div>
                    <div className="mt-2 text-center">
                      <Link to="/officer-registration" className="text-sm font-medium text-shield-blue hover:text-blue-600">
                        Register for Officer Access
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-shield-blue rounded-3xl blur-3xl opacity-5 transform rotate-6"></div>
                <div className="glass-card p-8 relative">
                  <h3 className="text-xl font-semibold mb-6">Why Join Midshield?</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-base font-medium">Secure Evidence Storage</h4>
                        <p className="text-sm text-gray-600">All evidence is securely stored on blockchain, ensuring data integrity.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-base font-medium">Earn Crypto Rewards</h4>
                        <p className="text-sm text-gray-600">Get rewarded with cryptocurrency for contributing to public safety.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-base font-medium">AI-Powered Analysis</h4>
                        <p className="text-sm text-gray-600">Our AI helps analyze evidence and automatically generates reports.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-base font-medium">Image Comparison</h4>
                        <p className="text-sm text-gray-600">Compare multiple crime scene images to identify patterns and connections.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default GetStarted;
