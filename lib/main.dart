import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/report_screen.dart';
import 'screens/alerts_screen.dart';
import 'screens/chatbot_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/moderator_dashboard.dart';
import 'screens/privacy_policy_screen.dart';
import 'screens/terms_of_service_screen.dart';
import 'screens/help_support_screen.dart';
import 'widgets/bottom_navigation.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aapda Setu',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const AppNavigator(),
    );
  }
}

class AppNavigator extends StatefulWidget {
  const AppNavigator({super.key});

  @override
  State<AppNavigator> createState() => _AppNavigatorState();
}

class _AppNavigatorState extends State<AppNavigator> {
  String _appState = 'splash'; // 'splash', 'onboarding', 'login', 'main'
  String _currentScreen =
      'home'; // 'home', 'report', 'alerts', 'chatbot', 'profile', 'moderator'
  bool _isLoggedIn = false;
  final bool _isModerator = false; // Set to true to enable moderator features

  // DEBUG: Set to true to always show onboarding (for testing)
  static const bool _forceShowOnboarding = true;

  @override
  void initState() {
    super.initState();
    _checkOnboardingStatus();
  }

  Future<void> _checkOnboardingStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool('hasSeenOnboarding') ?? false;

    // This is handled after splash screen completes
  }

  void _handleSplashComplete() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool('hasSeenOnboarding') ?? false;

    setState(() {
      // If forceShowOnboarding is true, always show onboarding for testing
      if (_forceShowOnboarding || !hasSeenOnboarding) {
        _appState = 'onboarding';
      } else {
        _appState = 'login';
      }
    });
  }

  Future<void> _handleOnboardingComplete() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('hasSeenOnboarding', true);

    setState(() {
      _appState = 'login';
    });
  }

  void _handleLogin() {
    setState(() {
      _isLoggedIn = true;
      _appState = 'main';
    });
  }

  void _handleLogout() {
    setState(() {
      _isLoggedIn = false;
      _appState = 'login';
      _currentScreen = 'home';
    });
  }

  void _handleNavigate(String screen) {
    setState(() {
      _currentScreen = screen;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Render splash screen
    if (_appState == 'splash') {
      return SplashScreen(onComplete: _handleSplashComplete);
    }

    // Render onboarding
    if (_appState == 'onboarding') {
      return OnboardingScreen(onComplete: _handleOnboardingComplete);
    }

    // Render login
    if (_appState == 'login') {
      return LoginScreen(onLogin: _handleLogin);
    }

    // Render main app
    return Scaffold(
      body: Stack(
        children: [
          // Main Content
          if (_currentScreen == 'home')
            HomeScreen(onNavigate: _handleNavigate, unreadAlerts: 3)
          else if (_currentScreen == 'report')
            ReportScreen(onBack: () => _handleNavigate('home'))
          else if (_currentScreen == 'alerts')
            AlertsScreen(onBack: () => _handleNavigate('home'))
          else if (_currentScreen == 'chatbot')
            ChatbotScreen(onBack: () => _handleNavigate('home'))
          else if (_currentScreen == 'profile')
            ProfileScreen(
              onBack: () => _handleNavigate('home'),
              onLogout: _handleLogout,
              isModerator: _isModerator,
              onPrivacyPolicy: () => _handleNavigate('privacy'),
              onTermsOfService: () => _handleNavigate('terms'),
              onHelpSupport: () => _handleNavigate('help'),
            )
          else if (_currentScreen == 'moderator')
            ModeratorDashboard(onBack: () => _handleNavigate('home'))
          else if (_currentScreen == 'privacy')
            PrivacyPolicyScreen(onBack: () => _handleNavigate('profile'))
          else if (_currentScreen == 'terms')
            TermsOfServiceScreen(onBack: () => _handleNavigate('profile'))
          else if (_currentScreen == 'help')
            HelpSupportScreen(onBack: () => _handleNavigate('profile')),

          // Bottom Navigation (hide on report and legal screens)
          if (_currentScreen != 'report' && 
              _currentScreen != 'privacy' && 
              _currentScreen != 'terms' && 
              _currentScreen != 'help')
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: BottomNavigation(
                currentTab: _currentScreen,
                onTabChange: (tab) => _handleNavigate(tab),
              ),
            ),
        ],
      ),
    );
  }
}
