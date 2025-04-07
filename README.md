# TOEIC Learning Platform with Admin Dashboard

![React](https://img.shields.io/badge/React-18-blue)
![MUI](https://img.shields.io/badge/Material_UI-5-lightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6-brightgreen)

## 🌟 Overview

A complete TOEIC preparation solution featuring:
- **Mobile/Web App** for learners
- **Admin Dashboard** for content management
- **RESTful API** backend service

## ✨ Key Features

### Learner App
- � Practice tests with real TOEIC format
- 📚 Vocabulary builder with flashcards
- 📈 Progress tracking and analytics
- 🎯 Personalized study recommendations

### Admin Dashboard
- 👥 **User Management** (CRUD operations)
- 📝 **Content Management**:
  - Test/question bank editor
  - Vocabulary set management
- 📊 **Analytics Dashboard**:
  - User engagement metrics
  - Test performance statistics
- ⚙️ **System Configuration**:
  - Role-based access control
  - App content customization

## 🛠 Technology Stack

### Frontend
| Component        | Technology              |
| ---------------- | ----------------------- |
| Admin UI         | React 18 + TypeScript   |
| UI Framework     | Material-UI (MUI) 5     |
| State Management | Redux Toolkit           |
| Charts           | Chart.js + MUI X Charts |
| HTTP Client      | Axios                   |

### Backend
| Component      | Technology           |
| -------------- | -------------------- |
| Server         | Node.js 18 + Express |
| Database       | MongoDB 6 + Mongoose |
| Authentication | JWT + Bcrypt         |
| Caching        | Redis                |
| Storage        | AWS S3               |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis (optional)
- AWS account (for S3 storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TranNhatPhi/App_Toiec_BE_v4
cd toeic-platform
Install dependencies:

bash
Copy
# For backend
cd backend && npm install

# For admin dashboard
cd ../admin-dashboard && npm install

# For mobile app
cd ../mobile-app && npm install
Configure environment variables:

bash
Copy
# Create .env files in each directory
cp .env.example .env
Start the development servers:

bash
Copy
# Backend
cd backend && npm run dev

# Admin dashboard
cd ../admin-dashboard && npm start

# Mobile app
cd ../mobile-app && npm start