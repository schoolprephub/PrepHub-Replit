-- Create enhanced profiles table for user data tracking
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile_number TEXT NOT NULL,
  school_name TEXT NOT NULL,
  class TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  day_streak INTEGER DEFAULT 0,
  todays_time INTEGER DEFAULT 0,
  progress JSONB DEFAULT '{}',
  xp_points INTEGER DEFAULT 0,
  daily_attendance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the existing handle_new_user function to work with new profiles structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Insert into profiles with data from user metadata
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    mobile_number, 
    school_name, 
    class, 
    city, 
    state, 
    country
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'mobile_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'school_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'class', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'city', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'state', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'country', '')
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();