-- Add new columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add school column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'school') THEN
        ALTER TABLE profiles ADD COLUMN school TEXT;
    END IF;

    -- Add class column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'class') THEN
        ALTER TABLE profiles ADD COLUMN class TEXT;
    END IF;
END $$;

-- Update existing profiles with empty values for new columns
UPDATE profiles
SET school = COALESCE(school, ''),
    class = COALESCE(class, '')
WHERE school IS NULL OR class IS NULL; 