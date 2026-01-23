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

## Usage

### Local Build (Mac M1/M2)

For Macbook Silicone M2 environments, you can build a local Docker image using the following commands:

```sh
export SERVICE_NAME=hephae-co-aetheria-restaurant
export TAG=$(git branch --show-current)-$(git rev-parse --short HEAD)
docker build --platform linux/amd64 . -t ${SERVICE_NAME}:${TAG}
```

### Deployment Build

After the local deployment has been tested, the git branch merged to main, and a new tag has been created, you can create a deployment build with the following commands:

```sh
export SERVICE_NAME=hephae-co-aetheria-restaurant
export TAG=$(git describe --abbrev=0)
docker build --platform linux/amd64 . -t ${SERVICE_NAME}:${TAG}
```

### Running the Container

After building the image, run it with the following command. Ensure you have a `.env` file in the root directory containing your `PROJECT_ID`, `LOCATION`, and `GEMINI_API_KEY` (as described in the "Local Development" section):

```sh
docker run -p 8080:8080 -it \
  --env-file ./.env \
  --name ${SERVICE_NAME} \
  --rm ${SERVICE_NAME}:${TAG}
```

### 3. Deploy to Cloud Run

To deploy the full-stack application to Google Cloud Run, building directly from your local source code:

1.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy hephae-co-aetheria-restaurant \
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Hephae.co

## Authors and Acknowledgements

*   **Hephae.co**

## Contact

For questions or support, please contact us at [contact@hephae.co](mailto:contact@hephae.co).
