import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;

/// =============================================================================
/// API SERVICE - Aapda Setu
/// =============================================================================
/// 
/// HACKATHON DEPLOYMENT CONFIGURATION:
/// 
/// For APK demo on physical phone:
/// 1. Find laptop's LAN IP: ipconfig (Windows) or ifconfig (Mac/Linux)
/// 2. Update _lanIP below to your laptop's IP
/// 3. Ensure phone and laptop are on same WiFi network
/// 4. Run: ollama serve && npm run dev
/// 
/// Base URL selection:
/// - Web browser: localhost:5000
/// - Android emulator: 10.0.2.2:5000 (maps to host localhost)
/// - Physical phone: <laptop_lan_ip>:5000
/// =============================================================================

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  
  late Dio _dio;
  bool _initialized = false;

  // ⚠️ CHANGE THIS TO YOUR LAPTOP'S LAN IP FOR PHYSICAL PHONE DEMO
  // Find it with: ipconfig (look for IPv4 Address under WiFi adapter)
  static const String _lanIP = '192.168.1.100'; // Example: 192.168.0.105

  /// Get the correct base URL based on platform
  static String get baseUrl {
    // Web browser - use localhost
    if (kIsWeb) {
      return 'http://localhost:5000';
    }
    
    // Mobile platforms
    try {
      if (Platform.isAndroid) {
        // Check if running on emulator (heuristic: most emulators use 10.0.2.x)
        // For demo, assume physical device and use LAN IP
        // Change this logic if needed:
        
        // Option 1: Always use LAN IP (for physical phone demo)
        // return 'http://$_lanIP:5000';
        
        // Option 2: Use emulator address (for emulator testing)
        return 'http://10.0.2.2:5000';
        
        // Option 3: Uncomment below for physical device
        // return 'http://$_lanIP:5000';
      }
      
      if (Platform.isIOS) {
        // iOS simulator uses localhost, physical uses LAN IP
        return 'http://$_lanIP:5000';
      }
    } catch (e) {
      // Platform check failed, fallback to localhost
      print('[ApiService] Platform check failed: $e');
    }
    
    return 'http://localhost:5000';
  }

  ApiService._internal() {
    _initDio();
  }

  void _initDio() {
    if (_initialized) return;
    
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 60), // Longer for AI responses
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Add interceptor for authentication
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          _handleUnauthorized();
        }
        return handler.next(error);
      },
    ));
    
    _initialized = true;
    print('[ApiService] ✅ Initialized with baseUrl: $baseUrl');
  }

  Future<void> init() async {
    _initDio();
  }

  void _handleUnauthorized() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  // ===========================================================================
  // AUTH ENDPOINTS
  // ===========================================================================
  
  Future<Map<String, dynamic>> verifyPhone(String phone, {String? name}) async {
    try {
      final response = await _dio.post('/api/v1/auth/mobile/verify', data: {
        'phone': phone,
        'name': name,
      });
      
      if (response.data['success'] == true && response.data['data']['access_token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', response.data['data']['access_token']);
      }
      
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ===========================================================================
  // REPORTS ENDPOINTS
  // ===========================================================================

  Future<Map<String, dynamic>> createReport({
    required String type,
    required String severity,
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    required String address,
    String? city,
    List<String>? mediaUrls,
    bool isAnonymous = false,
  }) async {
    try {
      final response = await _dio.post('/api/v1/reports', data: {
        'type': type,
        'severity': severity,
        'title': title,
        'description': description,
        'location': {
          'type': 'Point',
          'coordinates': [longitude, latitude],
        },
        'address': {
          'formatted': address,
          'city': city ?? '',
          'state': '',
        },
        'media': mediaUrls?.map((url) => {
          'media_id': 'media_${DateTime.now().millisecondsSinceEpoch}',
          'type': 'image',
          'url': url,
        }).toList() ?? [],
        'is_anonymous': isAnonymous,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getMyReports({int page = 1, int limit = 20}) async {
    try {
      final response = await _dio.get('/api/v1/reports', queryParameters: {
        'page': page,
        'limit': limit,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getReportById(String reportId) async {
    try {
      final response = await _dio.get('/api/v1/reports/$reportId');
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Submit a new incident report from mobile app
  Future<Map<String, dynamic>> submitReport({
    required String type,
    required String description,
    required int peopleAffected,
    required double lat,
    required double lng,
    String? address,
    String? mediaUrl,
  }) async {
    try {
      print('[ApiService] Submitting report: type=$type, lat=$lat, lng=$lng');
      
      final response = await _dio.post('/api/v1/reports/public', data: {
        'type': type,
        'description': description,
        'peopleAffected': peopleAffected,
        'lat': lat,
        'lng': lng,
        'address': address ?? 'Location: $lat, $lng',
        'mediaUrl': mediaUrl,
      });
      
      print('[ApiService] Report submitted successfully: ${response.data}');
      return response.data;
    } catch (e) {
      print('[ApiService] Failed to submit report: $e');
      throw _handleError(e);
    }
  }

  /// Fetch all public reports for map display
  Future<List<Map<String, dynamic>>> getPublicReports() async {
    try {
      print('[ApiService] Fetching public reports...');
      
      final response = await _dio.get('/api/v1/reports/public');
      
      if (response.data['success'] == true && response.data['data'] != null) {
        final List<dynamic> items = response.data['data']['items'] ?? response.data['data'];
        print('[ApiService] Fetched ${items.length} reports');
        return items.cast<Map<String, dynamic>>();
      }
      
      return [];
    } catch (e) {
      print('[ApiService] Failed to fetch public reports: $e');
      return []; // Return empty list on error to allow graceful degradation
    }
  }


  // ===========================================================================
  // ALERTS ENDPOINTS
  // ===========================================================================

  Future<Map<String, dynamic>> getActiveAlerts() async {
    try {
      final response = await _dio.get('/api/v1/alerts', queryParameters: {
        'status': 'active',
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getNearbyAlerts({
    required double latitude,
    required double longitude,
    double radiusKm = 10,
  }) async {
    try {
      final response = await _dio.get('/api/v1/alerts/nearby', queryParameters: {
        'lat': latitude,
        'lng': longitude,
        'radius': radiusKm,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ===========================================================================
  // MEDIA UPLOAD
  // ===========================================================================

  Future<String> uploadMedia(String filePath) async {
    try {
      final fileName = filePath.split('/').last;
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath, filename: fileName),
      });

      final response = await _dio.post('/api/v1/media/upload', data: formData);
      return response.data['data']['url'];
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ===========================================================================
  // CHATBOT - Ollama Backend
  // ===========================================================================
  // 
  // Flow: Flutter → Node.js API → Ollama → AI Response
  // The backend handles NDMA safety wrapper

  /// Chat with Aapda Assistant (Ollama backend)
  /// Returns AI response or graceful fallback if service unavailable
  Future<String> chatWithBot(String message) async {
    try {
      print('[ApiService] Sending message to chatbot: ${message.substring(0, message.length > 30 ? 30 : message.length)}...');
      
      final response = await _dio.post('/api/v1/chatbot/chat', data: {
        'message': message,
      });
      
      print('[ApiService] Chatbot response received: ${response.data}');
      
      // Check for successful response with data
      if (response.data != null && response.data['success'] == true) {
        final data = response.data['data'];
        if (data != null && data['response'] != null) {
          final aiResponse = data['response'] as String;
          
          // Check if it's a fallback
          if (data['is_fallback'] == true) {
            print('[ApiService] ⚠️ Received fallback response (Ollama may be offline)');
          }
          
          return aiResponse;
        }
      }
      
      // Unexpected response format
      print('[ApiService] Unexpected response format: ${response.data}');
      return _getFallbackMessage();
      
    } on DioException catch (e) {
      print('[ApiService] ❌ DioException: ${e.type} - ${e.message}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        return '⏱️ Request timed out. Please try again.\n\nFor emergencies, call 112.';
      }
      
      if (e.type == DioExceptionType.connectionError) {
        return '📡 Cannot connect to server.\n\nPlease check your internet connection.\n\nFor emergencies, call 112.';
      }
      
      return _getFallbackMessage();
      
    } catch (e) {
      print('[ApiService] ❌ Unexpected error: $e');
      return _getFallbackMessage();
    }
  }

  /// Standard fallback message when AI is unavailable
  String _getFallbackMessage() {
    return '''⚠️ AI Assistant temporarily unavailable.

For emergencies, please call:
• National Emergency: 112
• Fire: 101
• Ambulance: 108
• Police: 100
• NDMA Helpline: 1078

Stay safe!''';
  }

  // ===========================================================================
  // ERROR HANDLING
  // ===========================================================================

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response != null) {
        return error.response?.data['error'] ?? 'Server error occurred';
      } else if (error.type == DioExceptionType.connectionTimeout) {
        return 'Connection timeout. Please check your internet.';
      } else if (error.type == DioExceptionType.receiveTimeout) {
        return 'Server is taking too long to respond.';
      } else {
        return 'Network error. Please check your connection.';
      }
    }
    return 'An unexpected error occurred';
  }
}