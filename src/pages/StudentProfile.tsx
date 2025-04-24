
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ExperienceSection from '@/components/profile/ExperienceSection';
import DocumentsSection from '@/components/profile/DocumentsSection';
import SkillsSection from '@/components/profile/SkillsSection';
import EducationSection from '@/components/profile/EducationSection';
import { User as UserIcon, Book, Briefcase, FileText } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('experience');
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Profile sidebar */}
        <div className="md:col-span-1">
          <ProfileSidebar />
        </div>
        
        {/* Right column - Tabbed content */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Information</h2>
              <div className="flex space-x-2">
                {/* This is a visual header only - the actual Tabs component is below */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    variant={activeTab === 'experience' ? 'default' : 'outline'} 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab('experience')}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Experience</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'education' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab('education')}
                  >
                    <Book className="h-4 w-4" />
                    <span>Education</span>
                  </Button>
                  <Button 
                    variant={activeTab === 'skills' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab('skills')}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Skills</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Proper Tabs implementation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* TabsList is hidden because we're using custom buttons above */}
                <TabsList className="hidden">
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="experience" className="mt-0">
                  <ExperienceSection />
                </TabsContent>
                
                <TabsContent value="education" className="mt-0">
                  <EducationSection />
                </TabsContent>
                
                <TabsContent value="skills" className="mt-0">
                  <SkillsSection />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
          
          <div className="mt-8">
            <DocumentsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

