
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Download, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  dateUploaded: string;
  url: string;
}

const DocumentsSection = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [documents, setDocuments] = useState<Document[]>(
    user?.documents || []
  );
  
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('resume'); // Default type
  const [fileSelected, setFileSelected] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
      // Auto-fill document name based on file name if empty
      if (!documentName) {
        const fileName = e.target.files[0].name;
        // Remove file extension
        setDocumentName(fileName.split('.').slice(0, -1).join('.'));
      }
    } else {
      setFileSelected(false);
    }
  };
  
  const handleAddDocument = () => {
    // In a real implementation, you would upload the file to storage
    // For this demo, we'll simulate adding a document
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: documentName,
      type: documentType,
      dateUploaded: new Date().toISOString(),
      url: '#', // In a real app, this would be the URL to the uploaded file
    };
    
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    
    if (updateUserProfile) {
      updateUserProfile({ documents: updatedDocuments });
      toast({
        title: "Document Added",
        description: "Your document has been uploaded successfully.",
      });
    }
    
    setDocumentName('');
    setDocumentType('resume');
    setFileSelected(false);
    setIsAddDialogOpen(false);
  };
  
  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    
    if (updateUserProfile) {
      updateUserProfile({ documents: updatedDocuments });
      toast({
        title: "Document Deleted",
        description: "Your document has been removed from your profile.",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'resume': return 'Resume';
      case 'cover': return 'Cover Letter';
      case 'transcript': return 'Transcript';
      case 'portfolio': return 'Portfolio';
      case 'other': return 'Other Document';
      default: return 'Document';
    }
  };

  const getDocumentButton = (doc: Document) => {
    // For simulation, both buttons are shown but in a real app,
    // "View" would open the document and "Replace" would let users upload a new version
    return (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">View</Button>
        <Button size="sm">Replace</Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Documents</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-intern-medium hover:bg-intern-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-name">Document Name</Label>
                  <Input 
                    id="document-name" 
                    value={documentName}
                    onChange={e => setDocumentName(e.target.value)}
                    placeholder="My Resume, Cover Letter, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <select 
                    id="document-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={documentType}
                    onChange={e => setDocumentType(e.target.value)}
                  >
                    <option value="resume">Resume</option>
                    <option value="cover">Cover Letter</option>
                    <option value="transcript">Transcript</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-file">Upload File</Label>
                  <Input 
                    id="document-file" 
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <p className="text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                onClick={handleAddDocument}
                disabled={!documentName || !fileSelected}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm mb-4">Your resumes and cover letters</p>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">No documents uploaded yet. Add your resume or other documents.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="flex justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-intern-dark mt-1" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {getDocumentLabel(doc.type)} • Uploaded {formatDate(doc.dateUploaded)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
