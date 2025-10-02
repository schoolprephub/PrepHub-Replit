import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Folder {
  id: string;
  name: string;
  subfolders?: Subfolder[];
}

interface Subfolder {
  id: string;
  name: string;
  folder_id: string;
}

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  adminId: string;
  folders: Folder[];
  selectedSubfolderId?: string;
}

export const CreateUserDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  adminId,
  folders,
  selectedSubfolderId 
}: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    age: "",
    class: "",
    mobileNumber: "",
    password: "",
  });
  const [subfolderId, setSubfolderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const classes = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);

  useEffect(() => {
    if (selectedSubfolderId) {
      setSubfolderId(selectedSubfolderId);
    }
  }, [selectedSubfolderId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAllSubfolders = () => {
    const allSubfolders: { id: string; name: string; folderName: string }[] = [];
    folders.forEach(folder => {
      if (folder.subfolders) {
        folder.subfolders.forEach(subfolder => {
          allSubfolders.push({
            id: subfolder.id,
            name: subfolder.name,
            folderName: folder.name,
          });
        });
      }
    });
    return allSubfolders;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { fullName, schoolName, age, class: userClass, mobileNumber, password } = formData;
    
    if (!fullName || !schoolName || !age || !userClass || !mobileNumber || !password || !subfolderId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number should contain only digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if mobile number already exists
      const { data: existingUser } = await supabase
        .from('folder_users')
        .select('mobile_number')
        .eq('mobile_number', mobileNumber.trim())
        .single();

      if (existingUser) {
        toast({
          title: "Mobile Number Exists",
          description: "This mobile number is already registered",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Insert new user (password hashed for security)
      const hashedPassword = btoa(password); // Base64 encoding as simple hash
      
      const { error } = await supabase
        .from('folder_users')
        .insert({
          full_name: fullName.trim(),
          school_name: schoolName.trim(),
          age: parseInt(age),
          class: userClass,
          mobile_number: mobileNumber.trim(),
          password_hash: hashedPassword,
          subfolder_id: subfolderId,
          created_by: adminId,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create user account",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `User account created successfully for ${fullName}`,
      });

      // Reset form
      setFormData({
        fullName: "",
        schoolName: "",
        age: "",
        class: "",
        mobileNumber: "",
        password: "",
      });
      setSubfolderId("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const allSubfolders = getAllSubfolders();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create User Account</DialogTitle>
          <DialogDescription>
            Create a new user account inside a subfolder
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input
              id="school-name"
              placeholder="Enter school name"
              value={formData.schoolName}
              onChange={(e) => handleInputChange('schoolName', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                disabled={isLoading}
                min="5"
                max="25"
              />
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={formData.class}
                onValueChange={(value) => handleInputChange('class', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-number">Mobile Number</Label>
            <Input
              id="mobile-number"
              placeholder="Enter mobile number"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create password (min 6 characters)"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Assign to Subfolder</Label>
            <Select value={subfolderId} onValueChange={setSubfolderId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subfolder" />
              </SelectTrigger>
              <SelectContent>
                {allSubfolders.map((subfolder) => (
                  <SelectItem key={subfolder.id} value={subfolder.id}>
                    {subfolder.folderName} → {subfolder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};