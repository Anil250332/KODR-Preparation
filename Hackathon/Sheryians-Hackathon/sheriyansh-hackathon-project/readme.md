# Online Exam Proctoring System

Frontend for an online exam platform that helps teachers monitor exams using browser-based face and object detection. It flags suspicious activities for review without continuously uploading the student's video.

## Features

- Teacher dashboard to create exams and review events
- Student interface for taking timed exams
- Face detection and head pose tracking using MediaPipe
- Phone detection using TensorFlow.js and COCO-SSD
- Tab-switch detection
- Event timeline with snapshots and risk summary

## Tech Stack

- React, TypeScript, Tailwind CSS
- MediaPipe Face Landmarker
- TensorFlow.js (COCO-SSD)
- Node.js, Express, MongoDB
- Socket.IO, Recharts

## Setup

```bash
git clone <repository-url>
cd frontend
npm install
npm run dev
```

## Note

The system only flags suspicious activities. Teachers review the evidence and make the final decision.