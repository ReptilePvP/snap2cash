# Snap2Cash
> A web application to upload, process, and analyze images to extract structured data and insights.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Code Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Project Overview

Snap2Cash is a powerful web application designed to bridge the gap between the physical and digital worlds. In a world where we are constantly interacting with visual information, Snap2Cash provides a seamless solution to capture, analyze, and extract value from images.

The core problem this project solves is the inefficiency and manual effort required to digitize and understand visual data. Whether you're a reseller trying to quickly assess an item's value, a professional needing to digitize receipts, or a curious individual wanting to learn more about an object, Snap2Cash streamlines this process into a few simple clicks. Our goal is to save you time and effort by turning your visual information into actionable, structured data.

## Key Features

*   **Effortless Image Upload:** A simple and intuitive interface for uploading images from your device.
*   **Multiple Analysis Services:** Integration with powerful APIs like Google Gemini and SerpAPI to provide rich and diverse analysis, from product identification to web search results.
*   **Secure Cloud Storage:** All uploaded images are securely stored in Google Cloud Storage, ensuring your data is safe and always accessible.
*   **User Authentication:** Secure user accounts to manage your history and saved analyses.
*   **Dashboard & History:** A personalized dashboard to view your past analyses and track your activity.

## Live Demo / Screenshots

*(This section will be updated with a live demo link and screenshots of the application in action.)*

[Link to Live Demo]()

![Screenshot of Snap2Cash](https://via.placeholder.com/800x450.png?text=Snap2Cash+Screenshot)

## Technology Stack

Our application is built with a modern and robust technology stack to ensure a high-quality user experience.

*   **Frontend:**
    *   React & TypeScript
    *   Vite for fast development and bundling
    *   React Router for navigation
    *   Framer Motion for smooth animations
*   **Backend:**
    *   Node.js & Express.js with TypeScript
*   **Cloud & Services:**
    *   Google Cloud Storage (GCS) for file storage
    *   SerpApi for search engine results
    *   Google Gemini for advanced AI-powered analysis

## Installation & Setup

Follow these steps to get a local copy of Snap2Cash up and running.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Setup Instructions

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/snap2cash.git
    cd snap2cash
    ```

2.  **Install root dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Backend:**
    *   Navigate to the backend directory:
        ```sh
        cd backend/server
        ```
    *   Install backend dependencies:
        ```sh
        npm install
        ```
    *   Create a `.env` file in the `backend/server` directory. You can copy the example file:
        ```sh
        cp .env.example .env
        ```
    *   Open the `.env` file and add your credentials for Google Cloud Storage and any analysis APIs (e.g., `SERPAPI_KEY`, `GEMINI_API_KEY`).

4.  **Run the Application:**
    *   Navigate back to the root directory:
        ```sh
        cd ../../
        ```
    *   Start the development server for both the frontend and backend:
        ```sh
        npm run dev
        ```
    *   The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Usage

Once the application is running, you can start analyzing images.

1.  Open your browser and navigate to `http://localhost:5173`.
2.  Create an account or sign in.
3.  Go to the "Upload" or "Analyze" page.
4.  Select an image from your device.
5.  Choose the desired analysis service (e.g., Gemini, SerpAPI).
6.  View the structured results returned by the API.

**Example API Response (from SerpAPI):**
```json
{
  "search_metadata": {
    "id": "60c7c8e4e4b3c9a9a8b4c6a7",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/...",
    "created_at": "2021-06-15T19:23:48.000Z",
    "processed_at": "2021-06-15T19:23:48.000Z",
    "google_url": "https://www.google.com/search?q=...",
    "raw_html_file": "https://serpapi.com/searches/..."
  },
  "shopping_results": [
    {
      "position": 1,
      "title": "Example Product",
      "price": "$19.99",
      "link": "https://example.com/product",
      "source": "example.com"
    }
  ]
}
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

For detailed guidelines on how to contribute, please see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

Distributed under the MIT License. See `LICENSE` for more information.
