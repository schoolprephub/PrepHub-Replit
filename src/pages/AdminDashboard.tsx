import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  LogOut, 
  FolderPlus, 
  Users, 
  Settings,
  Folder,
  FolderOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateFolderDialog } from "@/components/admin/CreateFolderDialog";
import { CreateSubfolderDialog } from "@/components/admin/CreateSubfolderDialog";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { FolderTree } from "@/components/admin/FolderTree";

interface Folder {
  id: string;
  name: string;
  mobile_number: string;
  address: string;
  created_at: string;
  subfolders?: Subfolder[];
}

interface Subfolder {
  id: string;
  name: string;
  folder_id: string;
  created_at: string;
  users?: FolderUser[];
}

interface FolderUser {
  id: string;
  full_name: string;
  school_name: string;
  age: number;
  class: string;
  mobile_number: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { adminUser, logout } = useAdmin();
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateSubfolder, setShowCreateSubfolder] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [selectedSubfolder, setSelectedSubfolder] = useState<string>("");

  // Redirect if not logged in as admin
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const { data: foldersData, error } = await supabase
        .from('folders')
        .select(`
          *,
          subfolders(
            *,
            folder_users(*)
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch folders",
          variant: "destructive",
        });
        return;
      }

      setFolders(foldersData || []);
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to fetch folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out from admin panel",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {adminUser.full_name}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen border-r border-gray-200 p-6">
          <nav className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Management</h3>
              <Button
                onClick={() => setShowCreateFolder(true)}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
              <Button
                onClick={() => setShowCreateSubfolder(true)}
                variant="outline"
                className="w-full justify-start"
                disabled={folders.length === 0}
              >
                <Folder className="w-4 h-4 mr-2" />
                Add Subfolder
              </Button>
              <Button
                onClick={() => setShowCreateUser(true)}
                variant="outline"
                className="w-full justify-start"
                disabled={folders.every(f => !f.subfolders || f.subfolders.length === 0)}
              >
                <Users className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Folder Structure</h2>
            <p className="text-gray-600">Manage your folders, subfolders, and user accounts</p>
          </div>

          {folders.length === 0 ? (
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>No Folders Yet</CardTitle>
                <CardDescription>
                  Create your first folder to start organizing user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowCreateFolder(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create First Folder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <FolderTree 
              folders={folders} 
              onRefresh={fetchFolders}
              onAddSubfolder={(folderId) => {
                setSelectedFolder(folderId);
                setShowCreateSubfolder(true);
              }}
              onAddUser={(subfolderId) => {
                setSelectedSubfolder(subfolderId);
                setShowCreateUser(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Dialogs */}
      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onSuccess={fetchFolders}
        adminId={adminUser.id}
      />

      <CreateSubfolderDialog
        open={showCreateSubfolder}
        onOpenChange={setShowCreateSubfolder}
        onSuccess={fetchFolders}
        adminId={adminUser.id}
        folders={folders}
        selectedFolderId={selectedFolder}
      />

      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
        onSuccess={fetchFolders}
        adminId={adminUser.id}
        folders={folders}
        selectedSubfolderId={selectedSubfolder}
      />
    </div>
  );
};

export default AdminDashboard;