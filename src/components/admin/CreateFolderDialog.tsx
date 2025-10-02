import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  adminId: string;
}

export const CreateFolderDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  adminId 
}: CreateFolderDialogProps) => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !mobileNumber || !address) {
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
        .from('folders')
        .insert({
          name: name.trim(),
          mobile_number: mobileNumber.trim(),
          address: address.trim(),
          created_by: adminId,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create folder",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Folder created successfully",
      });

      // Reset form
      setName("");
      setMobileNumber("");
      setAddress("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder",
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
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize user accounts
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-number">Mobile Number</Label>
            <Input
              id="mobile-number"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
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
                "Create Folder"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};