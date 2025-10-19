import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5000'; // For Android emulator
  // Use 'http://localhost:5000' for iOS simulator or web
  
  // Auth endpoints
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
      }),
    );
    
    return jsonDecode(response.body);
  }
  
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    return jsonDecode(response.body);
  }
  
  // Report endpoints
  static Future<Map<String, dynamic>> createReport({
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    required String category,
    required String reportedBy,
    String? address,
    List<String>? images,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/report/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': title,
        'description': description,
        'location': {
          'latitude': latitude,
          'longitude': longitude,
          'address': address,
        },
        'category': category,
        'reportedBy': reportedBy,
        'images': images ?? [],
      }),
    );
    
    return jsonDecode(response.body);
  }
  
  static Future<Map<String, dynamic>> getNearbyReports({
    required double latitude,
    required double longitude,
    double radius = 10,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/report/nearby?lat=$latitude&lng=$longitude&radius=$radius'),
      headers: {'Content-Type': 'application/json'},
    );
    
    return jsonDecode(response.body);
  }
}