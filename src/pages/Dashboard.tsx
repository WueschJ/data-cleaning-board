
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Eye, Edit, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Type definition for application
type Application = {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected' | 'review';
};

// Mock data for user applications with correct type
const initialApplications: Application[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'pending' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'pending' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'pending' },
  { id: 5, name: 'Dave Brown', email: 'dave@example.com', status: 'pending' },
  { id: 6, name: 'Emma Davis', email: 'emma@example.com', status: 'pending' },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filter, setFilter] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');

  // Handle changing application status
  const handleStatusChange = (id: number, newStatus: 'accepted' | 'rejected' | 'review') => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    
    // Notification based on the action
    const app = applications.find(app => app.id === id);
    if (app) {
      const message = {
        'accepted': `${app.name} has been accepted`,
        'rejected': `${app.name} has been rejected`,
        'review': `${app.name} has been marked for review`
      }[newStatus];
      
      toast({
        title: 'Status Updated',
        description: message,
        duration: 3000
      });
    }
  };

  // Start editing an application
  const startEditing = (application: Application) => {
    setEditingId(application.id);
    setEditName(application.name);
    setEditEmail(application.email);
  };

  // Save edited application
  const saveEditing = () => {
    if (!editingId) return;
    
    setApplications(applications.map(app => 
      app.id === editingId ? { ...app, name: editName, email: editEmail } : app
    ));
    
    toast({
      title: 'Contact Updated',
      description: 'Contact information has been updated successfully.',
      duration: 3000
    });
    
    setEditingId(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Handle the "Enrich all" action
  const handleEnrichAll = () => {
    toast({
      title: 'Enrichment Started',
      description: 'Enriching all accepted contacts...',
      duration: 3000
    });
    
    // This would typically trigger an API call or data processing
    setTimeout(() => {
      toast({
        title: 'Enrichment Complete',
        description: 'All accepted contacts have been enriched.',
        duration: 3000
      });
    }, 1500);
  };

  // Filter applications based on selected filter and search query
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch && app.status !== 'accepted' && app.status !== 'rejected';
  });
  
  // Get applications to be reviewed separately
  const applicationsForReview = applications.filter(app => app.status === 'review');
  const pendingApplications = filteredApplications.filter(app => app.status !== 'review');
  
  // Get accepted applications
  const acceptedApplications = applications.filter(app => app.status === 'accepted');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Cleaning</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingApplications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No applications found matching your criteria
                  </td>
                </tr>
              ) : (
                pendingApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === application.id ? (
                        <Input 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          className="w-full" 
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          {application.name}
                          <button onClick={() => startEditing(application)} className="text-gray-500 hover:text-blue-500">
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === application.id ? (
                        <Input 
                          value={editEmail} 
                          onChange={(e) => setEditEmail(e.target.value)} 
                          className="w-full" 
                        />
                      ) : (
                        application.email
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`
                        ${application.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                        ${application.status === 'review' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {editingId === application.id ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 shadow-sm"
                            onClick={saveEditing}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 shadow-sm"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 shadow-sm flex items-center gap-1"
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                          >
                            <Check className="h-4 w-4" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 shadow-sm flex items-center gap-1"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                          >
                            <X className="h-4 w-4" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 shadow-sm flex items-center gap-1"
                            onClick={() => handleStatusChange(application.id, 'review')}
                          >
                            <Eye className="h-4 w-4" /> Review
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Applications marked for review section */}
      {applicationsForReview.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Applications To Be Reviewed</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicationsForReview.map((application) => (
                    <tr key={application.id} className="hover:bg-yellow-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === application.id ? (
                          <Input 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="w-full" 
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {application.name}
                            <button onClick={() => startEditing(application)} className="text-gray-500 hover:text-blue-500">
                              <Edit size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === application.id ? (
                          <Input 
                            value={editEmail} 
                            onChange={(e) => setEditEmail(e.target.value)} 
                            className="w-full" 
                          />
                        ) : (
                          application.email
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        {editingId === application.id ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 shadow-sm"
                              onClick={saveEditing}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 shadow-sm"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 shadow-sm flex items-center gap-1"
                              onClick={() => handleStatusChange(application.id, 'accepted')}
                            >
                              <Check className="h-4 w-4" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 shadow-sm flex items-center gap-1"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                            >
                              <X className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Accepted Contacts Section */}
      {acceptedApplications.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Accepted Contacts</h2>
            <Button 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 shadow-sm flex items-center gap-1"
              onClick={handleEnrichAll}
            >
              <RefreshCw className="h-4 w-4" /> Enrich all
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {acceptedApplications.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                        No accepted contacts yet
                      </td>
                    </tr>
                  ) : (
                    acceptedApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-green-50">
                        <td className="px-6 py-4 whitespace-nowrap">{application.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{application.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
