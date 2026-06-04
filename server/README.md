# enderr-stats-api

Express server that:

- Receives bot stats on `POST /api/stats/og-task-bot` (Bearer token auth)
- Serves them to the website on `GET /api/stats/og-task-bot` (public, no auth)
- Persists data in `data/stats.json` (atomic writes)
- Also serves the static site from the parent directory

## Endpoints

| Method | Path                                  | Auth         | Description                              |
| ------ | ------------------------------------- | ------------ | ---------------------------------------- |
| POST   | `/api/stats/og-task-bot`              | `Bearer API_KEY` | Upsert latest stats from the bot     |
| GET    | `/api/stats/og-task-bot`              | none         | Returns current stats (consumed by frontend) |
| GET    | `/api/stats/og-task-bot/health`       | none         | Liveness probe                           |

### POST body (sent by the bot)

```json
{
  "total_replies": 50,
  "total_likes": 55,
  "total_claims": 12,
  "last_action": "reply",
  "last_action_at": "2026-06-04T13:41:20Z",
  "started_at": "2026-01-01T00:00:00Z"
}
```

### Headers (bot side)

```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

## Setup

```bash
cd server
cp .env.example .env
# edit .env and set API_KEY (use a long random hex string)
npm install
npm start
```

By default the server listens on `:3000` and serves the static site + API on the same port.

## Reverse proxy example (nginx)

```nginx
server {
  listen 80;
  server_name enderr.win;

  location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    # OR serve the static dir directly with nginx and only proxy /api/
  }
}
```

## Updating the bot

On the bot side (`stats_tracker.py`), set these env vars:

```env
STATS_API_URL=http://enderr.win/api/stats/og-task-bot
STATS_API_KEY=<same value as server API_KEY>
```

And make sure the POST request includes:

```python
headers = {
    "Authorization": f"Bearer {os.environ['STATS_API_KEY']}",
    "Content-Type": "application/json",
}
requests.post(STATS_API_URL, json=payload, headers=headers, timeout=5)
```
