
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import CompanyRegister from "./pages/CompanyRegister";
import StudentProfileCreation from "./pages/StudentProfileCreation";
import CompanyProfileCreation from "./pages/CompanyProfileCreation";
import InternshipList from "./pages/InternshipList";
import InternshipDetail from "./pages/InternshipDetail";
import EditInternship from "./pages/EditInternship";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostInternship from "./pages/PostInternship";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import EditProfile from "./pages/EditProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { InternshipProvider } from "./contexts/InternshipContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentApplications from "./pages/StudentApplications";
import ApplyInternship from "./pages/ApplyInternship";
import CompanyApplications from "./pages/CompanyApplications";
import ApplicationDetail from "./pages/ApplicationDetail";
import StudentProfile from "./pages/StudentProfile";
import CompanyProfile from "./pages/CompanyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InternshipProvider>
        <ApplicationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/student-register" element={<StudentRegister />} />
                  <Route path="/company-register" element={<CompanyRegister />} />
                  <Route path="/internships" element={<InternshipList />} />
                  <Route path="/internships/:id" element={<InternshipDetail />} />
                  <Route path="/company/:id" element={<CompanyProfile />} />
                  
                  {/* Profile creation routes */}
                  <Route path="/student-profile-creation" element={<StudentProfileCreation />} />
                  <Route path="/company-profile-creation" element={<CompanyProfileCreation />} />
                  
                  {/* Protected student routes */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student-portal" element={<StudentDashboard />} />
                    <Route path="/student-profile" element={<StudentProfile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/internships/:id/apply" element={<ApplyInternship />} />
                    <Route path="/student-applications" element={<StudentApplications />} />
                    <Route path="/applications/:id" element={<ApplicationDetail />} />
                  </Route>
                  
                  {/* Protected company routes */}
                  <Route element={<ProtectedRoute allowedRoles={['company']} />}>
                    <Route path="/company-dashboard" element={<CompanyDashboard />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/post-internship" element={<PostInternship />} />
                    <Route path="/edit-internship/:id" element={<EditInternship />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/company-applications" element={<CompanyApplications />} />
                    <Route path="/internships/:id/applications" element={<CompanyApplications />} />
                    <Route path="/applications/:id/review" element={<ApplicationDetail />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ApplicationProvider>
      </InternshipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
