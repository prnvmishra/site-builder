-- Create User table
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  totalCreation INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  emailVerified BOOLEAN DEFAULT FALSE
);

-- Create WebsiteProject table
CREATE TABLE "WebsiteProject" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  initial_prompt TEXT NOT NULL,
  current_code TEXT,
  current_version_index TEXT DEFAULT '',
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  isPublished BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create other tables as needed...
CREATE TABLE "Conversation" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  projectId TEXT NOT NULL REFERENCES "WebsiteProject"(id) ON DELETE CASCADE
);

CREATE TABLE "Version" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  projectId TEXT NOT NULL REFERENCES "WebsiteProject"(id) ON DELETE CASCADE
);

CREATE TABLE "Transaction" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  isPaid BOOLEAN DEFAULT FALSE,
  planId TEXT NOT NULL,
  amount FLOAT NOT NULL,
  credits INTEGER NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_website_project_userId ON "WebsiteProject"(userId);
CREATE INDEX idx_conversation_projectId ON "Conversation"(projectId);
CREATE INDEX idx_version_projectId ON "Version"(projectId);
CREATE INDEX idx_transaction_userId ON "Transaction"(userId);
