# 🌐 Aapda Setu — AI-Powered Emergency & Disaster Response App

Aapda Setu is an innovative mobile application designed to provide **real-time disaster alerts**, **AI-powered insights**, and **community-based emergency reporting**.  
It bridges citizens, responders, NGOs, and authorities to ensure faster coordination and reduce the impact of disasters using **AI and crowd intelligence**.

---

## 📱 App Overview

### **Objective**
To create a unified mobile platform that delivers **real-time disaster alerts** and **location-based warnings**, allows users to **report incidents**, and automatically notifies nearby users (within 5 km) and relevant departments in case of emergencies.

### **Key Features**
- 🔥 **5 km Fire Alert System** – Detects fire reports and alerts nearby users & local fire departments.  
- 🤖 **AI-Powered Alert Classification** – Smart prioritization of alerts and reports.  
- 🧭 **Community-Based Reporting** – Verified and trusted user system.  
- 📶 **Offline Mode** – SMS alerts for low-connectivity areas.  
- 💬 **AI Chatbot** – Provides emergency guidance and information.  
- 🛡️ **Misinformation Control** – AI moderation and cross-verification with official data.

---

## ⚙️ Technology Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | Flutter (cross-platform) |
| **Backend** | Node.js / Flask with REST APIs |
| **Database** | MongoDB Atlas (NoSQL) |
| **AI/ML** | TensorFlow, PyTorch, Hugging Face |
| **Maps & Geolocation** | Google Maps API, Geofencing |
| **Cloud Hosting** | AWS / Firebase / Google Cloud |
| **Notifications** | Firebase Cloud Messaging, Twilio SMS |
| **External APIs** | NDMA, IMD, regional fire department APIs |

---

## 🧠 AI/ML Features

### **Automated Detection**
- Anomaly detection for suspicious reporting patterns.  
- NLP classifiers to identify duplicate or generic text.  
- Image forensics for verifying authenticity.  
- Cross-validation with NDMA/IMD data feeds.  
- Confidence scoring to route uncertain data for human review.

### **Human-in-the-Loop Verification**
- Moderation by trained volunteers and student emergency teams.  
- Confirmation from nearby verified users.  
- NGO and local authority partnerships for fast validation.

---

## 🧩 Flutter UI Implementation

This repository contains a **complete Flutter implementation** of the Figma UI design for Aapda Setu.

### **UI Screens**
1. **Splash Screen** – Animated branding (2.5s)  
2. **Onboarding** – 3 slides with skip and next buttons  
3. **Login** – OTP-based authentication  
4. **Home** – Map view with real-time alerts  
5. **Report** – 4-step incident reporting form  
6. **Alerts** – List & map views with filters  
7. **Chatbot** – AI emergency assistant  
8. **Profile** – User preferences & account settings  
9. **Moderator Dashboard** – Verification panel  
10. **Bottom Navigation** – 5-tab structure

### **Design Fidelity**
- 🎨 Colors:  
  - Primary: `#E53935` (Red)  
  - Secondary: `#1565C0` (Blue)  
  - Success: `#4CAF50` (Green)  
- 🧱 Border Radius: 10px  
- ✍️ Font: Google Fonts *Inter*  
- 🌈 Shadows & Elevation: Material Design-based

---

## 🧭 Project Structure

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

## 🧪 Testing the Onboarding Screen

By default, the onboarding screen appears only **once**.  
To test it repeatedly, follow one of the options below.

### ✅ Option 1: Force Show (Recommended)
In `lib/main.dart`, change:
```dart
static const bool _forceShowOnboarding = false;
```

to

```dart
static const bool _forceShowOnboarding = true;
```

→ This shows onboarding every time you launch the app.
⚠️ *Set it back to `false` before production!*

### 🧹 Option 2: Clear App Data

**Android Settings:**

```
Settings → Apps → Aapda Setu → Storage → Clear Data
```

**ADB Command:**

```bash
adb shell pm clear com.example.aapda_setu_application
```

### 🔁 Option 3: Reinstall the App

```bash
flutter clean
flutter run
```

### 🧰 Option 4: Add Debug Button (Temporary)

In `ProfileScreen`:

```dart
ElevatedButton(
  onPressed: () async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('hasSeenOnboarding');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Onboarding reset! Restart the app.')),
    );
  },
  child: Text('Reset Onboarding (Debug)'),
),
```

---

## 🧾 Expected Behavior

| Launch Type      | Flow                                     |
| ---------------- | ---------------------------------------- |
| **First Launch** | Splash → Onboarding → Login              |
| **Next Launch**  | Splash → Login                           |
| **Force Mode**   | Splash → Onboarding → Login (every time) |

---

## ✅ Testing Checklist

* [ ] Onboarding shows on first launch
* [ ] All 3 slides work with Next/Skip buttons
* [ ] Dot indicators and transitions work
* [ ] Flag saves after completion
* [ ] Skipped on next launch
* [ ] Force flag works

---

## 🧰 Development Setup

### **Requirements**

* Flutter SDK 3.9.2+
* Android Studio or VS Code
* Android Emulator or physical device

### **Commands**

```bash
flutter pub get
flutter run
flutter build apk --release
```

---

## 🧠 Future Enhancements

* Integration with **IoT fire sensors** and **drones** for faster detection
* **Predictive analytics** for early disaster forecasting
* **Voice-based AI assistant** for accessibility
* **Automated integration** with emergency services

---

## ⚡ Advantages

* Real-time, AI-prioritized alerts
* Verified and trusted community data
* Multi-language and offline SMS alerts
* Collaboration between citizens and authorities
* Scalable and secure backend design

---

## 🧩 Backend Services (Existing)

```
backend/
├── ai-service/         # Python AI service
├── api-gateway/        # Node.js gateway
├── auth-service/       # Node.js authentication
└── report-service/     # Node.js reports
```

---

## 🏁 Conclusion

**Aapda Setu** transforms disaster management into an intelligent, community-driven, and transparent system.
Through **AI**, **geofencing**, and **verified reporting**, it empowers citizens and authorities to act faster and smarter during emergencies.

---

## 📜 License

This project is part of the **Aapda Setu Disaster Management System**.
All rights reserved © 2025.

---

**Built with ❤️ using Flutter**
