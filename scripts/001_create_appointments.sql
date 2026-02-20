-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON public.appointments;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.appointments;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.appointments;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.appointments;

-- Allow anyone to insert (public booking)
CREATE POLICY "Allow public insert" ON public.appointments
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view appointments
CREATE POLICY "Allow authenticated select" ON public.appointments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only authenticated users (admins) can update appointments
CREATE POLICY "Allow authenticated update" ON public.appointments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Only authenticated users (admins) can delete appointments
CREATE POLICY "Allow authenticated delete" ON public.appointments
  FOR DELETE USING (auth.uid() IS NOT NULL);
