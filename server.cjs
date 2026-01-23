/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const express = require('express');
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const path = require('path');
const WebSocket = require('ws');
const { URLSearchParams, URL } = require('url');
const rateLimit = require('express-rate-limit');
const { VertexAI } = require('@google-cloud/vertexai');
const gcpMetadata = require('gcp-metadata');
require('dotenv').config(); // Load environment variables from .env file

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

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
  const LOCATION = location || 'us-central1'; // Fallback for location if still not set

  console.log(`Server starting with PROJECT_ID: ${PROJECT_ID}, LOCATION: ${LOCATION}`);

  if (!PROJECT_ID) {
    console.error('Error: PROJECT_ID environment variable could not be determined.');
    process.exit(1);
  }
  if (!LOCATION) {
    console.error('Error: LOCATION environment variable could not be determined.');
    process.exit(1);
  }

  let vertex_ai;
  let model;

  try {
    vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
    model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
    console.log('Vertex AI model initialized successfully.');
  } catch (initError) {
    console.error('Error initializing Vertex AI model:', initError);
    // Exit the process if Vertex AI cannot be initialized, as it's a critical dependency
    process.exit(1);
  }

  const staticPath = path.join(__dirname,'dist');
  const publicPath = path.join(__dirname,'public');

  // Limit body size to 50mb
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({extended: true, limit: '50mb'}));
  app.set('trust proxy', 1 /* number of proxies between user and server */)

  // Rate limiter for the proxy
  const proxyLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // Set ratelimit window at 15min (in ms)
      max: 100, // Limit each IP to 100 requests per window
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // no `X-RateLimit-*` headers
      handler: (req, res, next, options) => {
          console.warn(`Rate limit exceeded for IP: ${req.ip}. Path: ${req.path}`);
          res.status(options.statusCode).send(options.message);
      }
  });

  // Apply the rate limiter to the /vertex-ai-proxy route before the main proxy logic
  app.use('/vertex-ai-proxy', proxyLimiter);

  // Proxy endpoint for Vertex AI Gemini API
  app.post('/vertex-ai-proxy', async (req, res) => {
    console.log('[/vertex-ai-proxy] Incoming request body:', JSON.stringify(req.body, null, 2));
    try {
      const { prompt, image } = req.body;
      let contents;
      let finalPrompt = prompt;

      if (image && image.mimeType && image.data) {
        // For image enhancement, adjust the prompt to ask for a text description of the enhancement
        // as gemini-pro is text-only and cannot generate images.
        finalPrompt = `Analyze the provided food image and describe how you would enhance it to look more delicious, vibrant, and high-quality for a restaurant menu. Focus on improvements to lighting, color saturation, and texture. Do not actually generate an image, just describe the enhancements. Original prompt: "${prompt}"`;
        contents = [{
          role: 'user',
          parts: [
            { text: finalPrompt },
            { inlineData: { mimeType: image.mimeType, data: image.data } }
          ]
        }];
        console.log('[/vertex-ai-proxy] Sending multimodal content (text + image) to Vertex AI:', JSON.stringify(contents, null, 2));
      } else if (prompt) {
        // Text-only content
        contents = [{
          role: 'user',
          parts: [
            { text: prompt }
          ]
        }];
        console.log('[/vertex-ai-proxy] Sending text-only content to Vertex AI:', JSON.stringify(contents, null, 2));
      } else {
        console.error('[/vertex-ai-proxy] Invalid request: Missing prompt or image data.');
        return res.status(400).send('Invalid request: Missing prompt or image data.');
      }

      const result = await model.generateContent({ contents });
      const response = result.response;
      const text = response.candidates[0].content.parts[0].text;

      if (text) {
        res.json({ text });
      } else {
        console.warn('[/vertex-ai-proxy] Vertex AI response did not contain text. This might be unexpected for gemini-pro.');
        res.json({ text: 'AI processing complete, but no text response was generated.' });
      }

    } catch (error) {
      console.error('[/vertex-ai-proxy] Error proxying to Vertex AI Gemini API:', error);
      // Log the full error object for better debugging
      console.error('[/vertex-ai-proxy] Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      res.status(500).send('Error communicating with Vertex AI Gemini API');
    }
  });

  // New endpoint to proxy image requests
  app.get('/image-proxy', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).send('Missing image URL parameter.');
    }

    try {
      console.log(`[/image-proxy] Attempting to fetch image from: ${imageUrl}`);
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];

      if (!contentType || !contentType.startsWith('image')) {
        console.warn(`[/image-proxy] Fetched content is not an image: ${contentType}`);
        return res.status(400).send('The provided URL does not point to an image.');
      }

      res.setHeader('Content-Type', contentType);
      res.send(response.data);
      console.log(`[/image-proxy] Successfully proxied image from: ${imageUrl}`);
    } catch (error) {
      console.error(`[/image-proxy] Error fetching image from ${imageUrl}:`, error);
      res.status(500).send('Error fetching image.');
    }
  });

  // Serve static files only in production
  if (process.env.NODE_ENV === 'production') {
    // Serve index.html from the dist directory
    app.get('/', (req, res) => {
        const indexPath = path.join(staticPath, 'index.html');
        res.sendFile(indexPath);
    });
    // Serve ai_examples.html with dynamic CSS path
    app.get('/aetheria/ai_examples.html', async (req, res) => {
      try {
        // Read the main index.html to get the hashed CSS path
        const mainIndexHtmlPath = path.join(staticPath, 'index.html');
        // Dynamically find the hashed CSS file in the assets directory
        const assetsPath = path.join(staticPath, 'assets');
        console.log('Checking assets path:', assetsPath);
        let cssPath = '/index.css'; // Default fallback
        try {
          const filesInAssets = await fs.promises.readdir(assetsPath);
          console.log('Files in assets directory:', filesInAssets);
          const cssFileName = filesInAssets.find(file => file.startsWith('index-') && file.endsWith('.css'));
          if (cssFileName) {
            cssPath = `/assets/${cssFileName}`;
          }
        } catch (error) {
          console.error('Error reading assets directory:', error);
        }
        console.log('Dynamically determined CSS Path:', cssPath);
        // Read ai_examples.html
        const aiExamplesHtmlPath = path.join(staticPath, 'aetheria', 'ai_examples.html');
        console.log('Attempting to read ai_examples.html from:', aiExamplesHtmlPath);
        let aiExamplesHtmlContent = await fs.promises.readFile(aiExamplesHtmlPath, 'utf8');
        // Replace the hardcoded CSS link with the dynamic one
        aiExamplesHtmlContent = aiExamplesHtmlContent.replace(
          /<link rel="stylesheet" href="\/index\.css">/,
          `<link rel="stylesheet" href="${cssPath}">`
        );
        console.log('Modified ai_examples.html content (first 500 chars):', aiExamplesHtmlContent.substring(0, 500));
        res.send(aiExamplesHtmlContent);
      } catch (error) {
        console.error('Error serving ai_examples.html:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).send('Error loading AI examples page.');
      }
    });

    // Serve static files
    app.use('/public', express.static(publicPath));
    app.use(express.static(staticPath));
  }

  // Start the HTTP server
  const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening at http://0.0.0.0:${port}`);
      console.log(`Vertex AI proxy active on /vertex-ai-proxy`);
  }).on('error', (err) => {
      console.error('Server failed to start:', err);
      process.exit(1);
  });

  // Create WebSocket server and attach it to the HTTP server
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
      const requestUrl = new URL(request.url, `http://${request.headers.host}`);
      const pathname = requestUrl.pathname;

      if (pathname.startsWith('/vertex-ai-proxy/')) {
          // No API key needed for Vertex AI, authentication is handled by the environment
          wss.handleUpgrade(request, socket, head, (clientWs) => {
              console.log('Client WebSocket connected to proxy for path:', pathname);

              const targetPathSegment = pathname.substring('/vertex-ai-proxy'.length);
              const targetVertexWsUrl = `wss://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-pro:streamGenerateContent${targetPathSegment}`;
              console.log(`Attempting to connect to target WebSocket: ${targetVertexWsUrl}`);

              const vertexWs = new WebSocket(targetVertexWsUrl, {
                  protocol: request.headers['sec-websocket-protocol'],
              });

              const messageQueue = [];

              vertexWs.on('open', () => {
                  console.log('Proxy connected to Vertex AI WebSocket');
                  while (messageQueue.length > 0) {
                      const message = messageQueue.shift();
                      if (vertexWs.readyState === WebSocket.OPEN) {
                          vertexWs.send(message);
                      } else {
                          console.warn('Vertex AI WebSocket not open when trying to send queued message. Re-queuing.');
                          messageQueue.unshift(message);
                          break;
                      }
                  }
              });

              vertexWs.on('message', (message) => {
                  if (clientWs.readyState === WebSocket.OPEN) {
                      clientWs.send(message);
                  }
              });

              vertexWs.on('close', (code, reason) => {
                  console.log(`Vertex AI WebSocket closed: ${code} ${reason.toString()}`);
                  if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
                      clientWs.close(code, reason.toString());
                  }
              });

              vertexWs.on('error', (error) => {
                  console.error('Error on Vertex AI WebSocket connection:', error);
                  if (clientWs.readyState === WebSocket.OPEN || clientWs.readyState === WebSocket.CONNECTING) {
                      clientWs.close(1011, 'Upstream WebSocket error');
                  }
              });

              clientWs.on('message', (message) => {
                  if (vertexWs.readyState === WebSocket.OPEN) {
                      vertexWs.send(message);
                  } else if (vertexWs.readyState === WebSocket.CONNECTING) {
                      messageQueue.push(message);
                  } else {
                      console.warn('Client sent message but Vertex AI WebSocket is not open or connecting. Message dropped.');
                  }
              });

              clientWs.on('close', (code, reason) => {
                  console.log(`Client WebSocket closed: ${code} ${reason.toString()}`);
                  if (vertexWs.readyState === WebSocket.OPEN || vertexWs.readyState === WebSocket.CONNECTING) {
                      vertexWs.close(code, reason.toString());
                  }
              });

              clientWs.on('error', (error) => {
                  console.error('Error on client WebSocket connection:', error);
                  if (vertexWs.readyState === WebSocket.OPEN || vertexWs.readyState === WebSocket.CONNECTING) {
                      vertexWs.close(1011, 'Client WebSocket error');
                  }
              });
          });
      } else {
          console.log(`WebSocket upgrade request for non-proxy path: ${pathname}. Closing connection.`);
          socket.destroy();
      }
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('SIGINT/SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      wss.close(() => {
          console.log('WebSocket server closed');
          process.exit(0);
      });
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

startServer();
