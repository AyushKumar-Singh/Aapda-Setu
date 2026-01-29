class AlertModel {
  final String id;
  final String type;
  final String title;
  final String location;
  final double distance;
  final bool verified;
  final String severity;
  final String? time;
  final int? peopleAffected;
  final bool? hasMedia;
  final String? submittedBy;
  final int? aiConfidence;
  
  // Location coordinates for map markers
  final double? latitude;
  final double? longitude;

  AlertModel({
    required this.id,
    required this.type,
    required this.title,
    required this.location,
    required this.distance,
    required this.verified,
    required this.severity,
    this.time,
    this.peopleAffected,
    this.hasMedia,
    this.submittedBy,
    this.aiConfidence,
    this.latitude,
    this.longitude,
  });

  /// Factory constructor to create AlertModel from API response
  factory AlertModel.fromJson(Map<String, dynamic> json) {
    // Extract coordinates from GeoJSON location
    double? lat;
    double? lng;
    
    if (json['location'] != null && json['location']['coordinates'] != null) {
      final coords = json['location']['coordinates'] as List;
      if (coords.length >= 2) {
        lng = (coords[0] as num).toDouble();
        lat = (coords[1] as num).toDouble();
      }
    }
    
    // Calculate time ago string
    String? timeAgo;
    if (json['created_at'] != null) {
      try {
        final createdAt = DateTime.parse(json['created_at']);
        final diff = DateTime.now().difference(createdAt);
        if (diff.inMinutes < 60) {
          timeAgo = '${diff.inMinutes} mins ago';
        } else if (diff.inHours < 24) {
          timeAgo = '${diff.inHours} hours ago';
        } else {
          timeAgo = '${diff.inDays} days ago';
        }
      } catch (e) {
        timeAgo = null;
      }
    }
    
    return AlertModel(
      id: json['report_id'] ?? json['_id'] ?? '',
      type: json['type'] ?? 'other',
      title: json['title'] ?? json['description'] ?? 'Unknown Incident',
      location: json['address']?['formatted'] ?? json['address'] ?? 'Unknown Location',
      distance: 0.0, // Will be calculated on client based on user location
      verified: json['status'] == 'verified',
      severity: json['severity'] ?? 'medium',
      time: timeAgo,
      peopleAffected: json['peopleAffected'] ?? json['people_affected'],
      hasMedia: (json['media'] as List?)?.isNotEmpty ?? false,
      submittedBy: json['user_id'],
      aiConfidence: ((json['confidence_score'] ?? 0) * 100).toInt(),
      latitude: lat,
      longitude: lng,
    );
  }
  
  /// Convert to JSON for sending to API
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'location': location,
      'distance': distance,
      'verified': verified,
      'severity': severity,
      'time': time,
      'peopleAffected': peopleAffected,
      'hasMedia': hasMedia,
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}
