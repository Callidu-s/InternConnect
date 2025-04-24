
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
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description?: string;
  gpa?: string;
}

const EducationSection = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  
  const [educationList, setEducationList] = useState<Education[]>(
    user?.education || []
  );
  
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: '',
    gpa: '',
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
      school: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      description: '',
      gpa: '',
    });
    setCurrentEducation(null);
  };
  
  const handleEditEducation = (education: Education) => {
    setCurrentEducation(education);
    setFormData({
      school: education.school,
      degree: education.degree,
      field: education.field,
      startYear: education.startYear,
      endYear: education.endYear,
      description: education.description || '',
      gpa: education.gpa || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: formData.school,
      degree: formData.degree,
      field: formData.field,
      startYear: formData.startYear,
      endYear: formData.endYear,
      description: formData.description,
      gpa: formData.gpa,
    };
    
    const updatedEducationList = [...educationList, newEducation];
    setEducationList(updatedEducationList);
    
    if (updateUserProfile) {
      updateUserProfile({ education: updatedEducationList });
      toast({
        title: "Education Added",
        description: "Your education has been added to your profile.",
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateEducation = () => {
    if (!currentEducation) return;
    
    const updatedEducationList = educationList.map(edu => 
      edu.id === currentEducation.id ? {
        ...edu,
        school: formData.school,
        degree: formData.degree,
        field: formData.field,
        startYear: formData.startYear,
        endYear: formData.endYear,
        description: formData.description,
        gpa: formData.gpa,
      } : edu
    );
    
    setEducationList(updatedEducationList);
    
    if (updateUserProfile) {
      updateUserProfile({ education: updatedEducationList });
      toast({
        title: "Education Updated",
        description: "Your education has been updated successfully.",
      });
    }
    
    resetForm();
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteEducation = (id: string) => {
    const updatedEducationList = educationList.filter(edu => edu.id !== id);
    setEducationList(updatedEducationList);
    
    if (updateUserProfile) {
      updateUserProfile({ education: updatedEducationList });
      toast({
        title: "Education Deleted",
        description: "Your education has been removed from your profile.",
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Education</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-intern-medium hover:bg-intern-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="school">School/University</Label>
                <Input 
                  id="school" 
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input 
                    id="degree" 
                    name="degree"
                    placeholder="Bachelor's, Master's, Ph.D."
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input 
                    id="field" 
                    name="field"
                    placeholder="Computer Science"
                    value={formData.field}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input 
                    id="startYear" 
                    name="startYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2020"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endYear">End Year (or Expected)</Label>
                  <Input 
                    id="endYear" 
                    name="endYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2024"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA (Optional)</Label>
                  <Input 
                    id="gpa" 
                    name="gpa"
                    placeholder="3.8"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  rows={3}
                  placeholder="Relevant courses, honors, activities, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleAddEducation}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Education</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-school">School/University</Label>
                <Input 
                  id="edit-school" 
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-degree">Degree</Label>
                  <Input 
                    id="edit-degree" 
                    name="degree"
                    placeholder="Bachelor's, Master's, Ph.D."
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-field">Field of Study</Label>
                  <Input 
                    id="edit-field" 
                    name="field"
                    placeholder="Computer Science"
                    value={formData.field}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startYear">Start Year</Label>
                  <Input 
                    id="edit-startYear" 
                    name="startYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2020"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endYear">End Year (or Expected)</Label>
                  <Input 
                    id="edit-endYear" 
                    name="endYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2024"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gpa">GPA (Optional)</Label>
                  <Input 
                    id="edit-gpa" 
                    name="gpa"
                    placeholder="3.8"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea 
                  id="edit-description" 
                  name="description"
                  rows={3}
                  placeholder="Relevant courses, honors, activities, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleUpdateEducation}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {educationList.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No education added yet. Add your educational background.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {educationList.map((education) => (
            <div key={education.id} className="border-l-4 border-intern-medium pl-4 py-2">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-intern-dark" />
                    <h4 className="text-lg font-semibold">{education.school}</h4>
                  </div>
                  <p className="text-intern-dark">{education.degree} in {education.field}</p>
                  <p className="text-gray-500">{education.startYear} - {education.endYear}</p>
                  {education.gpa && <p className="text-gray-500">GPA: {education.gpa}</p>}
                  {education.description && <p className="mt-2 text-gray-700">{education.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditEducation(education)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteEducation(education.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;
