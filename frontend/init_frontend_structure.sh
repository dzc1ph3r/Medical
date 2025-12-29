#!/usr/bin/env bash
set -euo pipefail

echo "📁 Creating frontend folders..."
mkdir -p src/{api,components,pages,hooks,types,layouts,assets,utils,context}

echo "📄 Creating frontend files..."
touch \
  src/main.tsx \
  src/App.tsx \
  src/index.css \
  src/vite-env.d.ts \
  src/api/auth.api.ts \
  src/api/doctor.api.ts \
  src/api/appointment.api.ts \
  src/components/DoctorCard.tsx \
  src/components/AppointmentCard.tsx \
  src/components/Calendar.tsx \
  src/layouts/PublicLayout.tsx \
  src/layouts/DashboardLayout.tsx \
  src/pages/Login.tsx \
  src/pages/Register.tsx \
  src/pages/Doctors.tsx \
  src/pages/DoctorProfile.tsx \
  src/pages/PatientDashboard.tsx \
  src/pages/DoctorDashboard.tsx \
  src/pages/NotFound.tsx \
  src/hooks/useAuth.ts \
  src/hooks/useDebounce.ts \
  src/types/auth.ts \
  src/types/doctor.ts \
  src/types/appointment.ts \
  src/types/medicalRecord.ts \
  src/utils/constants.ts \
  src/utils/format.ts \
  src/context/AuthContext.tsx

# Optionnel: README frontend
touch FRONTEND_README.md

echo "✅ Frontend structure created!"
echo "🔎 Tip: run 'find src -maxdepth 3 -type d -print' to view folders"
