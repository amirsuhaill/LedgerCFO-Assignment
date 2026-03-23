const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');
const clientRoutes = require('./src/routes/clients');
const taskRoutes = require('./src/routes/tasks');
const statsRoutes = require('./src/routes/stats');
const seed = require('./src/seed');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (must be last)
app.use(errorHandler);

// Seed on startup
seed();

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
