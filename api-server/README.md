# Sumsub API Server

This is a separate API server for Sumsub APIs that need to run independently from the static Next.js export.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
SUMSUB_APP_TOKEN=your_app_token
SUMSUB_SECRET_KEY=your_secret_key
SUMSUB_BASE_URL=https://api.sumsub.com
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001
```

3. Run the server:
```bash
npm start
# or for development
npm run dev
```

## Deployment

You can deploy this server separately using:
- Vercel Serverless Functions
- AWS Lambda
- Google Cloud Functions
- Azure Functions
- Any Node.js hosting (Heroku, Railway, etc.)

## API Endpoints

- `POST /sumsub/upload` - Upload documents for verification
- `GET /sumsub/status?applicantId=xxx` - Get verification status

## Frontend Configuration

In your Next.js app, set the environment variable:
```
NEXT_PUBLIC_API_URL=https://your-api-server-url.com
```

This will make the frontend call the external API server instead of the Next.js API routes.

