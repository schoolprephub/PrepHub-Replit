-- Create daily_attendance table for tracking daily attendance marks
CREATE TABLE IF NOT EXISTS public.daily_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS daily_attendance_user_id_idx ON public.daily_attendance(user_id);
CREATE INDEX IF NOT EXISTS daily_attendance_date_idx ON public.daily_attendance(date);
CREATE INDEX IF NOT EXISTS daily_attendance_user_date_idx ON public.daily_attendance(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.daily_attendance ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own attendance
CREATE POLICY "Users can view their own attendance"
ON public.daily_attendance
FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Create policy to allow users to insert their own attendance
CREATE POLICY "Users can insert their own attendance"
ON public.daily_attendance
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Create policy to allow users to update their own attendance
CREATE POLICY "Users can update their own attendance"
ON public.daily_attendance
FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- Add comment to table
COMMENT ON TABLE public.daily_attendance IS 'Tracks daily attendance marks for users';
