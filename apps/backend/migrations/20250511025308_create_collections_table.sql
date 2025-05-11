-- Add migration script here
-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY,                   -- Unique ID for the collection
    name VARCHAR(255) NOT NULL,             -- Name of the collection
    description TEXT,                       -- Description of the collection (optional)
    user_id UUID NOT NULL,                  -- User ID associated with the collection
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Created timestamp
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Updated timestamp
);

-- Add foreign key constraint for user_id
ALTER TABLE collections
ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;                    -- If user is deleted, collections are also deleted
