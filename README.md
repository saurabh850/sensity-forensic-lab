# FORensic Evidence Lab

A forensic-grade multimedia evidence management and analysis workbench. Built to demonstrate an understanding of digital forensics workflows, provenance, chain of custody, and AI manipulation detection.

## Architecture

This application consists of two main components:
- **Backend:** Python + FastAPI + SQLite (Provides REST API, manages SQLite database, hashes files, and mocks Sensity AI analysis)
- **Frontend:** React + TypeScript + Vite + Tailwind CSS (Provides a professional, dark-mode GUI tailored for forensic analysts)

## Features Implemented

1. **Case Management:** Create and view active investigations.
2. **Evidence Ingestion & Hashing:** Automatically hashes (SHA-256, MD5) simulated evidence files.
3. **Chain of Custody:** Immutable audit log tracing every action on an evidence file.
4. **Detector Lab / Threat Intelligence:** Mock interfaces for evaluating AI models against datasets and tracking known AI generators.
5. **Analysis Pipeline:** Extracts metadata (simulated for demo ease without relying on local ffmpeg) and runs evidence through a Sensity API Adapter (defaults to Demo Data mode).

## Setup Instructions

### 1. Start the Backend

1. Open a terminal and navigate to the project root: `cd c:\Applying\Sensity\backend`
2. Ensure you have the required dependencies (pip install -r requirements.txt)
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Start the Frontend

1. Open a separate terminal and navigate to the frontend directory: `cd c:\Applying\Sensity\frontend`
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173` (or the port Vite provides).

### 3. Using the Demo

1. On the main "Cases" page, click **INITIALIZE DEMO DATA**. This will seed the SQLite database with a realistic investigation scenario, including manipulated audio, video, and image evidence.
2. Click into the newly created case ("Suspected Synthetic Executive Video").
3. Click "Examine" on any of the evidence files to open the **Forensic Workbench**.
4. In the workbench, click **Run Full Examination** to trigger the analysis pipeline (Metadata extraction + Sensity Detector analysis).
5. Review the **Metadata**, **Detector Lab** (with failure analysis UI), and **Chain of Custody** tabs.

## Security & Forensic Principles Demonstrated
- **Immutable Originals:** The UI emphasizes treating uploaded evidence as read-only.
- **Cryptographic Hashing:** Every file is hashed on ingest.
- **Chain of Custody:** Every automated or manual action generates an audit trail event.
- **Explainability:** The UI deliberately avoids claiming 100% certainty, requiring human-in-the-loop validation (e.g., the Detector Failure Analysis section).
