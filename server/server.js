require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3680', 10);
const API_KEY = process.env.API_KEY;
const STATS_FILE = process.env.STATS_FILE
  || path.join(__dirname, 'data', 'stats.json');
const STATIC_DIR = process.env.STATIC_DIR
  || path.resolve(__dirname, '..');

const app = express();

app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

async function ensureStatsFile() {
  try {
    await fs.access(STATS_FILE);
  } catch {
    await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
    const initial = {
      total_replies: 0,
      total_likes: 0,
      total_claims: 0,
      last_action: null,
      last_action_at: null,
      started_at: null,
      updated_at: null
    };
    await fs.writeFile(STATS_FILE, JSON.stringify(initial, null, 2));
  }
}

async function readStats() {
  await ensureStatsFile();
  const raw = await fs.readFile(STATS_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Corrupted stats.json, resetting:', err.message);
    const fresh = {
      total_replies: 0,
      total_likes: 0,
      total_claims: 0,
      last_action: null,
      last_action_at: null,
      started_at: null,
      updated_at: null
    };
    await fs.writeFile(STATS_FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

async function writeStats(data) {
  const tmp = STATS_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, STATS_FILE);
}

function requireApiKey(req, res, next) {
  if (!API_KEY) {
    return res
      .status(500)
      .json({ error: 'API_KEY not configured on server' });
  }
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : '';
  if (!token || token !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.post('/api/stats/og-task-bot', requireApiKey, async (req, res) => {
  try {
    const {
      total_replies,
      total_likes,
      total_claims,
      last_action,
      last_action_at,
      started_at
    } = req.body || {};

    if (
      typeof total_replies !== 'number'
      || typeof total_likes !== 'number'
      || typeof total_claims !== 'number'
    ) {
      return res
        .status(400)
        .json({ error: 'total_replies, total_likes and total_claims must be numbers' });
    }

    const sanitized = {
      total_replies: Math.max(0, Math.trunc(total_replies)),
      total_likes: Math.max(0, Math.trunc(total_likes)),
      total_claims: Math.max(0, Math.trunc(total_claims)),
      last_action: typeof last_action === 'string' ? last_action : null,
      last_action_at: typeof last_action_at === 'string' ? last_action_at : null,
      started_at: typeof started_at === 'string' ? started_at : null,
      updated_at: new Date().toISOString()
    };

    await writeStats(sanitized);
    res.json({ ok: true, stats: sanitized });
  } catch (err) {
    console.error('POST /api/stats/og-task-bot failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats/og-task-bot', async (req, res) => {
  try {
    const stats = await readStats();
    res.setHeader('Cache-Control', 'no-cache');
    res.json(stats);
  } catch (err) {
    console.error('GET /api/stats/og-task-bot failed:', err);
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

app.get('/api/stats/og-task-bot/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use(express.static(STATIC_DIR, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

if (!API_KEY) {
  console.warn('WARNING: API_KEY env var is not set. POST endpoint will reject all requests.');
}

app.listen(PORT, () => {
  console.log(`enderr-stats-api listening on :${PORT}`);
  console.log(`  stats file: ${STATS_FILE}`);
  console.log(`  static dir: ${STATIC_DIR}`);
});
