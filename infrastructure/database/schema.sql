-- Database Schema for maTerre - VÉRIFIER Module

-- Table: Users (Accounts for Buyers, Notaries, and Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('BUYER', 'NOTARY', 'ADMIN')) DEFAULT 'BUYER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Properties (Land items being verified)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_number TEXT UNIQUE NOT NULL, -- Format example: "Vol 123 Fol 45"
    location_city TEXT,
    location_quarter TEXT,
    surface_area DECIMAL,
    current_owner_name TEXT,
    current_status TEXT CHECK (current_status IN ('GREEN', 'YELLOW', 'RED', 'UNKNOWN')) DEFAULT 'UNKNOWN',
    last_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: VerificationRequests (Individual orders for property checks)
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id),
    title_number TEXT NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('UNPAID', 'PAID')) DEFAULT 'UNPAID',
    request_status TEXT CHECK (request_status IN ('PENDING', 'ASSIGNED', 'IN_REVIEW', 'COMPLETED', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: VerificationReports (The output from the notary)
CREATE TABLE verification_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
    notary_id UUID REFERENCES users(id), -- The notary who performed the check
    historical_summary TEXT,
    pre_notations TEXT,
    disputes_litiges TEXT,
    liens_hypotheques TEXT,
    verdict TEXT CHECK (verdict IN ('GREEN', 'YELLOW', 'RED')),
    report_pdf_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast title lookups
CREATE INDEX idx_properties_title_number ON properties(title_number);
CREATE INDEX idx_requests_title_number ON verification_requests(title_number);
