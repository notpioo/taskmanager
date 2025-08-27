import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Set trust proxy untuk Railway
app.set('trust proxy', 1);

// MongoDB Atlas connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'tugas_app';

let db, gfs;

// Connect to MongoDB
async function connectDB() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    db = client.db(DB_NAME);
    gfs = new GridFSBucket(db, { bucketName: 'uploads' });
    
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.RAILWAY_STATIC_URL, process.env.RAILWAY_PUBLIC_DOMAIN] 
    : true,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this name already exists' });
    }

    // Create new user (simple hash - in production, use bcrypt)
    const user = {
      name,
      password, // In production, hash this password
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertedId,
      name: user.name
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'Name and password are required' });
    }

    // Find user
    const user = await db.collection('users').findOne({ name, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload tugas
app.post('/api/tugas/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, subject, uploaderName, userId, category } = req.body;

    // Create upload stream to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      metadata: {
        title,
        description,
        subject,
        uploaderName,
        userId,
        category: category || 'tugas', // 'tugas' or 'galeri'
        uploadDate: new Date(),
        contentType: req.file.mimetype,
        size: req.file.size
      }
    });

    // Write file to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      res.status(201).json({
        message: 'Tugas uploaded successfully',
        fileId: uploadStream.id,
        filename: req.file.originalname
      });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({ error: 'Error uploading file' });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tugas
app.get('/api/tugas', async (req, res) => {
  try {
    const files = await gfs.find({ 'metadata.category': { $ne: 'galeri' } }).toArray();
    
    const tugasList = files.map(file => ({
      id: file._id,
      filename: file.filename,
      title: file.metadata?.title || 'Untitled',
      description: file.metadata?.description || '',
      subject: file.metadata?.subject || '',
      uploaderName: file.metadata?.uploaderName || 'Unknown',
      userId: file.metadata?.userId,
      category: file.metadata?.category || 'tugas',
      uploadDate: file.metadata?.uploadDate || file.uploadDate,
      size: file.length,
      contentType: file.metadata?.contentType
    }));

    res.json(tugasList);
  } catch (error) {
    console.error('Error fetching tugas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all galeri items
app.get('/api/galeri', async (req, res) => {
  try {
    const files = await gfs.find({ 'metadata.category': 'galeri' }).toArray();
    
    const galeriList = files.map(file => ({
      id: file._id,
      filename: file.filename,
      title: file.metadata?.title || 'Untitled',
      description: file.metadata?.description || '',
      uploaderName: file.metadata?.uploaderName || 'Unknown',
      userId: file.metadata?.userId,
      uploadDate: file.metadata?.uploadDate || file.uploadDate,
      size: file.length,
      contentType: file.metadata?.contentType
    }));

    res.json(galeriList);
  } catch (error) {
    console.error('Error fetching galeri:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Preview/View file (display inline without forcing download)
app.get('/api/files/view/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    
    // Check if file exists
    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set response headers for inline viewing
    res.set({
      'Content-Type': file[0].metadata?.contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${file[0].filename}"`,
      'Cache-Control': 'public, max-age=3600'
    });

    // Create view stream
    const viewStream = gfs.openDownloadStream(fileId);
    viewStream.pipe(res);

    viewStream.on('error', (error) => {
      res.status(500).json({ error: 'Error viewing file' });
    });

  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file (no password protection anymore)
app.get('/api/files/download/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    
    // Check if file exists
    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set response headers
    res.set({
      'Content-Type': file[0].metadata?.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file[0].filename}"`
    });

    // Create download stream
    const downloadStream = gfs.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      res.status(500).json({ error: 'Error downloading file' });
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete file (works for both tugas and galeri)
app.delete('/api/files/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    
    await gfs.delete(fileId);
    res.json({ message: 'Tugas deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();