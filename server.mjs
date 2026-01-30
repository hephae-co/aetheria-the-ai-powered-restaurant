import express from 'express';
import axios from 'axios';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { VertexAI } from '@google-cloud/vertexai';
import gcpMetadata from 'gcp-metadata';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

let projectId = process.env.PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
let location = process.env.LOCATION || process.env.GOOGLE_CLOUD_LOCATION;

if (!projectId || !location) {
    try {
        if (await gcpMetadata.isAvailable()) {
            const [metadataProjectId, metadataZone] = await Promise.all([
                !projectId ? gcpMetadata.project('project-id') : Promise.resolve(null),
                !location ? gcpMetadata.instance('zone') : Promise.resolve(null),
            ]);

            if (metadataProjectId) {
                projectId = metadataProjectId;
            }
            if (metadataZone) {
                location = metadataZone.split('/').pop().slice(0, -2);
            }
        }
    } catch (e) {
        console.error('Error fetching GCP metadata:', e);
    }
}

const PROJECT_ID = projectId;
const LOCATION = location || 'us-central1';

console.log(`Server starting with PROJECT_ID: ${PROJECT_ID}, LOCATION: ${LOCATION}`);

if (!PROJECT_ID || !LOCATION) {
    console.error('Error: PROJECT_ID or LOCATION environment variable could not be determined.');
    process.exit(1);
}

let model;
try {
    const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    model = vertex_ai.preview.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Vertex AI model initialized successfully.');
} catch (initError) {
    console.error('Error initializing Vertex AI model:', initError);
    process.exit(1);
}

app.use(express.json({ limit: '50mb' }));
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.post('/api/vertex-ai-proxy', async (req, res) => {
    try {
        const { prompt, image } = req.body;
        let contents;

        if (image && image.mimeType && image.data) {
            contents = [{
                role: 'user',
                parts: [{ text: prompt }, { inlineData: { mimeType: image.mimeType, data: image.data } }]
            }];
        } else if (prompt) {
            contents = [{ role: 'user', parts: [{ text: prompt }] }];
        } else {
            return res.status(400).send('Invalid request: Missing prompt or image data.');
        }

        const result = await model.generateContent({ contents });
        const response = result.response;
        const text = response.candidates[0].content.parts[0].text;
        res.json({ text });
    } catch (error) {
        console.error('Error proxying to Vertex AI:', error);
        res.status(500).send('Error communicating with Vertex AI');
    }
});

app.get('/api/image-proxy', async (req, res) => {
    const { url: imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400).send('Missing image URL parameter.');
    }

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image')) {
            return res.status(400).send('The provided URL does not point to an image.');
        }
        res.setHeader('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error(`Error fetching image from ${imageUrl}:`, error);
        res.status(500).send('Error fetching image.');
    }
});

if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, 'dist');
    app.use(express.static(staticPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
