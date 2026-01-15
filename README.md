# Aetheria: The AI-Powered Restaurant (Full-Stack Application)

This is a full-stack application for Aetheria, an AI-powered restaurant. It includes a React frontend (Vite) and a Node.js backend (Express) that serves as a proxy for the Google Vertex AI Gemini API. The backend handles secure API calls and also serves the static frontend assets in production.

## Instructions

**Prerequisites**:
- [Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [Node.js](https://nodejs.org/en/download/) (v20 or higher recommended) and npm/yarn/pnpm
- [Docker](https://www.docker.com/products/docker-desktop/) (for local Docker testing)

### 1. Local Development

To run the application locally in development mode:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Create a `.env` file**: Create a `.env` file in the root directory and add your Google Cloud project details. This is used by the backend server.
    ```
    PROJECT_ID=YOUR_GOOGLE_CLOUD_PROJECT_ID
    LOCATION=us-central1 # Or your desired Vertex AI region
    ```
    *Note: The `GEMINI_API_KEY` environment variable is not used by the backend server directly, as it leverages Google Cloud's Application Default Credentials via the `@google-cloud/vertexai` SDK. Ensure your `gcloud` CLI is authenticated to your project.*

3.  **Start the development servers**:
    ```bash
    npm run dev
    ```
    This command uses `concurrently` to start both the Vite frontend development server (typically on `http://localhost:5173`) and the Node.js backend API server (on `http://localhost:3000`). The Vite server is configured to proxy API requests to the backend server.

### 2. Local Docker Testing

To build and run the application using Docker locally:

1.  **Ensure `.env` file exists**: Make sure you have created the `.env` file as described in the "Local Development" section.

2.  **Build the Docker image**:
    ```bash
    docker build -t aetheria-restaurant:slim .
    ```
    *Note: The image name `aetheria-restaurant:slim` is used here. You can choose a different name/tag.*

3.  **Run the Docker container**:
    ```bash
    docker run -p 3000:3000 --env-file .env aetheria-restaurant:slim
    ```
    *   `-p 3000:3000`: Maps port 3000 from your host to port 3000 in the container.
    *   `--env-file .env`: Injects environment variables from your local `.env` file into the container. This is crucial for `PROJECT_ID` and `LOCATION`.
    *   The `NODE_ENV` inside the container will default to `production`, which tells the `server.cjs` to serve the static frontend files.
    
    Access the application at `http://localhost:3000`.

### 3. Deploy to Cloud Run

To deploy the full-stack application to Google Cloud Run:

1.  **Build and push the Docker image to Google Container Registry (GCR) or Artifact Registry**:
    Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.
    ```bash
    docker build -t gcr.io/YOUR_PROJECT_ID/aetheria-restaurant:latest .
    docker push gcr.io/YOUR_PROJECT_ID/aetheria-restaurant:latest
    ```

2.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy aetheria-restaurant \\
        --image gcr.io/YOUR_PROJECT_ID/aetheria-restaurant:latest \\
        --platform managed \\
        --region us-central1 \\
        --allow-unauthenticated \\
        --set-env-vars PROJECT_ID=YOUR_PROJECT_ID,LOCATION=us-central1,NODE_ENV=production
    ```
    *   Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.
    *   `--set-env-vars PROJECT_ID=YOUR_PROJECT_ID,LOCATION=us-central1,NODE_ENV=production`: This is critical.
        *   `PROJECT_ID` and `LOCATION` are used by the backend to connect to Vertex AI.
        *   `NODE_ENV=production` ensures that the `server.cjs` script within the container serves the built static frontend assets in addition to the API routes.

    *Note: If your local `.env` file contains sensitive information that should not be directly passed via `--set-env-vars`, consider using Google Secret Manager for production environments. However, `PROJECT_ID`, `LOCATION`, and `NODE_ENV` are generally safe to set this way.*
