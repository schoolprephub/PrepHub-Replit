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
  mobile_number: string;
  address: string;
}

interface CreateSubfolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  adminId: string;
  folders: Folder[];
  selectedFolderId?: string;
}

export const CreateSubfolderDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  adminId,
  folders,
  selectedFolderId 
}: CreateSubfolderDialogProps) => {
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFolderId) {
      setFolderId(selectedFolderId);
    }
  }, [selectedFolderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !folderId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('subfolders')
        .insert({
          name: name.trim(),
          folder_id: folderId,
          created_by: adminId,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create subfolder",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Subfolder created successfully",
      });

      // Reset form
      setName("");
      setFolderId("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subfolder",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Subfolder</DialogTitle>
          <DialogDescription>
            Add a subfolder inside an existing folder
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subfolder-name">Subfolder Name</Label>
            <Input
              id="subfolder-name"
              placeholder="Enter subfolder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Parent Folder</Label>
            <Select value={folderId} onValueChange={setFolderId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Subfolder"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};