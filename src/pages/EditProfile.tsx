
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
import { GraduationCap, Building } from 'lucide-react';

const EditProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [studentFormData, setStudentFormData] = useState({
    major: '',
    graduationYear: '',
    skills: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: '',
  });

  const [companyFormData, setCompanyFormData] = useState({
    companySize: '',
    foundedYear: '',
    location: '',
    longDescription: '',
    linkedIn: '',
    twitter: '',
  });

  // Populate forms with existing user data
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        setStudentFormData({
          major: user.major || '',
          graduationYear: user.graduationYear?.toString() || '',
          skills: user.skills || '',
          bio: user.bio || '',
          linkedIn: user.linkedIn || '',
          github: user.github || '',
          portfolio: user.portfolio || '',
        });
      } else if (user.role === 'company') {
        setCompanyFormData({
          companySize: user.companySize || '',
          foundedYear: user.foundedYear || '',
          location: user.location || '',
          longDescription: user.longDescription || '',
          linkedIn: user.linkedIn || '',
          twitter: user.twitter || '',
        });
      }
    }
  }, [user]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCompanyFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    if (user?.role === 'student') {
      setStudentFormData(prev => ({ ...prev, [field]: value }));
    } else if (user?.role === 'company') {
      setCompanyFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001+ employees"
  ];

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateUserProfile) {
      // Make sure graduationYear remains a string when updating the profile
      updateUserProfile({
        ...studentFormData,
        profileCompleted: true
      });
      
      toast({
        title: "Profile Updated!",
        description: "Your student profile has been updated successfully.",
      });
      
      navigate('/student-portal');
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateUserProfile) {
      updateUserProfile({
        ...companyFormData,
        profileCompleted: true
      });
      
      toast({
        title: "Profile Updated!",
        description: "Your company profile has been updated successfully.",
      });
      
      navigate('/company-dashboard');
    }
  };

  if (!user) return null;

  // Render appropriate form based on user role
  if (user.role === 'student') {
    return (
      <div className="page-container flex items-center justify-center py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-intern-light p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-intern-dark" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Edit Your Student Profile</CardTitle>
            <CardDescription className="text-center">
              Update your profile details to keep them current
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleStudentSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study</Label>
                  <Input 
                    id="major" 
                    placeholder="Computer Science" 
                    required 
                    value={studentFormData.major}
                    onChange={handleStudentChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, 'graduationYear')} 
                    value={studentFormData.graduationYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input 
                  id="skills" 
                  placeholder="JavaScript, React, Python, etc." 
                  required 
                  value={studentFormData.skills}
                  onChange={handleStudentChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell employers about yourself..." 
                  className="resize-none"
                  rows={4}
                  value={studentFormData.bio}
                  onChange={handleStudentChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedIn">LinkedIn URL (Optional)</Label>
                <Input 
                  id="linkedIn" 
                  placeholder="https://linkedin.com/in/yourusername" 
                  value={studentFormData.linkedIn}
                  onChange={handleStudentChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL (Optional)</Label>
                <Input 
                  id="github" 
                  placeholder="https://github.com/yourusername" 
                  value={studentFormData.github}
                  onChange={handleStudentChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website (Optional)</Label>
                <Input 
                  id="portfolio" 
                  placeholder="https://yourportfolio.com" 
                  value={studentFormData.portfolio}
                  onChange={handleStudentChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
                Update Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  } else if (user.role === 'company') {
    return (
      <div className="page-container flex items-center justify-center py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-intern-light p-3 rounded-full">
                <Building className="h-8 w-8 text-intern-dark" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Edit Your Company Profile</CardTitle>
            <CardDescription className="text-center">
              Update your company details to attract the best candidates
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCompanySubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, 'companySize')} 
                    value={companyFormData.companySize}
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
                    value={companyFormData.foundedYear}
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Headquarters Location</Label>
                <Input 
                  id="location" 
                  placeholder="San Francisco, CA" 
                  required 
                  value={companyFormData.location}
                  onChange={handleCompanyChange}
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
                  value={companyFormData.longDescription}
                  onChange={handleCompanyChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedIn">LinkedIn URL (Optional)</Label>
                <Input 
                  id="linkedIn" 
                  placeholder="https://linkedin.com/company/yourcompany" 
                  value={companyFormData.linkedIn}
                  onChange={handleCompanyChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X URL (Optional)</Label>
                <Input 
                  id="twitter" 
                  placeholder="https://twitter.com/yourcompany" 
                  value={companyFormData.twitter}
                  onChange={handleCompanyChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-intern-medium hover:bg-intern-dark">
                Update Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }
  
  return null;
};

export default EditProfile;
