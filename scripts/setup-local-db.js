// Simple local database setup script
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = './dev.db';
const migrationsDir = './src/db/migrations';

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database');
}

// Create new database
const db = new Database(dbPath);
console.log('📊 Created new local database');

// Read and execute all migrations in order
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Ensure proper order

for (const migrationFile of migrationFiles) {
  const migrationPath = path.join(migrationsDir, migrationFile);
  const migration = fs.readFileSync(migrationPath, 'utf8');
  db.exec(migration);
  console.log(`🚀 Applied migration: ${migrationFile}`);
}

// Insert sample data for testing
const sampleData = `
INSERT INTO users (id, email, name, created_at, updated_at) VALUES
(1, 'dev@example.com', 'Dev User', datetime('now'), datetime('now'));

INSERT INTO user_preferences (id, user_id, preferred_method, default_time_block, created_at, updated_at) VALUES
(1, 1, 'hybrid', 'all', datetime('now'), datetime('now'));

INSERT INTO tasks (id, user_id, name, notes, impact, confidence, ease, type, time_block, estimated_time, decision, status, actual_time, is_in_focus, focus_started_at, created_at, updated_at, completed_at) VALUES
(1, 1, '🚀 Launch Revolutionary AI Startup That Changes The World', 'Build an AI company that disrupts every industry and makes me a billionaire. Start with MVP, get funding, scale globally, IPO within 3 years. Simple, right?', 10, 3, 2, 'revenue', 'deep', 2000, 'do', 'active', 120, 0, NULL, datetime('now'), datetime('now'), NULL),
(2, 1, '🎯 Master 47 Programming Languages in One Weekend', 'Become a polyglot programmer by learning Python, JavaScript, Rust, Go, C++, Haskell, and 41 other languages. Sleep is for the weak!', 8, 2, 1, 'growth', 'deep', 4320, 'delay', 'active', 0, 0, NULL, datetime('now'), datetime('now'), NULL),
(3, 1, '💰 Create Viral TikTok That Makes Me Instantly Famous', 'Film the most epic TikTok video ever that gets 100M views overnight. Dance moves + cat + explosion + trending song = viral gold mine', 6, 7, 9, 'revenue', 'quick', 15, 'do', 'completed', 22, 0, NULL, datetime('now'), datetime('now'), datetime('now', '-1 day')),
(4, 1, '🏠 Buy 12 Houses With Cryptocurrency I Don''t Have', 'Invest my imaginary Bitcoin fortune into real estate empire. Step 1: Get Bitcoin. Step 2: ??? Step 3: Property mogul!', 9, 1, 1, 'strategic', 'systematic', 480, 'delete', 'archived', 0, 0, NULL, datetime('now'), datetime('now'), NULL),
(5, 1, '🧠 Read Every Book Ever Written By Thursday', 'Consume all human knowledge by speed-reading 130 million books. Start with phone book, work up to Encyclopedia Britannica.', 7, 2, 1, 'growth', 'deep', 8760, 'delegate', 'active', 45, 0, NULL, datetime('now'), datetime('now'), NULL),
(6, 1, '⚡ Become Professional Procrastinator and Get Paid', 'Turn my natural talent for procrastination into a lucrative career. Teach masterclasses on "Advanced Deadline Avoidance"', 5, 9, 10, 'revenue', 'collaborative', 45, 'do', 'completed', 52, 0, NULL, datetime('now'), datetime('now'), datetime('now', '-2 hours')),
(7, 1, '🌍 Solve Climate Change During Lunch Break', 'Invent revolutionary green technology that saves the planet, get Nobel Prize, all before 2 PM. Sandwich optional.', 10, 1, 1, 'strategic', 'systematic', 120, 'delay', 'active', 0, 0, NULL, datetime('now'), datetime('now'), NULL),
(8, 1, '🎮 Beat Dark Souls Using Only a Banana', 'Ultimate gaming challenge: complete entire Dark Souls trilogy using only a banana as controller. Stream for charity.', 3, 8, 4, 'personal', 'deep', 200, 'do', 'active', 85, 0, NULL, datetime('now'), datetime('now'), NULL),
(9, 1, '🍕 Invent Pizza That Eats Itself', 'Create the world''s first self-consuming pizza. Perfect for diet-conscious food lovers who want to eat without eating.', 4, 2, 3, 'operations', 'quick', 60, 'delete', 'archived', 0, 0, NULL, datetime('now'), datetime('now'), NULL),
(10, 1, '🏆 Win Nobel Prize for Excellence in Meme Creation', 'Establish memes as a legitimate art form worthy of international recognition. My portfolio includes 5000+ original cat memes.', 6, 6, 8, 'personal', 'collaborative', 90, 'do', 'completed', 95, 0, NULL, datetime('now'), datetime('now'), datetime('now', '-3 days'));
`;

db.exec(sampleData);
console.log('📝 Inserted sample data');

db.close();
console.log('✅ Local database setup complete!');