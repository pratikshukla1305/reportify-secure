
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shield, User, Mail, Lock, UserCog } from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    setIsLoading(true);
    
    try {
      await signin(formData.email, formData.password);
      navigate('/ekyc');
    } catch (error) {
      console.error('Login error:', error);
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
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-shield-blue rounded-3xl blur-3xl opacity-5 transform -rotate-6"></div>
                <div className="glass-card p-8 relative">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-shield-blue mr-2" />
                      <span className="text-xl font-semibold">Midshield</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-64 rounded-xl bg-gray-100 shimmer"></div>
                    
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-100 shimmer"></div>
                      <div className="h-4 w-1/2 rounded bg-gray-100 shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-center lg:text-left mb-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-shield-border bg-background shadow-sm mb-4">
                  <User className="h-4 w-4 text-shield-blue mr-2" />
                  <span className="text-xs font-medium">Secure Access</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Sign in to <span className="text-shield-blue">Midshield</span></h2>
                <p className="text-foreground/80">Access your account to manage evidence, reports, and rewards.</p>
              </div>
              
              <div className="glass-card p-8 max-w-md mx-auto lg:mx-0">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-shield-blue focus:ring-shield-blue border-gray-300 rounded"
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-foreground">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <a href="#" className="font-medium text-shield-blue hover:text-blue-600">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-shield-blue text-white hover:bg-blue-600 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <AuthButton />
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/get-started" className="font-medium text-shield-blue hover:text-blue-600">
                      Get Started
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      <UserCog className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Are you a law enforcement officer?</span>
                    </div>
                    <div className="mt-2 text-center">
                      <Link to="/officer-login" className="text-sm font-medium text-shield-blue hover:text-blue-600">
                        Sign in to the Officer Portal
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SignIn;
