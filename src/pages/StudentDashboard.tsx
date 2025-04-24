
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Building, 
  FileText, 
  CalendarRange, 
  ChevronRight,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useInternships } from '@/contexts/InternshipContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { Internship } from '@/types/internship';
import { Application } from '@/types/application';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { applications } = useApplications();
  
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [recommendedInternships, setRecommendedInternships] = useState<Internship[]>([]);
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  
  useEffect(() => {
    if (user && applications) {
      // Get the user's applications
      const userApplications = applications
        .filter(app => app.studentId === user.id)
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        .slice(0, 3);
      
      setRecentApplications(userApplications);
    }
  }, [user, applications]);
  
  useEffect(() => {
    if (user && internships) {
      // Simple recommendation based on major
      const userMajor = user.major?.toLowerCase() || '';
      
      const recommended = internships
        .filter(internship => 
          // Filter out internships the user has already applied to
          !applications.some(app => 
            app.studentId === user.id && app.internshipId === internship.id
          )
        )
        .filter(internship => {
          const requirements = internship.requirements?.join(' ').toLowerCase() || '';
          const description = internship.description?.toLowerCase() || '';
          
          return (
            // Include internships that match the user's major or have relevant keywords
            requirements.includes(userMajor) ||
            description.includes(userMajor)
          );
        })
        .slice(0, 3);
      
      setRecommendedInternships(recommended);
      
      // For demo purposes, just show some random internships as "saved"
      setSavedInternships(
        internships
          .slice()
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
      );
    }
  }, [user, internships, applications]);
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
          <p className="text-gray-600 mt-1">Track your applications and discover new opportunities</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link to="/student-profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
          <Button asChild className="bg-intern-medium hover:bg-intern-dark">
            <Link to="/internships" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Find Internships
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <CheckCircle className="h-4 w-4 text-intern-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => app.studentId === user.id).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total internships applied
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => 
                app.studentId === user.id && 
                app.status === 'pending'
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarRange className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(app => 
                app.studentId === user.id && 
                (app.status === 'shortlisted')
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Interviews scheduled
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="applications" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>For You</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Recent Applications</h2>
          
          {recentApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-center text-gray-600">
                  You haven't applied to any internships yet.
                </p>
                <Button asChild className="mt-4 bg-intern-medium hover:bg-intern-dark">
                  <Link to="/internships">Browse Internships</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentApplications.map(app => {
                const internship = internships.find(i => i.id === app.internshipId);
                if (!internship) return null;
                
                return (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{internship.title}</h3>
                          <p className="text-sm text-gray-600">{internship.company}</p>
                          <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              app.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : app.status === 'rejected' 
                                  ? 'bg-red-100 text-red-800' 
                                  : app.status === 'shortlisted' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              Applied on {new Date(app.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button asChild variant="ghost" className="h-8 w-8 p-0">
                          <Link to={`/applications/${app.id}`}>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">View application</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <div className="flex justify-center mt-2">
                <Button asChild variant="outline">
                  <Link to="/student-applications" className="flex items-center">
                    View All Applications
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          
          {recommendedInternships.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-center text-gray-600">
                  We'll recommend internships based on your profile as you complete it.
                </p>
                <Button asChild className="mt-4 bg-intern-medium hover:bg-intern-dark">
                  <Link to="/edit-profile">Complete Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recommendedInternships.map(internship => (
                <Card key={internship.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{internship.title}</h3>
                        <p className="text-sm text-gray-600">{internship.company}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                            {internship.location}
                          </span>
                          {internship.compensation && (
                            <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            Posted {new Date(internship.posted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button asChild variant="ghost" className="h-8 w-8 p-0">
                        <Link to={`/internships/${internship.id}`}>
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View internship</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
