# Aetheria: The AI-Powered Restaurant (Full-Stack Application)

This is a full-stack application for Aetheria, an AI-powered restaurant. It includes a React frontend built with Vite and a Node.js backend using Express. The backend serves as a proxy to the Google Vertex AI Gemini API, handling secure authentication and also serving the static frontend assets in a production environment.

## Architecture

The application follows a simple client-server model where the backend acts as a Backend for Frontend (BFF).

```
[Client Browser] <--> [Vite/Node.js on Cloud Run] <--> [Google Vertex AI API]
       |                      | (Express Server)
       |                      |
       <----------------------> 
        (Serves React App)
```

- **Frontend**: A React single-page application (SPA) that provides the user interface.
- **Backend**: An Express.js server that serves two main purposes:
    1.  It serves the built React application's static files (`index.html`, CSS, JS).
    2.  It provides a `/vertex-ai-proxy` endpoint that securely forwards requests to the Google Vertex AI API, using the Cloud Run service's identity for authentication.
- **Deployment**: The entire application is containerized and deployed as a single service on Google Cloud Run.

## Project Structure

```
/
├── components/     # React UI components
├── data/           # Static data, images, and menu information
├── services/       # Modules for calling external services (Vertex AI, Weather)
├── App.tsx         # Main React application component
├── server.cjs      # Node.js Express backend server
├── Dockerfile      # Docker configuration for building the production container
└── vite.config.ts  # Vite configuration, including the local dev proxy
```

## Instructions

**Prerequisites**:
- [Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [Node.js](https://nodejs.org/en/download/) (v20 or higher recommended) and npm
- [Docker](https://www.docker.com/products/docker-desktop/) (for building and testing container locally)

### 1. Local Development

To run the application locally in development mode:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Authenticate with Google Cloud**: For the backend server to access Vertex AI locally, you need to provide Application Default Credentials (ADC) by authenticating your `gcloud` CLI.
    ```bash
    gcloud auth application-default login
    ```
3.  **Create a `.env` file (Optional)**: For local development, the server can automatically detect your Project ID and Location from your `gcloud` configuration or the GCP metadata server. However, you can explicitly override them by creating a `.env` file in the root directory.
    ```
    # .env (optional, overrides auto-detection)
    PROJECT_ID=YOUR_GOOGLE_CLOUD_PROJECT_ID
    LOCATION=us-central1
    ```
4.  **Start the development servers**:
    ```bash
    npm run dev
    ```
    This command starts both the Vite frontend server (on `http://localhost:5173`) and the Node.js backend server (on `http://localhost:8080`). The Vite server will proxy API requests to the backend.

### 2. Local Docker Testing

To build and run the final production container locally:

1.  **Build the Docker image**:
    ```bash
    docker build -t aetheria-restaurant:slim .
    ```
2.  **Run the Docker container**:
    ```bash
    docker run -p 8080:8080 aetheria-restaurant:slim
    ```
    -   This command maps port `8080` from your local machine to port `8080` inside the container.
    -   The server inside the container will automatically detect the Project ID and Location if you have ADC set up.
    -   Access the application at `http://localhost:8080`.

### 3. Deploy to Cloud Run

To deploy the full-stack application to Google Cloud Run, building directly from your local source code:

1.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy aetheria-restaurant \
        --source=. \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated
    ```
    -   `--source=.`: This tells Cloud Run to build the container image from your local source code using Google Cloud Build.
    -   **Note**: You no longer need to set `PROJECT_ID` or `LOCATION` as environment variables. The server now intelligently detects them from the Cloud Run environment. The `NODE_ENV` is also set to `production` automatically within the `Dockerfile`.

### Troubleshooting

#### 403 Permission Denied Errors with Vertex AI

If, after deploying, you see `403 Forbidden` errors in your logs with the message `Permission 'aiplatform.endpoints.predict' denied`, it means the service account running your Cloud Run instance needs permission to access Vertex AI.

1.  **Identify your Service Account**: By default, Cloud Run uses the **Compute Engine default service account**. You can find the exact email on the "Security" tab of your Cloud Run service in the Google Cloud Console.

2.  **Grant the "Vertex AI User" role**: Use the `gcloud` command below, replacing the placeholder values with your actual project ID and service account email.
    ```bash
    gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
        --member="serviceAccount:YOUR_SERVICE_ACCOUNT_EMAIL" \
        --role="roles/aiplatform.user"
    ```
    The permissions may take a few minutes to apply.

## Testing

There are currently no automated unit or integration tests configured for this project.