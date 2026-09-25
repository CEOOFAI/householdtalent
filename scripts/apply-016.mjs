import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const envPath = path.join(__dirname, '..', '.env.local')
const env = fs.readFileSync(envPath, 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL="?([^"\n]+)"?/)[1].replace(/\\n/g, '').trim()
const accessToken = env.match(/SUPABASE_ACCESS_TOKEN="?([^"\n]+)"?/)[1].replace(/\\n/g, '').trim()

const ref = new URL(url).hostname.split('.')[0]

const sql = fs.readFileSync(
  path.join(__dirname, '..', 'supabase', 'migrations', '016_private_photos_bucket.sql'),
  'utf8',
)

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})
console.log('status', res.status)
console.log(await res.text())
