
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useInternships } from '@/contexts/InternshipContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { SendIcon, BriefcaseIcon, FileTextIcon, AlertCircleIcon } from 'lucide-react';

const ApplyInternship = () => {
  const { id } = useParams<{ id: string }>();
  const internshipId = parseInt(id || '0');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getInternship } = useInternships();
  const { applyToInternship, getApplicationsByInternshipId, getApplicationsByStudentId } = useApplications();
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [resume, setResume] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const internship = getInternship(internshipId);

  useEffect(() => {
    if (!internship) {
      toast({
        title: "Error",
        description: "Internship not found.",
        variant: "destructive"
      });
      navigate('/internships');
      return;
    }

    if (!user || user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "You must be logged in as a student to apply for internships.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Check if user already applied to this internship
    if (user) {
      const userApplications = getApplicationsByStudentId(user.id);
      const alreadyApplied = userApplications.some(app => app.internshipId === internshipId);
      
      if (alreadyApplied) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this internship.",
        });
        navigate(`/internships/${internshipId}`);
      }
    }
  }, [internship, user, navigate, toast, internshipId, getApplicationsByStudentId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Resume file must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type (accept PDF, DOC, DOCX)
    const fileType = file.type;
    if (
      fileType !== 'application/pdf' && 
      fileType !== 'application/msword' && 
      fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    setResumeFileName(file.name);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setResume(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!resume) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume/CV before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    applyToInternship({
      internshipId,
      studentId: user.id,
      coverLetter: coverLetter,
      resume: resume,
      resumeFileName: resumeFileName
    });
    
    toast({
      title: "Application Submitted!",
      description: "Your application has been successfully submitted.",
    });
    
    navigate('/student-applications');
  };

  if (!internship || !user) return null;

  return (
    <div className="page-container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Apply for Internship</CardTitle>
          <CardDescription>
            You're applying for the <span className="font-semibold">{internship.title}</span> position at <span className="font-semibold">{internship.company}</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Explain why you're a good fit for this position..."
                className="min-h-[200px] resize-none"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                A strong cover letter increases your chances of getting noticed by the employer.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="resume">Resume / CV (Required)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="resume"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="flex-1"
                  required
                />
                {resume && (
                  <div className="flex items-center text-green-600">
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{resumeFileName}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                Upload your resume in PDF or Word format (max 5MB)
              </p>
            </div>

            <div className="bg-intern-light rounded-lg p-4">
              <h3 className="font-medium flex items-center mb-2">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Internship Details
              </h3>
              <p className="text-sm"><span className="font-medium">Position:</span> {internship.title}</p>
              <p className="text-sm"><span className="font-medium">Company:</span> {internship.company}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {internship.location}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/internships/${internshipId}`)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-intern-medium hover:bg-intern-dark"
              disabled={isSubmitting || !resume}
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ApplyInternship;
