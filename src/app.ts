import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import clientsRoutes from './routes/clients.js';
import dealsRoutes from './routes/deals.js';
import projectsRoutes from './routes/projects.js';
import tasksRoutes from './routes/tasks.js';
import transactionsRoutes from './routes/transactions.js';
import invoicesRoutes from './routes/invoices.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import adminAuthRoutes from './routes/adminAuth.js';
import notificationsRoutes from './routes/notifications.js';
import publicationsRoutes from './routes/publications.js';

export function createApp() {
  const app = express();

  // Basic middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/clients', clientsRoutes);
  app.use('/api/deals', dealsRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/tasks', tasksRoutes);
  app.use('/api/transactions', transactionsRoutes);
  app.use('/api/invoices', invoicesRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/admin/auth', adminAuthRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/publications', publicationsRoutes);

  // Serve static files from dist/spa
  const spaPath = path.join(__dirname, 'spa');
  console.log('📁 Attempting to serve static files from:', spaPath);
  console.log('📁 __dirname:', __dirname);
  console.log('📁 SPA exists:', existsSync(spaPath));
  
  // Always try to serve static files if directory exists
  if (existsSync(spaPath)) {
    console.log('✅ SPA directory found, serving static files');
    app.use(express.static(spaPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      const indexPath = path.join(spaPath, 'index.html');
      console.log('📄 Serving index.html for path:', req.path);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('❌ Error serving index.html:', err.message);
          console.error('❌ Full error:', err);
          next(err);
        }
      });
    });
  } else {
    console.log('⚠️ SPA directory not found at:', spaPath);
    console.log('⚠️ Current working directory:', process.cwd());
  }

  // Error handler
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}