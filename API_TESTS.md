# Skyliners Hub API Testing Guide

## Start Server First
```bash
cd /home/purry/skyliners-hub/server && node server.js
```

Open a **NEW terminal** and run these commands:

---

## 1. Register (First user becomes admin)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@skyliners.com","password":"admin123"}'
```

**Copy the token from the response!**

---

## 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skyliners.com","password":"admin123"}'
```

---

## 3. Get Current User (replace YOUR_TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Create Player
```bash
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"John Doe","position":"Forward","jerseyNumber":10,"bio":"Star player","photo":"https://example.com/photo.jpg"}'
```

---

## 5. Get All Players
```bash
curl -X GET http://localhost:5000/api/players
```

---

## 6. Create Match
```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"opponent":"Team X","date":"2026-03-10T19:00:00Z","location":"Home Stadium","isHome":true}'
```

---

## 7. Get All Matches
```bash
curl -X GET http://localhost:5000/api/matches
```

---

## 8. Create Announcement
```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Big Game Tonight","content":"Come support the team at 7 PM!","isPinned":true}'
```

---

## 9. Get Announcements
```bash
curl -X GET http://localhost:5000/api/announcements
```

---

## 10. Get Gallery Photos
```bash
curl -X GET http://localhost:5000/api/gallery
```

---

## 11. Upload Photo (need real image file)
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

---

## 12. Get All Users (Admin only)
```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Quick Test Script
Save YOUR_TOKEN first:
```bash
export TOKEN="paste_your_token_here"
```

Then run all tests:
```bash
# Register
curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"test123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4

# Use that token
curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer $TOKEN"
```

---

## Notes
- First registered user gets **admin** role automatically
- Replace `YOUR_TOKEN` with actual token from login/register response
- Server must be running on port 5000
- All protected routes need `Authorization: Bearer TOKEN` header
