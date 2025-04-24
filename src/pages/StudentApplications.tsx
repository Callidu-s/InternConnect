
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useInternships } from '@/contexts/InternshipContext';
import { ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, LoaderIcon } from 'lucide-react';

const StudentApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getApplicationsByStudentId } = useApplications();
  const { getInternship } = useInternships();

  // If no user or not a student, redirect to login
  React.useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;
  
  const applications = getApplicationsByStudentId(user.id);
  
  // Group applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending' || app.status === 'reviewing');
  const shortlistedApplications = applications.filter(app => app.status === 'shortlisted');
  const completedApplications = applications.filter(app => app.status === 'accepted' || app.status === 'rejected');
  
  // Helper function to get the badge for each status
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
  
  // Helper function to get the application card
  const renderApplicationCard = (application: any) => {
    const internship = getInternship(application.internshipId);
    if (!internship) return null;
    
    return (
      <Card key={application.id} className="mb-4 card-hover">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{internship.title}</h3>
              <p className="text-gray-600">{internship.company}</p>
              <div className="flex items-center mt-2 text-gray-500 text-sm">
                <ClockIcon className="h-4 w-4 mr-1" />
                Applied on {new Date(application.appliedDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-col items-end">
              {getStatusBadge(application.status)}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate(`/applications/${application.id}`)}
              >
                <EyeIcon className="h-4 w-4 mr-1" /> View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="page-container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-gray-600 mt-1">Track and manage your internship applications</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">In Progress ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({shortlistedApplications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {applications.length > 0 ? (
            applications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Applications Yet</CardTitle>
                <CardDescription>
                  You haven't applied to any internships. Start exploring opportunities!
                </CardDescription>
                <Button 
                  className="mt-4 bg-intern-medium hover:bg-intern-dark"
                  onClick={() => navigate('/internships')}
                >
                  Browse Internships
                </Button>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingApplications.length > 0 ? (
            pendingApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Pending Applications</CardTitle>
                <CardDescription>
                  You don't have any applications currently under review.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="shortlisted">
          {shortlistedApplications.length > 0 ? (
            shortlistedApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Shortlisted Applications</CardTitle>
                <CardDescription>
                  None of your applications have been shortlisted yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedApplications.length > 0 ? (
            completedApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Completed Applications</CardTitle>
                <CardDescription>
                  You don't have any applications that have received a final decision.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentApplications;
