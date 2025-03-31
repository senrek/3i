-- Create skills assessment responses table
CREATE TABLE IF NOT EXISTS skills_assessment_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE skills_assessment_responses ENABLE ROW LEVEL SECURITY;

-- Users can only insert their own responses
CREATE POLICY "Users can insert their own responses"
    ON skills_assessment_responses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only read their own responses
CREATE POLICY "Users can read their own responses"
    ON skills_assessment_responses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_skills_assessment_responses_updated_at
    BEFORE UPDATE ON skills_assessment_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 