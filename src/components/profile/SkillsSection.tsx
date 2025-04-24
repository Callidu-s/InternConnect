
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
}

const SkillsSection = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);

  // Initialize skills from user data or parse from skills string
  useEffect(() => {
    if (user) {
      if (user.skillsList && Array.isArray(user.skillsList)) {
        setSkills(user.skillsList);
      } else if (user.skills) {
        // Parse comma-separated skills string into skill objects
        const parsedSkills = user.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill !== '')
          .map(skill => ({
            id: Math.random().toString(36).substring(2, 9),
            name: skill
          }));
        
        setSkills(parsedSkills);
        
        // Update user profile with structured skills array
        if (updateUserProfile && parsedSkills.length > 0) {
          updateUserProfile({ skillsList: parsedSkills });
        }
      }
    }
  }, [user, updateUserProfile]);

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    const skillExists = skills.some(
      skill => skill.name.toLowerCase() === newSkill.toLowerCase()
    );
    
    if (skillExists) {
      toast({
        title: "Skill already exists",
        description: "This skill is already in your profile.",
        variant: "destructive"
      });
      return;
    }
    
    const skill = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSkill.trim()
    };
    
    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    setNewSkill('');
    
    // Update both skillsList (structured) and skills (legacy string format)
    if (updateUserProfile) {
      updateUserProfile({
        skillsList: updatedSkills,
        skills: updatedSkills.map(s => s.name).join(', ')
      });
    }
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    
    // Update both skillsList (structured) and skills (legacy string format)
    if (updateUserProfile) {
      updateUserProfile({
        skillsList: updatedSkills,
        skills: updatedSkills.map(s => s.name).join(', ')
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Skills</h3>
      
      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Add a skill (e.g. React, Python, Project Management)"
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          onClick={handleAddSkill}
          className="bg-intern-medium hover:bg-intern-dark"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {skills.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No skills added yet. Add skills to highlight your expertise.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <div 
              key={skill.id} 
              className="bg-intern-light text-intern-dark px-3 py-1 rounded-full flex items-center"
            >
              <span>{skill.name}</span>
              <button 
                onClick={() => handleRemoveSkill(skill.id)}
                className="ml-2 text-intern-dark hover:text-intern-dark/80 focus:outline-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {skill.name}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
