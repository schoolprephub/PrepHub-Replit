-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user_data table for tracking study progress
CREATE TABLE public.user_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_study_time INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  subjects_completed INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  daily_goal INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user_data
CREATE POLICY "Users can view their own data" 
ON public.user_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" 
ON public.user_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" 
ON public.user_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create attendance table for daily tracking
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  study_time INTEGER NOT NULL DEFAULT 0,
  subjects_studied TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance
CREATE POLICY "Users can view their own attendance" 
ON public.attendance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance" 
ON public.attendance 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance" 
ON public.attendance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance" 
ON public.attendance 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  
  INSERT INTO public.user_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile and user_data when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();