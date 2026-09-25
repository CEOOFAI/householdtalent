// Run pending migrations via Supabase service role key.
// Loads SQL files from supabase/migrations/ (009+) and executes them.
const fs = require('fs');
const path = require('path');

function readEnv() {
  const envContent = fs.readFileSync(
    path.join(__dirname, '..', '.env.local'),
    'utf8'
  );
  const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)"?/)[1]
    .replace(/\\n/g, '').trim();
  const key = envContent.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)"?/)[1]
    .replace(/\\n/g, '').trim();
  return { url, key };
}

async function runSQL(sql, url, key) {
  // Use the undocumented pg-meta endpoint via service role key
  const response = await fetch(`${url}/pg-meta/default/query`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await response.text();
  return { status: response.status, body: text };
}

async function main() {
  const { url, key } = readEnv();
  console.log('URL:', url);

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  // Only run migrations 008 and 009 (the new ones we added)
  const toRun = files.filter(f => /^(008|009)/.test(f));
  console.log('Migrations to run:', toRun);

  for (const file of toRun) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`\n--- Running ${file} ---`);
    const result = await runSQL(sql, url, key);
    console.log('Status:', result.status);
    console.log('Response:', result.body.slice(0, 500));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
