-- Enable pgvector extension for AI scheme embedding storage and semantic similarity matching
CREATE EXTENSION IF NOT EXISTS vector;

-- Ensure UUID generation functions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemes table foundation
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    ministry_or_org VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_demographics TEXT[] NOT NULL DEFAULT '{}',
    eligible_business_types TEXT[] NOT NULL DEFAULT '{}',
    max_funding_amount NUMERIC(15, 2),
    subsidy_percentage NUMERIC(5, 2),
    application_url TEXT,
    eligibility_criteria JSONB DEFAULT '{}'::jsonb,
    embedding vector(1536), -- Supports OpenAI / standard LLM embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users / Entrepreneurs Profile foundation
CREATE TABLE IF NOT EXISTS entrepreneur_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    gender VARCHAR(50),
    social_category VARCHAR(100), -- SC, ST, OBC, General, Minority
    is_differently_abled BOOLEAN DEFAULT FALSE,
    business_name VARCHAR(255),
    business_type VARCHAR(100), -- Manufacturing, Service, Trading, Artisan
    annual_turnover NUMERIC(15, 2) DEFAULT 0.00,
    state VARCHAR(100),
    district VARCHAR(100),
    is_udyam_registered BOOLEAN DEFAULT FALSE,
    profile_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search using IVFFlat or HNSW (HNSW is supported in pgvector 0.5+)
CREATE INDEX IF NOT EXISTS schemes_embedding_hnsw_idx 
ON schemes USING hnsw (embedding vector_cosine_ops);
