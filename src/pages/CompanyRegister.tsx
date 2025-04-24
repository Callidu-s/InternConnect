
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CompanyFormData = {
  companyName: string;
  industry: string;
  website: string;
  email: string;
  password: string;
  companyDescription: string;
};

const CompanyRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    industry: '',
    website: '',
    email: '',
    password: '',
    companyDescription: '',
  });
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some((user: any) => user.email === formData.email);
    if (emailExists) {
      setError('Email already registered');
      return;
    }

    // Save company data
    const newCompany = {
      id: Date.now().toString(),
      companyName: formData.companyName,
      industry: formData.industry,
      website: formData.website,
      email: formData.email,
      password: formData.password,
      companyDescription: formData.companyDescription,
      role: 'company',
      profileCompleted: false,
    };
    
    localStorage.setItem('users', JSON.stringify([...users, newCompany]));
    
    // Set current user as logged in
    localStorage.setItem('currentUser', JSON.stringify(newCompany));
    
    toast({
      title: "Registration Successful!",
      description: "Now let's complete your company profile to attract the right candidates.",
    });
    
    // Force window to dispatch event to update auth context
    window.dispatchEvent(new Event('userStateChange'));
    
    // Navigate to company profile creation
    navigate('/company-profile-creation');
  };

  return (
    <div className="page-container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-intern-light p-3 rounded-full">
              <Building className="h-8 w-8 text-intern-dark" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Company Registration</CardTitle>
          <CardDescription className="text-center">
            Create an account to post internships and find talented students
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                placeholder="Acme Inc." 
                required 
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                placeholder="Technology, Healthcare, etc." 
                required 
                value={formData.industry}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
              <Input 
                id="website" 
                type="url" 
                placeholder="https://www.example.com" 
                required 
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contact@acme.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea 
                id="companyDescription" 
                placeholder="Tell us about your company, culture, and mission..." 
                className="resize-none"
                rows={4}
                value={formData.companyDescription}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
              Create Account
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-intern-dark hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyRegister;
