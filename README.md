# Video Highlight Tool - Frontend Homework Assignment

- GitHub Repo: [GliaCloud Frontend Homework](https://github.com/yourusername/gliaclooud-frontend-homework)
- Live Demo: [Live Demo](https://gliacloud-frontend-homework.vercel.app)

### Demo

![demo](./public/demo.gif)

### Demo - RWD

![demo-rwd](./public/demo-rwd.gif)

## Technical Choices

- Frontend Framework:
  - Next.js
  - **Server-Side Rendering (SSR)**: Next.js supports SSR out-of-the-box, which can improve performance and SEO
  - **API Routes**: Next.js provides easy-to-use API routes that allow you to create mock APIs or actual backend functionality within the same project structure. This is great for prototyping and simplifying development without needing a separate backend service initially.
  - **Automatic Code Splitting**: The framework automatically splits your code into smaller bundles, which can be loaded on demand, improving load times.
  - **Built-in Routing**: Next.js includes file-based routing, making it simple to set up and manage routes within the application.
- Styling:
  - Tailwind CSS
  - **Utility-First Approach**: Tailwind provides utility classes that can be applied directly in your HTML/JSX, promoting rapid styling without writing custom CSS.
  - **Responsive Design**: It includes responsive variants for its utilities, making it easier to create designs that adapt seamlessly across different screen sizes (mobile and desktop).
  - **Theming Customization**: Tailwind is highly customizable via the configuration file, allowing you to easily tweak colors, fonts, breakpoints, etc., to match your design requirements.
- Data Fetching:
  - SWR
  - **Lightweight and Efficient**: SWR is a small library designed for data fetching with built-in caching, automatic revalidation, and request deduplication, leading to efficient network usage.
- Video Player:
  - Video.js
  - **Cross-Platform Support**: Video.js is a versatile player that works across various platforms and devices, ensuring broad compatibility.

## Folder Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
├── components/
│   ├── Marker.ts: Video.js Component
│   ├── Subtitles.tsx: display subtitles that can jump to custom timestamp and highlight sentences
│   ├── Timeline.tsx: display highlights on timeline
│   ├── VideoPlayer.tsx: video player integrated with video.js
│   ├── VideoUpload.tsx: choose video files
│   └── ...
├── hooks/
│   ├── use-video.ts: encapsulate video.js player logic
│   └── ...
├── data/
│   ├── api.ts: fetchers for SWR
│   └── ...
├── utils/: collections of utility functions
├── public/
│   ├── preview.png
│   └── ...
├── next.config.mjs
└── README.md
```

### API Mocks

1. `/api/video/subtitles`: Analyzes the video and returns subtitles with timestamps in remote VTT url.
2. `/api/video/analyze`: Analyze the VTT file and returns sections with subtitles that are highlighted.

These APIs can easily integrate with real AI services like OpenAI or Google Cloud for real-time analysis in the future.

## Requirements

- You should provide

  - Code on github
  - Document about your technical choices
  - An active url to run your work

- Support platforms:

  - Desktop: windows & mac, latest Chrome
  - Mobile: iOS & Android, latest Chrome & Safari

- You can use claude or any AI tools to complete this homework.

## 1. Project Overview

Your task is to build a demo of a video highlight editing tool. This tool uses AI to help users create highlight clips from uploaded videos and add transcripts to these clips.

_This image shows an example layout. Feel free to modify the design as long as you meet all the requirements._
<img width="1359" alt="image" src="https://gist.github.com/user-attachments/assets/d632451a-d688-42f1-abf7-9bcb7f1faaef">

## 2. Key Features

### 2.1 Video Upload

- Users can upload video files

### 2.2 Mock AI Processing

- Use a mock API to simulate AI processing
- The mock API should return:
  - Full video transcript
  - Transcript split into sections
  - Titles for each section
  - Suggested highlight sentences
- All this data should be in JSON format

### 2.3 User Interface

#### 2.3.1 Layout

- Split screen design:
  - Left side: Editing area
  - Right side: Preview area

#### 2.3.2 Editing Area (Left)

- Shows the transcript with:
  - Section titles
  - Sentences and their timestamps
- Users can select or unselect sentences for the highlight clip
- Clickable timestamps for easy navigation
- Auto-scrolls to follow preview playback

#### 2.3.3 Preview Area (Right)

- Shows the edited highlight clip, not the original video
- Video player with standard controls (play, pause, seek)
- Displays selected transcript text overlaid on the video
- Timeline showing selected highlights
- Smooth transition between selected clips

#### 2.3.4 Synchronization

- Editing Area to Preview Area:
  - Clicking a timestamp updates the preview timeline to that time
  - Selecting/unselecting sentences updates the preview content
- Preview Area to Editing Area:
  - During playback, the current sentence is highlighted in the editing area
  - The editing area automatically scrolls to keep the current sentence visible

### 2.4 Transcript Overlay

- Selected sentences appear as text overlay on the video in the preview area
- Text timing matches the audio of the selected clip

## 3. Evaluation Note

Your submission will be evaluated based on the following criteria:

- Implementation of the required features
- Code quality and organization
- Documentation quality
- User experience (UX) design
- Responsive web design (RWD) implementation
- Quality and appropriateness of mock data
- Overall efficacy and polish of the demo
