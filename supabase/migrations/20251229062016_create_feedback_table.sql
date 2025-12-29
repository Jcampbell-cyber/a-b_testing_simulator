/*
  # Create Feedback Table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key) - Unique identifier for each feedback entry
      - `name` (text, optional) - User's name (optional for anonymity)
      - `email` (text, optional) - User's email (optional for anonymity)
      - `message` (text, required) - Feedback message content
      - `created_at` (timestamptz) - Timestamp of submission
  
  2. Security
    - Enable RLS on `feedback` table
    - Add policy allowing anyone to insert feedback (public form)
    - No read access for anonymous users (only admin can read)
  
  3. Notes
    - Name and email are optional to support anonymous feedback
    - All submissions are stored for review
    - Users cannot read other users' feedback
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No public read access to feedback"
  ON feedback
  FOR SELECT
  TO anon
  USING (false);