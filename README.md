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
*   **User Authentication:** Secure user accounts powered by Supabase to manage your history and saved analyses.
*   **Dashboard & History:** A personalized dashboard to view your past analyses and track your activity.
*   **Cross-Platform:** Available as both a web application and mobile app (React Native/Expo).

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
*   **Mobile:**
    *   React Native with Expo
    *   TypeScript
    *   React Navigation
*   **Backend:**
    *   Node.js & Express.js with TypeScript
*   **Database & Authentication:**
    *   Supabase (PostgreSQL with built-in authentication)
*   **Cloud & Services:**
    *   Google Cloud Storage (GCS) for file storage
    *   SerpApi for search engine results
    *   Google Gemini for advanced AI-powered analysis

## Installation & Setup

Follow these steps to get a local copy of Snap2Cash up and running.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm
*   A Supabase account and project
*   Google Cloud Storage bucket and service account

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

3.  **Set up Supabase:**
    *   Create a new project at [supabase.com](https://supabase.com)
    *   Go to Settings > API to get your project URL and anon key
    *   Run the migration to create the profiles table:
        ```sh
        # Install Supabase CLI if you haven't already
        npm install -g supabase
        
        # Initialize Supabase in your project
        supabase init
        
        # Link to your project
        supabase link --project-ref your-project-ref
        
        # Run migrations
        supabase db push
        ```

4.  **Configure Frontend:**
    *   Create a `.env` file in the `frontend` directory:
        ```sh
        cp frontend/.env.example frontend/.env
        ```
    *   Edit the `.env` file and add your Supabase credentials:
        ```env
        VITE_SUPABASE_URL=your_supabase_project_url
        VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        VITE_GEMINI_API_KEY=your_gemini_api_key
        ```

5.  **Configure Backend:**
    *   Navigate to the backend directory:
        ```sh
        cd backend/server
        ```
    *   Install backend dependencies:
        ```sh
        npm install
        ```
    *   Create a `.env` file in the `backend/server` directory and add your Google Cloud Storage credentials and other API keys.

6.  **Configure Mobile App (Optional):**
    *   Navigate to the mobile directory:
        ```sh
        cd mobile
        ```
    *   Install mobile dependencies:
        ```sh
        npm install
        ```
    *   Update `app.json` with your Supabase credentials in the `extra` section.

7.  **Run the Application:**
    *   Navigate back to the root directory:
        ```sh
        cd ../../
        ```
    *   Start the development server for both the frontend and backend:
        ```sh
        npm run dev
        ```
    *   The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

8.  **Run the Mobile App (Optional):**
    *   In a separate terminal, navigate to the mobile directory:
        ```sh
        cd mobile
        npm start
        ```

## Usage

Once the application is running, you can start analyzing images.

1.  Open your browser and navigate to `http://localhost:5173`.
2.  Create an account or sign in using the Supabase authentication.
3.  Go to the "Upload" or "Analyze" page.
4.  Select an image from your device.
5.  Choose the desired analysis service (e.g., Gemini, SerpAPI).
6.  View the structured results returned by the API.

## Database Schema

The application uses Supabase (PostgreSQL) with the following main table:

### Profiles Table
```sql
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

This table extends Supabase's built-in `auth.users` table with additional user profile information.

## Authentication Flow

1. **Registration:** Users sign up with email/password through Supabase Auth
2. **Profile Creation:** A database trigger automatically creates a profile record
3. **Login:** Users authenticate using Supabase Auth
4. **Session Management:** Supabase handles JWT tokens and session persistence
5. **Row Level Security:** Database policies ensure users can only access their own data

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

For detailed guidelines on how to contribute, please see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

Distributed under the MIT License. See `LICENSE` for more information.