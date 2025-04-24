import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useInternships } from '@/contexts/InternshipContext';
import { 
  ClockIcon, MapPinIcon, BriefcaseIcon, GraduationCap, BuildingIcon, 
  CheckCircleIcon, XCircleIcon, UserIcon, FileTextIcon, DownloadIcon, 
  MailIcon, GithubIcon, LinkedinIcon, GlobeIcon, BookOpenIcon,
  CalendarIcon, BookmarkIcon
} from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getUserById } = useAuth();
  const { getApplicationById, updateApplicationStatus } = useApplications();
  const { getInternship } = useInternships();
  
  const [notes, setNotes] = useState<string>('');
  const application = getApplicationById(parseInt(id || '0'));
  const internship = application ? getInternship(application.internshipId) : null;
  const studentData = application ? getUserById(application.studentId) : null;
  
  useEffect(() => {
    if (!application || !user) {
      toast({
        title: "Error",
        description: "Application not found.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (user.role === 'student' && application.studentId !== user.id) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this application.",
        variant: "destructive"
      });
      navigate('/student-applications');
      return;
    }

    if (user.role === 'company' && internship && internship.company !== user.companyName) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this application.",
        variant: "destructive"
      });
      navigate('/company-applications');
      return;
    }

    if (user.role === 'company' && application.notes) {
      setNotes(application.notes);
    }
  }, [application, user, navigate, toast, internship]);

  if (!application || !internship || !user || !studentData) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pending Review</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Under Review</Badge>;
      case 'shortlisted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300">Shortlisted</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Not Selected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateStatus = (status: 'reviewing' | 'shortlisted' | 'accepted' | 'rejected') => {
    updateApplicationStatus(application.id, status, notes);
    
    toast({
      title: "Status Updated",
      description: `Application has been marked as ${status}.`,
    });
    
    if (status === 'accepted' || status === 'rejected') {
      navigate('/company-applications');
    }
  };

  const handleDownloadResume = () => {
    if (!application.resume) return;
    
    const link = document.createElement('a');
    link.href = application.resume;
    link.download = application.resumeFileName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCompanyView = user.role === 'company';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="page-container py-8">
      <Card className="max-w-4xl mx-auto mb-6">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Application #{application.id}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <BuildingIcon className="h-4 w-4 mr-1" />
                {internship.company}
                <span className="mx-2">•</span>
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {internship.title}
                <span className="mx-2">•</span>
                <MapPinIcon className="h-4 w-4 mr-1" />
                {internship.location}
              </CardDescription>
            </div>
            <div>
              {getStatusBadge(application.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Application Details</h3>
              <span className="text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Submitted on {new Date(application.appliedDate).toLocaleDateString()}
              </span>
            </div>
            
            {isCompanyView && (
              <div className="mb-6 bg-white border rounded-md p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Applicant Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p>{studentData.firstName} {studentData.lastName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <p>{studentData.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">University</p>
                    <p>{studentData.university || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Major</p>
                    <p>{studentData.major || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Graduation Year</p>
                    <p>{studentData.graduationYear || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p>{studentData.location || 'Not specified'}</p>
                  </div>
                </div>
                
                {studentData.skills && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {studentData.skillsList ? 
                        studentData.skillsList.map((skill) => (
                          <Badge key={skill.id} variant="outline" className="bg-intern-light text-intern-dark">
                            {skill.name}
                          </Badge>
                        )) : 
                        studentData.skills.split(',').map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-intern-light text-intern-dark">
                            {skill.trim()}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {studentData.bio && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Bio</p>
                    <p>{studentData.bio}</p>
                  </div>
                )}
                
                {studentData.experiences && studentData.experiences.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium mb-3 flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-600" />
                      Work Experience
                    </h5>
                    <div className="space-y-4">
                      {studentData.experiences.map((experience) => (
                        <div key={experience.id} className="border-l-2 border-intern-light pl-4 py-1">
                          <div className="flex justify-between">
                            <h6 className="font-medium">{experience.title}</h6>
                            <span className="text-sm text-gray-500">
                              {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                            </span>
                          </div>
                          <p className="text-gray-700">{experience.company} {experience.location && `• ${experience.location}`}</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                            {experience.description.map((bullet, idx) => (
                              <li key={idx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {studentData.education && studentData.education.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium mb-3 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-600" />
                      Education
                    </h5>
                    <div className="space-y-4">
                      {studentData.education.map((edu) => (
                        <div key={edu.id} className="border-l-2 border-intern-light pl-4 py-1">
                          <div className="flex justify-between">
                            <h6 className="font-medium">{edu.school}</h6>
                            <span className="text-sm text-gray-500">
                              {edu.startYear} - {edu.endYear}
                            </span>
                          </div>
                          <p className="text-gray-700">{edu.degree} in {edu.field}</p>
                          {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                          {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {studentData.documents && studentData.documents.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-medium mb-3 flex items-center">
                      <FileTextIcon className="h-4 w-4 mr-2 text-gray-600" />
                      Documents
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studentData.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-3 border rounded p-2">
                          <FileTextIcon className="h-5 w-5 text-intern-dark flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.type} • {formatDate(doc.dateUploaded)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex flex-wrap gap-3">
                  {studentData.linkedIn && (
                    <Button size="sm" variant="outline" asChild className="h-8">
                      <a href={studentData.linkedIn} target="_blank" rel="noopener noreferrer">
                        <LinkedinIcon className="h-4 w-4 mr-1" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  
                  {studentData.github && (
                    <Button size="sm" variant="outline" asChild className="h-8">
                      <a href={studentData.github} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="h-4 w-4 mr-1" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  
                  {studentData.portfolio && (
                    <Button size="sm" variant="outline" asChild className="h-8">
                      <a href={studentData.portfolio} target="_blank" rel="noopener noreferrer">
                        <GlobeIcon className="h-4 w-4 mr-1" />
                        Portfolio
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {isCompanyView && application.resume && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Resume / CV</p>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadResume}
                  className="w-full bg-white flex justify-center gap-2 hover:bg-gray-50"
                >
                  <FileTextIcon className="h-5 w-5" />
                  <span>Download Resume</span>
                  <DownloadIcon className="h-5 w-5" />
                </Button>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm font-medium mb-2 flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                Cover Letter
              </p>
              <div className="bg-white border rounded-md p-4 text-gray-800">
                {application.coverLetter}
              </div>
            </div>

            {application.notes && user.role === 'student' && application.status !== 'pending' && (
              <div>
                <p className="text-sm font-medium mb-2">Feedback from Employer</p>
                <div className="bg-white border rounded-md p-4 text-gray-800">
                  {application.notes}
                </div>
              </div>
            )}
          </div>

          {isCompanyView && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Review Application</h3>
                <Textarea
                  placeholder="Add notes or feedback for this application..."
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className={`flex ${isCompanyView ? 'justify-between' : 'justify-end'}`}>
          {isCompanyView ? (
            <>
              <div className="flex gap-2">
                {application.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpdateStatus('reviewing')}
                  >
                    Mark as Reviewing
                  </Button>
                )}
                
                {(application.status === 'pending' || application.status === 'reviewing') && (
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white" 
                    onClick={() => handleUpdateStatus('shortlisted')}
                  >
                    Shortlist Candidate
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {application.status !== 'rejected' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleUpdateStatus('rejected')}
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                )}
                
                {application.status !== 'accepted' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={() => handleUpdateStatus('accepted')}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/student-applications')}
            >
              Back to Applications
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationDetail;
