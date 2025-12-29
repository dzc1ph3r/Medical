#!/bin/bash

echo "🚀 Initializing Medical MERN TypeScript Project..."

# =========================
# BACKEND
# =========================
echo "📦 Creating backend structure..."

mkdir -p backend/src/{config,models,routes,controllers,middleware,types}

touch backend/src/server.ts
touch backend/.env
touch backend/tsconfig.json
touch backend/package.json

# Backend models
touch backend/src/models/User.ts
touch backend/src/models/Appointment.ts
touch backend/src/models/MedicalRecord.ts

# Backend routes
touch backend/src/routes/auth.routes.ts
touch backend/src/routes/doctor.routes.ts
touch backend/src/routes/appointment.routes.ts
touch backend/src/routes/medicalRecord.routes.ts

# Backend controllers
touch backend/src/controllers/auth.controller.ts
touch backend/src/controllers/doctor.controller.ts
touch backend/src/controllers/appointment.controller.ts
touch backend/src/controllers/medicalRecord.controller.ts

# Backend middleware
touch backend/src/middleware/auth.middleware.ts
touch backend/src/middleware/role.middleware.ts

# =========================
# FRONTEND
# =========================
echo "🎨 Creating frontend structure..."

mkdir -p frontend/src/{api,components,pages,hooks,types,layouts}

touch frontend/package.json
touch frontend/tsconfig.json
touch frontend/vite.config.ts

# Frontend entry files
touch frontend/src/main.tsx
touch frontend/src/App.tsx
touch frontend/src/index.css

# API layer
touch frontend/src/api/auth.api.ts
touch frontend/src/api/doctor.api.ts
touch frontend/src/api/appointment.api.ts

# Pages
touch frontend/src/pages/Login.tsx
touch frontend/src/pages/Register.tsx
touch frontend/src/pages/Doctors.tsx
touch frontend/src/pages/DoctorProfile.tsx
touch frontend/src/pages/PatientDashboard.tsx
touch frontend/src/pages/DoctorDashboard.tsx

# Components
touch frontend/src/components/DoctorCard.tsx
touch frontend/src/components/AppointmentCard.tsx
touch frontend/src/components/Calendar.tsx

# =========================
# ROOT
# =========================
echo "📄 Creating root files..."

touch README.md
touch .gitignore

echo "✅ Project structure created successfully!"
echo "📂 You are ready to install dependencies and start coding."
