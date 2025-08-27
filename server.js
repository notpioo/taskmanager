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

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://pioo:Avionika27@cluster0.feboa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'tugas_app';

let db, gfs;

// Connect to MongoDB
async function connectDB() {
  try {
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes

// Upload tugas
app.post('/api/tugas/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, subject, uploaderName, isPrivate, password } = req.body;

    // Create upload stream to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      metadata: {
        title,
        description,
        subject,
        uploaderName,
        isPrivate: isPrivate === 'true',
        password: isPrivate === 'true' ? password : null,
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
    const files = await gfs.find({}).toArray();
    
    const tugasList = files.map(file => ({
      id: file._id,
      filename: file.filename,
      title: file.metadata?.title || 'Untitled',
      description: file.metadata?.description || '',
      subject: file.metadata?.subject || '',
      uploaderName: file.metadata?.uploaderName || 'Unknown',
      isPrivate: file.metadata?.isPrivate || false,
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

// Verify password for private files
app.post('/api/tugas/verify-password/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const { password } = req.body;
    
    // Check if file exists
    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file is private and password matches
    if (file[0].metadata?.isPrivate) {
      if (!password || password !== file[0].metadata?.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    res.json({ success: true, message: 'Password verified' });
  } catch (error) {
    console.error('Password verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file
app.get('/api/tugas/download/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const { password } = req.query;
    
    // Check if file exists
    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file is private and verify password
    if (file[0].metadata?.isPrivate) {
      if (!password || password !== file[0].metadata?.password) {
        return res.status(401).json({ error: 'Password required for private file' });
      }
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

// Delete tugas
app.delete('/api/tugas/:id', async (req, res) => {
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