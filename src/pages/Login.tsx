
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [userType, setUserType] = useState<'student' | 'company'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === 'student' ? '/student-portal' : '/company-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password, userType);
      
      if (success) {
        toast({
          title: "Login Successful!",
          description: `Welcome back to InternConnect! You are now logged in.`,
        });
        // Navigation happens in useEffect to avoid redundant redirects
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    }
  };

  // If already authenticated, don't render the login form (it will redirect)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="page-container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your InternConnect account
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as 'student' | 'company')}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Student</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Company</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="student">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input 
                    id="student-email" 
                    type="email" 
                    placeholder="john.doe@university.edu" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="student-password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-intern-dark hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="student-password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
                  Sign In
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/student-register" className="text-intern-dark hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="company">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="company-email">Business Email</Label>
                  <Input 
                    id="company-email" 
                    type="email" 
                    placeholder="contact@acme.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="company-password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-intern-dark hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="company-password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
                  Sign In
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/company-register" className="text-intern-dark hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
