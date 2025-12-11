# AI Studio Gemini App Proxy Server (Refactoring in progress)

This nodejs proxy server lets you run your AI Studio Gemini application unmodified, without exposing your API key in the frontend code.


## Instructions

**Prerequisites**:
- [Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install)
- (Optional) Gemini API Key

1. Download or copy the files of your AI Studio app into this directory at the root level.
2. If your app calls the Gemini API, create a Secret for your API key:
     ```
     echo -n "${GEMINI_API_KEY}" | gcloud secrets create gemini_api_key --data-file=-
     ```

3.  Deploy to Cloud Run:
    ```
    gcloud run deploy my-app --source=. --set-env-vars PROJECT_ID=YOUR_PROJECT_ID,LOCATION=us-central1
    ```
    Replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID.
