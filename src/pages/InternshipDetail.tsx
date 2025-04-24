import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPinIcon, ClockIcon, CalendarIcon, DollarSignIcon, BuildingIcon, BriefcaseIcon, ExternalLinkIcon, SendIcon } from 'lucide-react';
import { useInternships } from '../contexts/InternshipContext';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationContext';

const InternshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const internshipId = parseInt(id || '0');
  const { getInternshipById, removeInternship } = useInternships();
  const { user } = useAuth();
  const { getApplicationsByStudentId } = useApplications();
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const navigate = useNavigate();
  
  const internship = getInternshipById(internshipId);
  
  useEffect(() => {
    if (user && user.role === 'student') {
      const applications = getApplicationsByStudentId(user.id);
      const applied = applications.some(app => app.internshipId === internshipId);
      setAlreadyApplied(applied);
    }
  }, [user, internshipId, getApplicationsByStudentId]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this internship listing?')) {
      removeInternship(internshipId);
      navigate('/company-dashboard');
    }
  };
  
  if (!internship) {
    return (
      <div className="page-container py-12">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Internship Not Found</h2>
            <p className="mb-4">The internship you're looking for doesn't exist or has been removed.</p>
            <Link to="/internships">
              <Button className="bg-intern-medium hover:bg-intern-dark">
                Back to Internship List
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isCompany = user?.role === 'company';
  const isCompanyOwner = isCompany && user?.companyName === internship.company;
  const isStudent = user?.role === 'student';
  
  return (
    <div className="page-container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{internship.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <BuildingIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">{internship.company}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {isCompanyOwner ? (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/edit-internship/${internshipId}`)}
                  >
                    Edit Listing
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                  <Button 
                    className="bg-intern-medium hover:bg-intern-dark"
                    onClick={() => navigate(`/internships/${internshipId}/applications`)}
                  >
                    View Applications
                  </Button>
                </div>
              ) : isStudent ? (
                alreadyApplied ? (
                  <Button variant="outline" disabled>
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    className="bg-intern-medium hover:bg-intern-dark"
                    onClick={() => navigate(`/internships/${internshipId}/apply`)}
                  >
                    <SendIcon className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                )
              ) : (
                <Button 
                  className="bg-intern-medium hover:bg-intern-dark"
                  onClick={() => navigate('/login')}
                >
                  <SendIcon className="mr-2 h-4 w-4" />
                  Login to Apply
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-intern-light p-4 rounded-lg">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span>Location: <span className="font-medium">{internship.location}</span></span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span>Type: <span className="font-medium">{internship.type}</span></span>
            </div>
            <div className="flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span>Compensation: <span className="font-medium">{internship.stipend || 'Not specified'}</span></span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span>Posted: <span className="font-medium">{internship.posted}</span></span>
            </div>
            {internship.deadline && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
                <span>Application Deadline: <span className="font-medium">{internship.deadline}</span></span>
              </div>
            )}
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span>Category: <span className="font-medium">{internship.category}</span></span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div className="whitespace-pre-line text-gray-700">
              {internship.description}
            </div>
          </div>
          
          {internship.requirements && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <div className="whitespace-pre-line text-gray-700">
                {internship.requirements}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-intern-light text-intern-dark border-intern">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {internship.companyWebsite && (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Company Website</h3>
                <p className="text-sm text-gray-600">Learn more about {internship.company}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={internship.companyWebsite} target="_blank" rel="noopener noreferrer">
                  Visit Website
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
          
          {isStudent && !alreadyApplied && !isCompanyOwner && (
            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-intern-medium hover:bg-intern-dark px-8"
                onClick={() => navigate(`/internships/${internshipId}/apply`)}
              >
                <SendIcon className="mr-2 h-4 w-4" />
                Apply for this Internship
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternshipDetail;
