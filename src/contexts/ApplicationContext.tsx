
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Application } from '../types/application';
import { useAuth } from './AuthContext';

type ApplicationContextProps = {
  applications: Application[];
  loading: boolean;
  applyToInternship: (application: Omit<Application, 'id' | 'status' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: number, status: Application['status'], notes?: string) => void;
  getApplicationById: (id: number) => Application | undefined;
  getApplicationsByInternshipId: (internshipId: number) => Application[];
  getApplicationsByStudentId: (studentId: string) => Application[];
  deleteApplication: (id: number) => boolean;
};

const ApplicationContext = createContext<ApplicationContextProps | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load applications from localStorage
    const storedApplications = localStorage.getItem('applications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
    
    // Set loading to false once data is loaded
    setLoading(false);
    
    // Listen for application changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'applications' && e.newValue) {
        setApplications(JSON.parse(e.newValue));
      }
    };
    
    // Listen for custom events
    const handleCustomEvent = () => {
      const updatedApplications = localStorage.getItem('applications');
      if (updatedApplications) {
        setApplications(JSON.parse(updatedApplications));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('applicationsChanged', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('applicationsChanged', handleCustomEvent);
    };
  }, []);

  const getApplicationById = (id: number) => {
    return applications.find(application => application.id === id);
  };

  const getApplicationsByInternshipId = (internshipId: number) => {
    return applications.filter(application => application.internshipId === internshipId);
  };

  const getApplicationsByStudentId = (studentId: string) => {
    return applications.filter(application => application.studentId === studentId);
  };

  const generateShortId = (): number => {
    // Generate a number between 10000 and 99999 (5 digits)
    const min = 10000;
    const max = 99999;
    const proposedId = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Check if this ID already exists
    if (applications.some(app => app.id === proposedId)) {
      // If ID exists, try again recursively (rare case)
      return generateShortId();
    }
    
    return proposedId;
  };

  const applyToInternship = (application: Omit<Application, 'id' | 'status' | 'appliedDate'>) => {
    const newId = generateShortId();
      
    const newApplication: Application = {
      ...application,
      id: newId,
      status: 'pending',
      appliedDate: new Date().toISOString(),
    };
    
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('applicationsChanged'));
  };
  
  const updateApplicationStatus = (id: number, status: Application['status'], notes?: string) => {
    const updatedApplications = applications.map(application => 
      application.id === id 
        ? { ...application, status, ...(notes ? { notes } : {}) }
        : application
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('applicationsChanged'));
  };

  const deleteApplication = (id: number) => {
    try {
      const updatedApplications = applications.filter(application => application.id !== id);
      setApplications(updatedApplications);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
      
      // Trigger custom event for other components
      window.dispatchEvent(new Event('applicationsChanged'));
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      return false;
    }
  };
  
  return (
    <ApplicationContext.Provider value={{
      applications,
      loading,
      applyToInternship,
      updateApplicationStatus,
      getApplicationById,
      getApplicationsByInternshipId,
      getApplicationsByStudentId,
      deleteApplication,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
