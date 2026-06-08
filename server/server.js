require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3680', 10);
const API_KEY = process.env.API_KEY;
const DATA_DIR = process.env.DATA_DIR
  || path.join(__dirname, 'data');
const STATIC_DIR = process.env.STATIC_DIR
  || path.resolve(__dirname, '..');

const BOTS = {
  'og-task-bot': {
    file: path.join(DATA_DIR, 'og-task-bot.json'),
    required: ['total_replies', 'total_likes', 'total_claims']
  },
  'tiktok-task-bot': {
    file: path.join(DATA_DIR, 'tiktok-task-bot.json'),
    required: ['total_flames']
  }
};

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

async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({}, null, 2));
  }
}

async function readFile(filePath) {
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Corrupted ${filePath}, resetting:`, err.message);
    await fs.writeFile(filePath, JSON.stringify({}, null, 2));
    return {};
  }
}

async function writeFile(filePath, data) {
  const tmp = filePath + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, filePath);
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

function sanitizeBody(body) {
  const result = {};
  const allowedTypes = ['number', 'string', 'boolean'];
  for (const [key, val] of Object.entries(body)) {
    if (key === 'bot_id') continue;
    if (allowedTypes.includes(typeof val) || val === null) {
      if (typeof val === 'number') {
        result[key] = isFinite(val) ? val : null;
      } else {
        result[key] = val;
      }
    }
  }
  result.updated_at = new Date().toISOString();
  return result;
}

function validateRequired(body, requiredFields) {
  for (const field of requiredFields) {
    if (typeof body[field] !== 'number') return field;
  }
  return null;
}

function makeBotRoutes(slug, config) {
  const base = `/api/stats/${slug}`;

  app.post(base, requireApiKey, async (req, res) => {
    try {
      const body = req.body || {};
      if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Empty body' });
      }
      const missing = validateRequired(body, config.required);
      if (missing) {
        return res
          .status(400)
          .json({ error: `${missing} is required and must be a number` });
      }
      const sanitized = sanitizeBody(body);
      await writeFile(config.file, sanitized);
      console.log(`  → ${slug} updated`);
      res.json({ ok: true, stats: sanitized });
    } catch (err) {
      console.error(`POST ${base} failed:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get(base, async (req, res) => {
    try {
      const stats = await readFile(config.file);
      res.setHeader('Cache-Control', 'no-cache');
      res.json(stats);
    } catch (err) {
      console.error(`GET ${base} failed:`, err);
      res.status(500).json({ error: 'Failed to read stats' });
    }
  });
}

for (const [slug, config] of Object.entries(BOTS)) {
  makeBotRoutes(slug, config);
}

app.get('/api/stats/health', (req, res) => {
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
  console.log(`  data dir:   ${DATA_DIR}`);
  console.log(`  static dir: ${STATIC_DIR}`);
  console.log(`  bots:       ${Object.keys(BOTS).join(', ')}`);
});
