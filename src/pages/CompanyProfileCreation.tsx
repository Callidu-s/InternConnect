
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Building } from 'lucide-react';

const CompanyProfileCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Redirect if not logged in or not a company
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'company') {
      navigate('/');
    } else if (user.profileCompleted) {
      navigate('/company-dashboard');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    companySize: '',
    foundedYear: '',
    location: '',
    longDescription: '',
    linkedIn: '',
    twitter: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001+ employees"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateUserProfile) {
      updateUserProfile({
        ...formData,
        profileCompleted: true
      });
      
      toast({
        title: "Profile Completed!",
        description: "Your company profile has been created successfully.",
      });
      
      navigate('/company-dashboard');
    }
  };

  if (!user) return null;

  return (
    <div className="page-container flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-intern-light p-3 rounded-full">
              <Building className="h-8 w-8 text-intern-dark" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Complete Your Company Profile</CardTitle>
          <CardDescription className="text-center">
            Add details to help students learn more about your company
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, 'companySize')} 
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input 
                  id="foundedYear" 
                  placeholder="2010" 
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  required 
                  value={formData.foundedYear}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Headquarters Location</Label>
              <Input 
                id="location" 
                placeholder="San Francisco, CA" 
                required 
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longDescription">Company Description</Label>
              <Textarea 
                id="longDescription" 
                placeholder="Tell students more about your company's mission, culture, and values..." 
                className="resize-none"
                rows={6}
                required
                value={formData.longDescription}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn URL (Optional)</Label>
              <Input 
                id="linkedIn" 
                placeholder="https://linkedin.com/company/yourcompany" 
                value={formData.linkedIn}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X URL (Optional)</Label>
              <Input 
                id="twitter" 
                placeholder="https://twitter.com/yourcompany" 
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
              Complete Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyProfileCreation;
