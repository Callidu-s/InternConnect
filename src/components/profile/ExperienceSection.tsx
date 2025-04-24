
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
  location?: string;
}

const ExperienceSection = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  
  const [experiences, setExperiences] = useState<Experience[]>(
    user?.experiences || []
  );
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setCurrentExperience(null);
  };
  
  const handleEditExperience = (experience: Experience) => {
    setCurrentExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location || '',
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description.join('\n'),
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description.split('\n').filter(item => item.trim() !== ''),
    };
    
    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    
    if (updateUserProfile) {
      updateUserProfile({ experiences: updatedExperiences });
      toast({
        title: "Experience Added",
        description: "Your experience has been added to your profile.",
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateExperience = () => {
    if (!currentExperience) return;
    
    const updatedExperiences = experiences.map(exp => 
      exp.id === currentExperience.id ? {
        ...exp,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description.split('\n').filter(item => item.trim() !== ''),
      } : exp
    );
    
    setExperiences(updatedExperiences);
    
    if (updateUserProfile) {
      updateUserProfile({ experiences: updatedExperiences });
      toast({
        title: "Experience Updated",
        description: "Your experience has been updated successfully.",
      });
    }
    
    resetForm();
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    
    if (updateUserProfile) {
      updateUserProfile({ experiences: updatedExperiences });
      toast({
        title: "Experience Deleted",
        description: "Your experience has been removed from your profile.",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Experience</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-intern-medium hover:bg-intern-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Experience</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input 
                    id="company" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description (Enter each bullet point on a new line)
                </Label>
                <Textarea 
                  id="description" 
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Redesigned the company website
Improved site performance by 40%
Added new features including event calendar"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleAddExperience}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input 
                    id="edit-title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company/Organization</Label>
                  <Input 
                    id="edit-company" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location (Optional)</Label>
                <Input 
                  id="edit-location" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input 
                    id="edit-startDate" 
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input 
                    id="edit-endDate" 
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">
                  Description (Enter each bullet point on a new line)
                </Label>
                <Textarea 
                  id="edit-description" 
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleUpdateExperience}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No experience added yet. Add your work experience to showcase your skills.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {experiences.map((experience) => (
            <div key={experience.id} className="border-l-4 border-intern-medium pl-4 py-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{experience.title}</h4>
                  <p className="text-intern-dark">{experience.company}</p>
                  <p className="text-gray-500">
                    {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    {experience.location && ` · ${experience.location}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditExperience(experience)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(experience.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <ul className="mt-2 ml-5 list-disc space-y-1">
                {experience.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
