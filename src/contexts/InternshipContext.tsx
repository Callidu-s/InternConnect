
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Internship } from '../types/internship';

type InternshipContextProps = {
  internships: Internship[];
  loading: boolean;
  addInternship: (internship: Omit<Internship, 'id'>) => void;
  updateInternship: (id: number, internship: Partial<Internship>) => void;
  deleteInternship: (id: number) => boolean;
  removeInternship: (id: number) => boolean; // Alias for deleteInternship for backward compatibility
  getInternship: (id: number) => Internship | undefined;
  getInternshipById: (id: number) => Internship | undefined; // Alias for getInternship for backward compatibility
};

const InternshipContext = createContext<InternshipContextProps | undefined>(undefined);

export const InternshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load internships from localStorage
    const storedInternships = localStorage.getItem('internships');
    if (storedInternships) {
      setInternships(JSON.parse(storedInternships));
    }
    
    // Set loading to false once data is loaded
    setLoading(false);
    
    // Listen for internship changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'internships' && e.newValue) {
        setInternships(JSON.parse(e.newValue));
      }
    };
    
    // Listen for custom events
    const handleCustomEvent = () => {
      const updatedInternships = localStorage.getItem('internships');
      if (updatedInternships) {
        setInternships(JSON.parse(updatedInternships));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('internshipsChanged', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('internshipsChanged', handleCustomEvent);
    };
  }, []);

  const getInternship = (id: number) => {
    return internships.find(internship => internship.id === id);
  };
  
  // Create an alias for getInternship for backward compatibility
  const getInternshipById = getInternship;
  
  const addInternship = (internship: Omit<Internship, 'id'>) => {
    const newId = internships.length > 0 
      ? Math.max(...internships.map(i => i.id)) + 1 
      : 1;
      
    const newInternship = {
      ...internship,
      id: newId,
    } as Internship;
    
    const updatedInternships = [...internships, newInternship];
    setInternships(updatedInternships);
    localStorage.setItem('internships', JSON.stringify(updatedInternships));
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('internshipsChanged'));
  };
  
  const updateInternship = (id: number, internshipUpdates: Partial<Internship>) => {
    const updatedInternships = internships.map(internship => 
      internship.id === id 
        ? { ...internship, ...internshipUpdates }
        : internship
    );
    
    setInternships(updatedInternships);
    localStorage.setItem('internships', JSON.stringify(updatedInternships));
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('internshipsChanged'));
  };

  const deleteInternship = (id: number) => {
    try {
      const updatedInternships = internships.filter(internship => internship.id !== id);
      setInternships(updatedInternships);
      localStorage.setItem('internships', JSON.stringify(updatedInternships));
      
      // Trigger custom event for other components
      window.dispatchEvent(new Event('internshipsChanged'));
      return true;
    } catch (error) {
      console.error('Error deleting internship:', error);
      return false;
    }
  };
  
  // Create an alias for deleteInternship for backward compatibility
  const removeInternship = deleteInternship;
  
  return (
    <InternshipContext.Provider value={{
      internships,
      loading,
      addInternship,
      updateInternship,
      deleteInternship,
      removeInternship,
      getInternship,
      getInternshipById,
    }}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error('useInternships must be used within an InternshipProvider');
  }
  return context;
};
