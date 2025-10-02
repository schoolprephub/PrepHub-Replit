import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  FolderOpen, 
  Users, 
  Plus,
  ChevronDown,
  ChevronRight,
  Phone,
  MapPin,
  School,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface FolderUser {
  id: string;
  full_name: string;
  school_name: string;
  age: number;
  class: string;
  mobile_number: string;
  created_at: string;
}

interface Subfolder {
  id: string;
  name: string;
  folder_id: string;
  created_at: string;
  folder_users?: FolderUser[];
}

interface Folder {
  id: string;
  name: string;
  mobile_number: string;
  address: string;
  created_at: string;
  subfolders?: Subfolder[];
}

interface FolderTreeProps {
  folders: Folder[];
  onRefresh: () => void;
  onAddSubfolder: (folderId: string) => void;
  onAddUser: (subfolderId: string) => void;
}

export const FolderTree = ({ folders, onAddSubfolder, onAddUser }: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [expandedSubfolders, setExpandedSubfolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleSubfolder = (subfolderId: string) => {
    const newExpanded = new Set(expandedSubfolders);
    if (newExpanded.has(subfolderId)) {
      newExpanded.delete(subfolderId);
    } else {
      newExpanded.add(subfolderId);
    }
    setExpandedSubfolders(newExpanded);
  };

  return (
    <div className="space-y-4">
      {folders.map((folder) => {
        const isExpanded = expandedFolders.has(folder.id);
        
        return (
          <Card key={folder.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFolder(folder.id)}
                    className="p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <FolderOpen className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Folder className="w-5 h-5 text-blue-600" />
                    )}
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {folder.subfolders?.length || 0} subfolders
                  </Badge>
                </div>
                <Button
                  onClick={() => onAddSubfolder(folder.id)}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subfolder
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 ml-8">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{folder.mobile_number}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{folder.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {format(new Date(folder.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                {folder.subfolders && folder.subfolders.length > 0 ? (
                  <div className="space-y-3 ml-6 border-l-2 border-gray-100 pl-4">
                    {folder.subfolders.map((subfolder) => {
                      const isSubfolderExpanded = expandedSubfolders.has(subfolder.id);
                      const userCount = subfolder.folder_users?.length || 0;
                      
                      return (
                        <Card key={subfolder.id} className="bg-gray-50">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSubfolder(subfolder.id)}
                                  className="p-1"
                                >
                                  {isSubfolderExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </Button>
                                <Folder className="w-4 h-4 text-orange-600" />
                                <span className="font-medium">{subfolder.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  {userCount} users
                                </Badge>
                              </div>
                              <Button
                                onClick={() => onAddUser(subfolder.id)}
                                size="sm"
                                variant="outline"
                                className="border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add User
                              </Button>
                            </div>
                          </CardHeader>

                          {isSubfolderExpanded && subfolder.folder_users && (
                            <CardContent className="pt-0">
                              {subfolder.folder_users.length > 0 ? (
                                <div className="space-y-2">
                                  {subfolder.folder_users.map((user) => (
                                    <div 
                                      key={user.id} 
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                          <Users className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm">{user.full_name}</p>
                                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                                            <span className="flex items-center space-x-1">
                                              <School className="w-3 h-3" />
                                              <span>{user.school_name}</span>
                                            </span>
                                            <span>{user.class} • Age {user.age}</span>
                                            <span className="flex items-center space-x-1">
                                              <Phone className="w-3 h-3" />
                                              <span>{user.mobile_number}</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        {format(new Date(user.created_at), 'MMM dd')}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  No users in this subfolder yet
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Folder className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No subfolders created yet</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};