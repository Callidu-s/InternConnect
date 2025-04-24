
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useInternships } from '../contexts/InternshipContext';
import { PencilIcon } from 'lucide-react';
import InternshipForm, { InternshipFormValues } from '@/components/forms/InternshipForm';

const EditInternship = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getInternshipById, updateInternship } = useInternships();
  const [formValues, setFormValues] = useState<InternshipFormValues | null>(null);
  
  const internshipId = parseInt(id || '0');
  const internship = getInternshipById(internshipId);
  
  useEffect(() => {
    if (internship) {
      setFormValues({
        title: internship.title,
        company: internship.company,
        location: internship.location,
        type: internship.type,
        category: internship.category,
        description: internship.description,
        skills: internship.skills.join(', '),
        startDate: internship.startDate || '',
        deadline: internship.deadline || '',
        duration: internship.duration || '',
        stipend: internship.stipend || '',
        companyWebsite: internship.companyWebsite || '',
      });
    }
  }, [internship]);

  const onSubmit = (data: InternshipFormValues) => {
    const skillsArray = data.skills.split(',').map(skill => skill.trim());
    
    updateInternship(internshipId, {
      ...data,
      skills: skillsArray,
    });
    
    toast({
      title: "Internship Updated!",
      description: "Your internship has been successfully updated.",
    });
    
    navigate(`/internships/${internshipId}`);
  };

  const handleCancel = () => {
    navigate(`/internships/${internshipId}`);
  };

  if (!internship) {
    return (
      <div className="page-container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Internship Not Found</h2>
          <p className="mt-4 text-gray-600">
            The internship you're trying to edit doesn't exist or has been removed.
          </p>
          <Button className="mt-6" onClick={() => navigate('/company-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center mb-6">
        <PencilIcon className="h-6 w-6 text-intern-dark mr-2" />
        <h1 className="text-3xl font-bold">Edit Internship</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
          <CardDescription>
            Update the details of your internship posting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formValues && (
            <InternshipForm 
              defaultValues={formValues} 
              onSubmit={onSubmit} 
              onCancel={handleCancel}
              submitButtonText="Save Changes"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInternship;
