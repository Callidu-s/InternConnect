
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, Users, UserCheck, Clock, Settings, PencilIcon, EyeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInternships } from '@/contexts/InternshipContext';
import { useApplications } from '@/contexts/ApplicationContext';
import CompanyDashboardCard from '@/components/dashboard/CompanyDashboardCard';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { applications } = useApplications();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    } else if (!user.profileCompleted) {
      navigate('/company-profile-creation');
    }
    
    // Add event listener to refresh the component when internships change
    const handleInternshipsChanged = () => {
      console.log("Internships updated, refreshing dashboard");
      // Force a re-render by updating state
      setActiveTab(prev => prev);
    };
    
    window.addEventListener('internshipsChanged', handleInternshipsChanged);
    window.addEventListener('applicationsChanged', handleInternshipsChanged);
    
    return () => {
      window.removeEventListener('internshipsChanged', handleInternshipsChanged);
      window.removeEventListener('applicationsChanged', handleInternshipsChanged);
    };
  }, [user, navigate]);

  if (!user) return null;

  const companyInternships = internships.filter(internship => 
    internship.company === user.companyName
  );

  const companyInternshipIds = companyInternships.map(internship => internship.id);
  const companyApplications = applications.filter(application => 
    companyInternshipIds.includes(application.internshipId)
  );

  const newApplications = companyApplications.filter(app => app.status === 'pending').length;
  const shortlistedApplications = companyApplications.filter(app => app.status === 'shortlisted').length;
  const reviewingApplications = companyApplications.filter(app => app.status === 'reviewing').length;
  
  return (
    <div className="page-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.companyName}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-intern-medium hover:bg-intern-dark"
          onClick={() => navigate('/post-internship')}
        >
          <PlusIcon className="mr-2 h-5 w-5" /> Post New Internship
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Internship Listings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CompanyDashboardCard
              title="Active Listings"
              value={companyInternships.length.toString()}
              description="Total internship positions"
              icon={<Settings size={24} />}
              action={{ text: "Manage Listings", onClick: () => setActiveTab("listings") }}
            />
            
            <CompanyDashboardCard
              title="New Applications"
              value={newApplications.toString()}
              description="Candidates awaiting review"
              icon={<Users size={24} />}
              action={{ text: "Review Applications", onClick: () => navigate('/company-applications') }}
            />
            
            <CompanyDashboardCard
              title="Shortlisted"
              value={shortlistedApplications.toString()}
              description="Candidates in selection process"
              icon={<UserCheck size={24} />}
              action={{ text: "View Shortlisted", onClick: () => navigate('/company-applications') }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
            {companyInternships.length > 0 ? (
              <div className="space-y-4">
                {companyInternships.slice(0, 3).map((internship) => (
                  <Card key={internship.id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{internship.title}</h3>
                          <p className="text-gray-600 text-sm">{internship.location} • {internship.type}</p>
                          <div className="flex items-center mt-1 text-gray-500 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            Posted on {internship.posted}
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                            {companyApplications.filter(app => app.internshipId === internship.id).length} Applications
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-2 flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600" 
                        onClick={() => navigate(`/edit-internship/${internship.id}`)}
                      >
                        <PencilIcon className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600" 
                        onClick={() => navigate(`/internships/${internship.id}/applications`)}
                      >
                        <EyeIcon className="h-3 w-3 mr-1" /> Applications
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {companyInternships.length > 3 && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("listings")}
                    >
                      View All Listings
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Internships Posted Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first internship listing to start receiving applications.</p>
                  <Button 
                    className="bg-intern-medium hover:bg-intern-dark"
                    onClick={() => navigate('/post-internship')}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" /> Post New Internship
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Application Status</h2>
            {companyApplications.length > 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-yellow-700">{newApplications}</span>
                      <p className="text-sm text-yellow-600">New</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-blue-700">{reviewingApplications}</span>
                      <p className="text-sm text-blue-600">Reviewing</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-purple-700">{shortlistedApplications}</span>
                      <p className="text-sm text-purple-600">Shortlisted</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <span className="text-2xl font-bold text-green-700">
                        {companyApplications.filter(app => app.status === 'accepted').length}
                      </span>
                      <p className="text-sm text-green-600">Accepted</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-center p-3">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/company-applications')}
                  >
                    Manage All Applications
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Applications Yet</h3>
                  <p className="text-gray-600">Once you receive applications, you'll see statistics here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Internship Listings</CardTitle>
              <CardDescription>Manage all your posted internship positions</CardDescription>
            </CardHeader>
            <CardContent>
              {companyInternships.length > 0 ? (
                <div className="space-y-4">
                  {companyInternships.map((internship) => (
                    <Card key={internship.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{internship.title}</h3>
                            <p className="text-gray-600 text-sm">{internship.location} • {internship.type}</p>
                            <div className="flex items-center mt-1 text-gray-500 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              Posted on {internship.posted}
                              {internship.deadline && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Deadline: {internship.deadline}
                                </>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {internship.skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {internship.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{internship.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                              {companyApplications.filter(app => app.internshipId === internship.id).length} Applications
                            </Badge>
                            <div className="flex mt-2 space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-600" 
                                onClick={() => navigate(`/edit-internship/${internship.id}`)}
                              >
                                <PencilIcon className="h-3 w-3 mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-600" 
                                onClick={() => navigate(`/internships/${internship.id}/applications`)}
                              >
                                <Users className="h-3 w-3 mr-1" /> View Applicants
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Internships Posted Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first internship listing to start receiving applications.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-intern-medium hover:bg-intern-dark"
                onClick={() => navigate('/post-internship')}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Post New Internship
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Review and manage candidate applications</CardDescription>
            </CardHeader>
            <CardContent>
              {companyApplications.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant={newApplications > 0 ? "default" : "outline"}
                      className={newApplications > 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      onClick={() => navigate('/company-applications')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      New ({newApplications})
                    </Button>
                    <Button 
                      variant={reviewingApplications > 0 ? "default" : "outline"}
                      className={reviewingApplications > 0 ? "bg-blue-500 hover:bg-blue-600" : ""}
                      onClick={() => navigate('/company-applications')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Reviewing ({reviewingApplications})
                    </Button>
                    <Button 
                      variant={shortlistedApplications > 0 ? "default" : "outline"}
                      className={shortlistedApplications > 0 ? "bg-purple-500 hover:bg-purple-600" : ""}
                      onClick={() => navigate('/company-applications')}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Shortlisted ({shortlistedApplications})
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/company-applications')}
                    >
                      View All
                    </Button>
                  </div>
                  
                  {newApplications > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">New Applications</h3>
                      <div className="space-y-3">
                        {companyApplications
                          .filter(app => app.status === 'pending')
                          .slice(0, 3)
                          .map(app => {
                            const internship = companyInternships.find(i => i.id === app.internshipId);
                            return (
                              <Card key={app.id} className="card-hover">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm font-medium">
                                        Position: {internship ? internship.title : "Unknown Position"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Applicant ID: {app.studentId}
                                      </p>
                                      <div className="flex items-center mt-1 text-gray-500 text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      className="bg-intern-medium hover:bg-intern-dark"
                                      onClick={() => navigate(`/applications/${app.id}/review`)}
                                    >
                                      Review Now
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Applications Yet</h3>
                  <p className="text-gray-600">
                    You haven't received any applications for your internships yet.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => navigate('/company-applications')}
                className="bg-intern-medium hover:bg-intern-dark"
              >
                Manage All Applications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
