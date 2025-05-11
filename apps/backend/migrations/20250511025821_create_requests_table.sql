-- Add migration script here
-- Inside the migration file, add the following SQL to create the requests table:

CREATE TABLE requests (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,  -- For example, GET, POST, PUT, DELETE
    headers JSONB NOT NULL,  -- JSON object for headers
    body JSONB,  -- JSON object for the body
    params JSONB,  -- JSON object for query parameters
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,  -- Foreign key to collections table
    user_id UUID NOT NULL,  -- Assuming this refers to a user in your users table
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Created timestamp
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Updated timestamp
);

-- Optional: Create indexes on frequently queried columns (like user_id or collection_id)
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_collection_id ON requests(collection_id);
