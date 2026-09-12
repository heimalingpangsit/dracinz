import express from 'express';
import serverless from 'serverless-http';
import { router as apiRouter } from '../../src/server/routes.js';

const app = express();
app.use(express.json());

// Normalize the incoming path regardless of whether Netlify hands us
// the raw "/api/..." path or the full "/.netlify/functions/api/api/..." path
app.use((req, _res, next) => {
  req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '');
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use('/api', apiRouter);

export const handler = serverless(app);
