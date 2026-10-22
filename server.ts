import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory backing store for full REST API compliance
let analysesStore: any[] = [];

// Helper calculation
function calculateDiscountData(body: any) {
  const original = Number(body.originalPrice) || 0;
  const current = Number(body.currentPrice) || 0;
  const claimed = body.claimedDiscount !== undefined ? Number(body.claimedDiscount) : null;
  const calculated = original > 0 ? Number((((original - current) / original) * 100).toFixed(1)) : 0;
  const discrepancy = claimed !== null ? Number((claimed - calculated).toFixed(1)) : 0;

  let risk = 0;
  if (claimed !== null && discrepancy > 5) risk += Math.min(35, Math.round(discrepancy * 1.5));

  const points = body.historicalPrices || [];
  let status = 'LIKELY_GENUINE';
  if (points.length < 2 && Math.abs(discrepancy) <= 5) {
    status = 'INSUFFICIENT_EVIDENCE';
  } else if (risk >= 35 || discrepancy > 15) {
    status = 'POTENTIALLY_MISLEADING';
  }

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    productName: body.productName || 'Untitled Product',
    category: body.category || 'General',
    platform: body.platform || 'Unknown Platform',
    currency: body.currency || 'USD',
    originalPrice: original,
    currentPrice: current,
    claimedDiscount: claimed,
    calculatedDiscount: calculated,
    discrepancyPercentage: discrepancy,
    priceDifference: Math.max(0, original - current),
    status,
    riskScore: Math.min(100, Math.max(0, risk)),
    confidence: points.length >= 4 ? 'High' : points.length >= 2 ? 'Medium' : 'Low',
    evidenceCount: points.length,
    historicalPrices: points,
    explanation: `Analysis completed with calculated discount of ${calculated}%.`,
    recommendations: ['Verify price with independent pricing trackers prior to purchase.'],
  };
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Fake Discount Detection API', version: '1.0.0' });
});

// 2. Analyze product
app.post('/api/analyze', (req: Request, res: Response) => {
  try {
    const { originalPrice, currentPrice } = req.body;
    if (originalPrice === undefined || currentPrice === undefined) {
      return res.status(400).json({ error: 'originalPrice and currentPrice are required.' });
    }
    const result = calculateDiscountData(req.body);
    analysesStore.unshift(result);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 3. Get all analyses
app.get('/api/analyses', (req: Request, res: Response) => {
  res.json(analysesStore);
});

// 4. Get specific analysis
app.get('/api/analyses/:id', (req: Request, res: Response) => {
  const item = analysesStore.find((a) => a.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Analysis record not found' });
  }
  res.json(item);
});

// 5. Compare products
app.post('/api/compare', (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids must be an array of analysis IDs.' });
  }
  const matching = analysesStore.filter((a) => ids.includes(a.id));
  res.json(matching);
});

// 6. Dashboard metrics
app.get('/api/dashboard', (req: Request, res: Response) => {
  const total = analysesStore.length;
  const genuine = analysesStore.filter((a) => a.status === 'LIKELY_GENUINE').length;
  const misleading = analysesStore.filter((a) => a.status === 'POTENTIALLY_MISLEADING').length;
  const insufficient = analysesStore.filter((a) => a.status === 'INSUFFICIENT_EVIDENCE').length;

  res.json({
    totalAnalyses: total,
    genuineCount: genuine,
    misleadingCount: misleading,
    insufficientCount: insufficient,
    recentAnalyses: analysesStore.slice(0, 5),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Only start when invoked directly
if (process.env.NODE_ENV === 'production') {
  startServer();
}

export default app;
