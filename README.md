
# Online Alumni Management System (NexAlum)

NexAlum is a premium, web-based platform designed to foster a strong community between a college, its current students, and its distinguished alumni.

## 🚀 Features

- **Role-Based Access**: Specialized dashboards for Students, Alumni, and Admins.
- **Authentication**: Secure Login/Register with JWT and Cookie-based persistence.
- **Job Portal**: Alumni can post jobs/internships; students can browse and apply.
- **Alumni Directory**: Students can search for alumni by name, year, or company.
- **Admin Control**: Admin approval system for alumni registrations to ensure data integrity.
- **Premium UI**: Modern purple and white aesthetic with Tailwind CSS and glassmorphic elements.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Database**: MongoDB (Mongoose)

## 📁 Folder Structure

```text
/
├── server.js              # Entry point
├── models/                # Database Schemas
├── routes/                # API Endpoints (Auth, Jobs, Users)
├── public/                # Static Frontend Files
│   ├── index.html         # Landing / Login
│   ├── register.html      # Registration
│   ├── js/                # Client-side Logic (Auth handling)
│   └── dashboards/        # Role-specific HTML interfaces
```

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   - Ensure MongoDB is running locally at `mongodb://localhost:27017/alumni_db` or update the URI in `server.js`.

3. **Run the App**:
   ```bash
   npm run start
   ```
   (Or `node server.js`)

4. **Access**:
   Open `http://localhost:3000` in your browser.

## 🎨 Design System
- **Theme**: Purple & White
- **Font**: Outfit (Google Fonts)
- **Framework**: Tailwind CSS (via CDN)
=======
# NexAlum
>>>>>>> b61d6c390c39c4ca1ff7a2f4cbea24279e2516f9
