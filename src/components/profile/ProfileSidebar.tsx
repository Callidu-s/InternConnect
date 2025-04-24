
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, MapPin, Mail, GraduationCap, Edit } from 'lucide-react';

const ProfileSidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Get initials for avatar
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 bg-intern-light text-intern-dark mb-4">
          <AvatarFallback className="text-2xl font-medium">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-600">{user.major} Student</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-700">
          <Mail className="h-4 w-4 mr-2" />
          <p>{user.email}</p>
        </div>
        
        <div className="flex items-center text-gray-700">
          <GraduationCap className="h-4 w-4 mr-2" />
          <p>{user.university || 'Not specified'}</p>
        </div>
        
        <div className="flex items-center text-gray-700">
          <MapPin className="h-4 w-4 mr-2" />
          <p>{user.location || 'Not specified'}</p>
        </div>
        
        <div className="flex items-center text-gray-700">
          <User className="h-4 w-4 mr-2" />
          <p>Graduation: {user.graduationYear}</p>
        </div>
      </div>
      
      <Button asChild variant="outline" className="w-full">
        <Link to="/edit-profile" className="flex items-center justify-center">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </Button>
    </div>
  );
};

export default ProfileSidebar;
