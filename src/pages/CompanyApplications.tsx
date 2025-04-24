import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useInternships } from '@/contexts/InternshipContext';
import { SearchIcon, UsersIcon, UserCheckIcon, ClockIcon, EyeIcon, GraduationCap } from 'lucide-react';

const CompanyApplications = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { applications } = useApplications();
  const { internships } = useInternships();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInternshipId, setSelectedInternshipId] = useState<number | null>(
    paramId ? parseInt(paramId) : null
  );

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  const companyInternships = internships.filter(internship => 
    internship.company === user?.companyName
  );

  const filteredApplications = applications.filter(application => {
    if (selectedInternshipId) {
      return application.internshipId === selectedInternshipId;
    }
    
    const internshipIds = companyInternships.map(internship => internship.id);
    return internshipIds.includes(application.internshipId);
  });

  const searchedApplications = filteredApplications.filter(application => {
    const studentId = application.studentId;
    return studentId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pendingApplications = searchedApplications.filter(app => app.status === 'pending');
  const reviewingApplications = searchedApplications.filter(app => app.status === 'reviewing');
  const shortlistedApplications = searchedApplications.filter(app => app.status === 'shortlisted');
  const finalApplications = searchedApplications.filter(app => 
    app.status === 'accepted' || app.status === 'rejected'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">New</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Reviewing</Badge>;
      case 'shortlisted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300">Shortlisted</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getInternshipTitle = (internshipId: number) => {
    const internship = internships.find(i => i.id === internshipId);
    return internship ? internship.title : 'Unknown Position';
  };

  const renderApplicationCard = (application: any) => {
    return (
      <Card key={application.id} className="mb-4 card-hover">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-1">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="font-medium">Student ID: {application.studentId}</span>
              </div>
              {!selectedInternshipId && (
                <p className="text-gray-600">
                  Position: {getInternshipTitle(application.internshipId)}
                </p>
              )}
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
                onClick={() => navigate(`/applications/${application.id}/review`)}
              >
                <EyeIcon className="h-4 w-4 mr-1" /> Review Application
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="page-container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-600 mt-1">
            {selectedInternshipId 
              ? `Applications for ${getInternshipTitle(selectedInternshipId)}` 
              : "Manage all applications to your internship listings"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select 
              className="w-full md:w-[250px] rounded-md border border-gray-300 p-2"
              value={selectedInternshipId || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedInternshipId(value ? parseInt(value) : null);
              }}
            >
              <option value="">All Internships</option>
              {companyInternships.map((internship) => (
                <option key={internship.id} value={internship.id}>
                  {internship.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All ({searchedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            New ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing ({reviewingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted ({shortlistedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="final">
            Final Decision ({finalApplications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {searchedApplications.length > 0 ? (
            searchedApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Applications Found</CardTitle>
                <CardDescription>
                  There are no applications matching your filters.
                </CardDescription>
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
                <CardTitle className="text-xl">No New Applications</CardTitle>
                <CardDescription>
                  There are no new applications that need your review.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reviewing">
          {reviewingApplications.length > 0 ? (
            reviewingApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Applications Under Review</CardTitle>
                <CardDescription>
                  You don't have any applications currently marked as under review.
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
                <CardTitle className="text-xl">No Shortlisted Candidates</CardTitle>
                <CardDescription>
                  You haven't shortlisted any candidates yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="final">
          {finalApplications.length > 0 ? (
            finalApplications.map(renderApplicationCard)
          ) : (
            <Card>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-xl">No Finalized Applications</CardTitle>
                <CardDescription>
                  You haven't made any final decisions on applications yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyApplications;
