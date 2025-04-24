
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
import { GraduationCap } from 'lucide-react';

const StudentProfileCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Redirect if not logged in or not a student
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'student') {
      navigate('/');
    } else if (user.profileCompleted) {
      navigate('/student-portal');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    major: '',
    graduationYear: new Date().getFullYear() + 4, // Default to current year + 4
    skills: '',
    bio: '',
    linkedIn: '',
    github: '',
    portfolio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateUserProfile) {
      updateUserProfile({
        ...formData,
        // Convert graduationYear to string to match the User interface
        graduationYear: formData.graduationYear.toString(),
        profileCompleted: true
      });
      
      toast({
        title: "Profile Completed!",
        description: "Your student profile has been created successfully.",
      });
      
      navigate('/student-portal');
    }
  };

  if (!user) return null;

  return (
    <div className="page-container flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-intern-light p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-intern-dark" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Complete Your Student Profile</CardTitle>
          <CardDescription className="text-center">
            Add details to your profile to help companies get to know you better
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input 
                  id="major" 
                  placeholder="Computer Science" 
                  required 
                  value={formData.major}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, 'graduationYear')} 
                  defaultValue={currentYear.toString()}
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
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell employers about yourself..." 
                className="resize-none"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn URL (Optional)</Label>
              <Input 
                id="linkedIn" 
                placeholder="https://linkedin.com/in/yourusername" 
                value={formData.linkedIn}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL (Optional)</Label>
              <Input 
                id="github" 
                placeholder="https://github.com/yourusername" 
                value={formData.github}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Website (Optional)</Label>
              <Input 
                id="portfolio" 
                placeholder="https://yourportfolio.com" 
                value={formData.portfolio}
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

export default StudentProfileCreation;
