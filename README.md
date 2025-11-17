# 🌐 Aapda Setu — AI-Powered Emergency & Disaster Response Platform  
**Real-time Alerts • AI Prioritization • Community Reporting • Geo-Intelligence**

Aapda Setu is an AI-driven emergency response system designed to deliver **instant disaster alerts**, **AI-based prioritization**, and **crowd-verified reporting**.  
Built for citizens, responders, NGOs, and authorities, it creates a unified ecosystem for **faster, safer, and smarter disaster coordination**.

---

## 🚀 Overview  
Aapda Setu enables users to:

- Receive **real-time alerts** for disasters (fire, flood, earthquake, etc.)  
- Report emergencies with **verified crowd intelligence**  
- Use an **AI agent** for guidance and safety information  
- Get **location-based notifications** within a 5 km radius  
- Stay informed even in low-connectivity areas through **offline SMS mode**

It integrates **AI, geofencing, community validation, and misinformation control** to deliver reliable, real-time emergency intelligence.

---

## 🎯 Objectives  
- Provide fast and accurate emergency alerts  
- Reduce misinformation in disaster reporting  
- Enable community-powered validation  
- Automate communication with authorities  
- Enhance public safety using predictive models & geo-intelligence  

---

## 🔥 Key Features

### **🔥 5 km Fire Alert System**
- Detects fire-related reports automatically  
- Alerts users within a 5 km radius  
- Auto-notifies the nearest fire department  

---

### **🤖 AI-Powered Alert Classification**
- Prioritizes alerts based on severity  
- NLP-powered description analysis  
- Detects duplicate or spam submissions  
- Image intelligence for authenticity checks  

---

### **🧭 Community-Based Verified Reporting**
- Trusted user system  
- Layered verification (Users → Moderators → NGOs → Authorities)  
- Reduces false alarms dramatically  

---

### **📶 Offline Mode (SMS Alerts)**
Even when internet fails:  
- Users get SMS alerts  
- Can report emergencies via text  

---

### **💬 AI Emergency Assistant**
- Provides step-by-step emergency guidance  
- Location-aware responses  
- Multi-language support  

---

### **🛡️ Misinformation Prevention**
- AI moderation + rule engine  
- Cross-checks reports with **NDMA, IMD**, and verified local data  
- Duplicate detection using NLP  
- Image forensics to prevent reused images  

---

## ⚙️ Technology Stack

### **Frontend (Mobile App)**
- Flutter (Cross-platform: Android + iOS)  
- Google Maps SDK  
- FCM Notifications  

### **Backend Services**
- Node.js / Flask microservices  
- API Gateway  
- Authentication service  
- Incident reporting service  
- AI analytics service  

### **Database**
- MongoDB Atlas (GeoJSON + NoSQL)  

### **AI / ML**
- TensorFlow  
- PyTorch  
- Hugging Face transformers  
- Anomaly detection (fire/flood patterns)  
- NLP moderation models  

### **Cloud & Infrastructure**
- AWS / Firebase / Google Cloud  
- Docker containers  
- Load-balanced microservices  

### **External APIs**
- NDMA alerts  
- IMD weather + seismic APIs  
- Local fire department integration  

---

## 🧠 AI/ML Capabilities

### **Automated Detection Engine**
- Identifies unusual reporting spikes  
- Detects generic or bot-like text  
- Flags duplicate or misleading reports  
- Image verification using forensic models  
- Confidence-based routing for human moderation  

---

### **Human-in-the-Loop System**
Aapda Setu uses multi-layer validation:

1. **User Reports**
2. **Nearby Verified Users**
3. **Volunteer Moderators**
4. **NGOs / Emergency Teams**
5. **Authorities**

This ensures **accuracy, authenticity, and trust**.

---

## 📱 Flutter App Features

### **Screens**
- Splash & Onboarding  
- OTP-based Login  
- Real-time Map Alerts  
- Report Incident (guided form)  
- Alerts Dashboard  
- AI Chatbot  
- Moderator Review Panel  
- Profile & Settings  
- Bottom Navigation (5-tab)  

---

## 🎨 UI Specifications
- Color Palette:  
  - 🔴 Primary Red: `#E53935`  
  - 🔵 Secondary Blue: `#1565C0`  
  - 🟢 Success Green: `#4CAF50`  
- Font: **Inter (Google Fonts)**  
- Border Radius: 10px  
- Material Design Shadows  

---

## 🧭 Project Structure (Flutter)

```
lib/
├── main.dart
├── theme/
│   └── app_theme.dart
├── screens/
│   ├── splash_screen.dart
│   ├── onboarding_screen.dart
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── report_screen.dart
│   ├── alerts_screen.dart
│   ├── chatbot_screen.dart
│   ├── profile_screen.dart
│   └── moderator_dashboard.dart
├── widgets/
│   └── bottom_navigation.dart
├── services/
│   └── api_service.dart
└── models/
    └── alert_model.dart
```

---

## 🧪 Testing Guide (Onboarding)

### **Force Onboarding Always**
In `main.dart`:
```dart
static const bool _forceShowOnboarding = true;
```

### **Clear App Data**
```
Settings → Apps → Aapda Setu → Storage → Clear Data
```

### **ADB Reset**
```bash
adb shell pm clear com.example.aapda_setu_application
```

### **Debug Button Method**
(Temporary testing option)

---

## 🧰 Backend Microservices

```
backend/
├── ai-service/
├── api-gateway/
├── auth-service/
├── report-service/
└── notifications-service/
```

---

## 🧠 Future Enhancements
- IoT fire sensors  
- Drone-based hazard detection  
- Predictive analytics for early disaster warnings  
- Voice-enabled emergency assistant  
- Blockchain for report authenticity  
- ML-driven risk scoring per region  

---

## ⚡ Advantages
- AI-prioritized, real-time alerts  
- Verified & high-trust crowd intelligence  
- Government API integration  
- Offline-ready design  
- Scalable microservices backend  
- Multi-language & accessible  

---

## 🏁 Conclusion  
**Aapda Setu** transforms traditional disaster response by combining **AI**, **geolocation**, **community verification**, and **real-time communication**.  
It is built to protect lives, speed up response, and strengthen emergency infrastructure across India.

---

## 📜 License  
© 2025 — Aapda Setu Disaster Management System  
All Rights Reserved.

