import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  static const String baseUrl = 'http://10.0.2.2:3000'; // Android emulator localhost
  // For physical device, use your computer's IP: 'http://192.168.x.x:3000'

  Future<void> init() async {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Add interceptor for authentication
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('firebase_token');
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Token expired - handle logout
          _handleUnauthorized();
        }
        return handler.next(error);
      },
    ));
  }

  void _handleUnauthorized() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('firebase_token');
    await prefs.remove('user_data');
    // Navigate to login - implement in your app
  }

  // AUTH ENDPOINTS
  
  Future<Map<String, dynamic>> verifyFirebaseToken(String firebaseToken) async {
    try {
      final response = await _dio.post('/api/v1/auth/mobile/verify', data: {
        'firebase_token': firebaseToken,
      });
      return response.data;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // REPORTS ENDPOINTS

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

  // ALERTS ENDPOINTS

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

  // MEDIA UPLOAD

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

  // CHATBOT

  Future<String> chatWithBot(String message) async {
    try {
      final response = await _dio.post('http://localhost:8001/chat', data: {
        'message': message,
      });
      return response.data['response'];
    } catch (e) {
      return 'Emergency services: Fire-101, Ambulance-102, Police-100. Stay safe!';
    }
  }

  // ERROR HANDLING

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