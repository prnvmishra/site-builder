-- Create WebsiteProject table (if not exists)
CREATE TABLE IF NOT EXISTS "WebsiteProject" (
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

-- Create other tables if not exists
CREATE TABLE IF NOT EXISTS "Conversation" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  projectId TEXT NOT NULL REFERENCES "WebsiteProject"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Version" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  projectId TEXT NOT NULL REFERENCES "WebsiteProject"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Transaction" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  isPaid BOOLEAN DEFAULT FALSE,
  planId TEXT NOT NULL,
  amount FLOAT NOT NULL,
  credits INTEGER NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes if not exists
CREATE INDEX IF NOT EXISTS idx_website_project_userId ON "WebsiteProject"(userId);
CREATE INDEX IF NOT EXISTS idx_conversation_projectId ON "Conversation"(projectId);
CREATE INDEX IF NOT EXISTS idx_version_projectId ON "Version"(projectId);
CREATE INDEX IF NOT EXISTS idx_transaction_userId ON "Transaction"(userId);
