Flight Fiesta - AI Travel Itinerary Generator
A personalized travel planning system that uses machine learning to generate custom day-by-day itineraries based on your preferences and local popularity data.
🎯 Overview
Traditional travel apps give everyone the same generic recommendations. Flight Fiesta learns your individual preferences and combines them with local insights to create truly personalized itineraries.
Key Features:

Smart ML Recommendations using collaborative filtering
Dual itinerary options (popular vs personalized)
Geographic clustering for realistic daily plans
Real-time learning from user interactions

🏗️ Tech Stack
Frontend: React 18, Vite, Bootstrap 5
Backend: Node.js, Express, Python (ML)
Database: PostgreSQL + Prisma
APIs: OpenTripMap, Google Custom Search
Auth: Firebase
🤖 ML Engine

SVD Collaborative Filtering with custom dual-matrix approach
Combines user preferences + city popularity for better recommendations
Handles sparse data effectively for travel use case
Real-time interest scoring
