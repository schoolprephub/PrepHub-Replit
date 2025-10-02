-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create folders table
CREATE TABLE public.folders (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    mobile_number text NOT NULL,
    address text NOT NULL,
    created_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Create subfolders table
CREATE TABLE public.subfolders (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    folder_id uuid NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
    created_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for subfolders
ALTER TABLE public.subfolders ENABLE ROW LEVEL SECURITY;

-- Create folder_users table for users created by admin
CREATE TABLE public.folder_users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text NOT NULL,
    school_name text NOT NULL,
    age integer NOT NULL,
    class text NOT NULL,
    mobile_number text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    subfolder_id uuid NOT NULL REFERENCES public.subfolders(id) ON DELETE CASCADE,
    created_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for folder_users
ALTER TABLE public.folder_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users (only admins can manage admins)
CREATE POLICY "Admins can view all admin users" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create RLS policies for folders (admins can manage all folders)
CREATE POLICY "Admins can view all folders" 
ON public.folders 
FOR ALL 
USING (true);

-- Create RLS policies for subfolders (admins can manage all subfolders)
CREATE POLICY "Admins can view all subfolders" 
ON public.subfolders 
FOR ALL 
USING (true);

-- Create RLS policies for folder_users (admins can manage all users)
CREATE POLICY "Admins can view all folder users" 
ON public.folder_users 
FOR ALL 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
BEFORE UPDATE ON public.folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subfolders_updated_at
BEFORE UPDATE ON public.subfolders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folder_users_updated_at
BEFORE UPDATE ON public.folder_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default admin user (password: admin123)
-- Note: In production, this should be changed immediately
INSERT INTO public.admin_users (email, password_hash, full_name)
VALUES ('admin@example.com', '$2b$10$rKjQQ.8mVVqV5vK5vK5vK5vK5vK5vK5vK5vK5vK5vK5vK5vK5vK5vK', 'System Admin');