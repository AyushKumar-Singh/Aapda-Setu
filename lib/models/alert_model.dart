class AlertModel {
  final int id;
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
  });
}
