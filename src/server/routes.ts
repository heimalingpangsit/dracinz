import { Router } from 'express';
import {
  getHome,
  getCollections,
  getAllMovies,
  getGenreMovies,
  searchMovies,
  getMovieDetails,
  getEpisodeStreaming
} from './scraper.js';

export const router = Router();

// GET /api/dracinema/home
router.get('/dracinema/home', async (req, res) => {
  try {
    const data = await getHome();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/collections
router.get('/dracinema/collections', async (req, res) => {
  try {
    const data = await getCollections();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/movies
router.get('/dracinema/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const data = await getAllMovies(page);
    res.json({ success: true, page, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/genre
router.get('/dracinema/genre', async (req, res) => {
  try {
    const slug = (req.query.slug as string) || 'semua';
    const page = parseInt(req.query.page as string, 10) || 1;
    const data = await getGenreMovies(slug, page);
    res.json({ success: true, slug, page, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/search
router.get('/dracinema/search', async (req, res) => {
  try {
    const keyword = (req.query.keyword as string) || '';
    const data = await searchMovies(keyword);
    res.json({ success: true, keyword, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/detail
router.get('/dracinema/detail', async (req, res) => {
  try {
    const slug = (req.query.slug as string) || '';
    const data = await getMovieDetails(slug);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/play
router.get('/dracinema/play', async (req, res) => {
  try {
    const url = (req.query.url as string) || '';
    const data = await getEpisodeStreaming(url);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/dracinema/proxy-video (Optional video CORS proxy)
router.get('/dracinema/proxy-video', async (req, res) => {
  const videoUrl = req.query.url as string;
  if (!videoUrl) {
    return res.status(400).send('Missing url parameter');
  }
  try {
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://dracinema.com/'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Video stream fetch failed');
    }

    const contentType = response.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    res.status(500).send(`Proxy error: ${err.message}`);
  }
});
