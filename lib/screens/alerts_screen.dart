import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../theme/app_theme.dart';
import '../models/alert_model.dart';
import '../services/api_service.dart';

class AlertsScreen extends StatefulWidget {
  final VoidCallback onBack;

  const AlertsScreen({super.key, required this.onBack});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  String _view = 'list'; // 'list' or 'map'
  double _filterDistance = 10.0;
  String? _filterType;
  String? _filterSeverity;
  
  // Dynamic data loading
  List<AlertModel> _alerts = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchAlerts();
  }

  Future<void> _fetchAlerts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final reports = await ApiService().getPublicReports();
      setState(() {
        _alerts = reports.map((json) => AlertModel.fromJson(json)).toList();
        _isLoading = false;
      });
      print('[AlertsScreen] Loaded ${_alerts.length} alerts from API');
    } catch (e) {
      print('[AlertsScreen] Error fetching alerts: $e');
      setState(() {
        _errorMessage = 'Failed to load alerts';
        _isLoading = false;
      });
    }
  }

  IconData _getDisasterIcon(String type) {
    switch (type) {
      case 'fire':
        return Icons.local_fire_department;
      case 'flood':
        return Icons.water;
      case 'earthquake':
        return Icons.terrain;
      case 'cyclone':
        return Icons.air;
      default:
        return Icons.warning;
    }
  }

  Color _getSeverityColor(String severity) {
    switch (severity) {
      case 'high':
        return AppTheme.destructive;
      case 'medium':
        return AppTheme.warning;
      case 'low':
        return AppTheme.secondary;
      default:
        return AppTheme.muted;
    }
  }

  List<AlertModel> get _filteredAlerts {
    return _alerts.where((alert) {
      // Distance filter disabled for now since we don't calculate real distance
      // if (alert.distance > _filterDistance) return false;
      if (_filterType != null && alert.type != _filterType) return false;
      if (_filterSeverity != null && alert.severity != _filterSeverity) {
        return false;
      }
      return true;
    }).toList();
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _buildFilterSheet(),
    );
  }

  void _showAlertDetails(AlertModel alert) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getSeverityColor(alert.severity),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    _getDisasterIcon(alert.type),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        alert.title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (alert.time != null)
                        Text(
                          alert.time!,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'Location: ${alert.location}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (alert.latitude != null && alert.longitude != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  'Coordinates: ${alert.latitude!.toStringAsFixed(4)}, ${alert.longitude!.toStringAsFixed(4)}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            if (alert.peopleAffected != null && alert.peopleAffected! > 0)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  '👥 ${alert.peopleAffected} people affected',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredAlerts = _filteredAlerts;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: widget.onBack,
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Active Alerts'),
            Text(
              '${filteredAlerts.length} alerts nearby',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
        backgroundColor: Colors.white,
        actions: [
          OutlinedButton.icon(
            onPressed: _showFilterSheet,
            icon: const Icon(Icons.filter_list, size: 16),
            label: const Text('Filter'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Column(
        children: [
          // View Tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(child: _buildViewTab('List View', Icons.list, 'list')),
                const SizedBox(width: 8),
                Expanded(child: _buildViewTab('Map View', Icons.map, 'map')),
              ],
            ),
          ),

          // Content
          Expanded(
            child: _view == 'list'
                ? _buildListView(filteredAlerts)
                : _buildMapView(filteredAlerts),
          ),
        ],
      ),
    );
  }

  Widget _buildViewTab(String label, IconData icon, String value) {
    final isActive = _view == value;

    return InkWell(
      onTap: () {
        setState(() => _view = value);
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: isActive ? null : Border.all(color: AppTheme.border),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: isActive ? Colors.white : AppTheme.foreground,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isActive ? Colors.white : AppTheme.foreground,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListView(List<AlertModel> filteredAlerts) {
    // Show loading state
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: AppTheme.primary),
            SizedBox(height: 16),
            Text('Loading alerts...'),
          ],
        ),
      );
    }

    // Show error state
    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: AppTheme.destructive,
            ),
            const SizedBox(height: 16),
            Text(
              _errorMessage!,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.mutedForeground),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchAlerts,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (filteredAlerts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.check_circle_outline,
              size: 64,
              color: AppTheme.success,
            ),
            const SizedBox(height: 16),
            Text(
              'No active alerts nearby',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.mutedForeground),
            ),
            const SizedBox(height: 8),
            Text(
              'Report an incident to help others',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchAlerts,
      color: AppTheme.primary,
      child: ListView.builder(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 100),
        itemCount: filteredAlerts.length,
        itemBuilder: (context, index) {
          return _buildAlertCard(filteredAlerts[index]);
        },
      ),
    );
  }


  Widget _buildMapView(List<AlertModel> filteredAlerts) {
    // Build dynamic markers from fetched alerts
    final List<Marker> alertMarkers = filteredAlerts
        .where((alert) => alert.latitude != null && alert.longitude != null)
        .map((alert) {
      return Marker(
        point: LatLng(alert.latitude!, alert.longitude!),
        width: 40,
        height: 40,
        child: GestureDetector(
          onTap: () {
            // Show alert details in a bottom sheet
            _showAlertDetails(alert);
          },
          child: Container(
            decoration: BoxDecoration(
              color: _getSeverityColor(alert.severity),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: _getSeverityColor(alert.severity).withOpacity(0.5),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Icon(
              _getDisasterIcon(alert.type),
              color: Colors.white,
              size: 20,
            ),
          ),
        ),
      );
    }).toList();

    return Stack(
      children: [
        // Fullscreen OpenStreetMap
        FlutterMap(
          options: MapOptions(
            initialCenter: const LatLng(28.6139, 77.2090), // Delhi
            initialZoom: 11.0,
          ),
          children: [
            // OpenStreetMap Tiles
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.aapdaSetu.app',
            ),
            // 5km Radius Circle
            CircleLayer(
              circles: [
                CircleMarker(
                  point: const LatLng(28.6139, 77.2090),
                  radius: 5000, // 5km in meters
                  useRadiusInMeter: true,
                  color: AppTheme.primary.withOpacity(0.1),
                  borderColor: AppTheme.primary.withOpacity(0.5),
                  borderStrokeWidth: 2,
                ),
              ],
            ),
            // Dynamic Alert Markers from API
            MarkerLayer(markers: alertMarkers),
            // User Location Marker
            MarkerLayer(
              markers: [
                Marker(
                  point: const LatLng(28.6139, 77.2090),
                  width: 24,
                  height: 24,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.4),
                          blurRadius: 8,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),



        // Bottom info overlay
        Positioned(
          bottom: 100, // Clear the nav bar
          left: 16,
          right: 16,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.95),
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.3),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.primary, width: 2),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Alert Radius: 5 km',
                      style: TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    '${filteredAlerts.length} alerts',
                    style: const TextStyle(
                      color: AppTheme.primary,
                      fontWeight: FontWeight.w500,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAlertCard(AlertModel alert) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getSeverityColor(alert.severity),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    _getDisasterIcon(alert.type),
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              alert.title,
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(fontWeight: FontWeight.w500),
                            ),
                          ),
                          if (alert.verified)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.success,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.check_circle,
                                    size: 10,
                                    color: Colors.white,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Verified',
                                    style: Theme.of(context).textTheme.bodySmall
                                        ?.copyWith(
                                          color: Colors.white,
                                          fontSize: 10,
                                        ),
                                  ),
                                ],
                              ),
                            )
                          else
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppTheme.border),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.access_time,
                                    size: 10,
                                    color: AppTheme.mutedForeground,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Pending',
                                    style: Theme.of(context).textTheme.bodySmall
                                        ?.copyWith(fontSize: 10),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        alert.location,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '${alert.distance} km away',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          if (alert.time != null) ...[
                            Text(
                              ' • ',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            Text(
                              alert.time!,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ],
                      ),
                      if (alert.peopleAffected != null &&
                          alert.peopleAffected! > 0) ...[
                        const SizedBox(height: 8),
                        const Divider(),
                        const SizedBox(height: 8),
                        Text(
                          '👥 ${alert.peopleAffected} people affected',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('View Details'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('Get Directions'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterSheet() {
    return StatefulBuilder(
      builder: (context, setModalState) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.8,
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Filter Alerts',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 24),

              // Distance Filter
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Distance',
                    style: Theme.of(context).textTheme.labelMedium,
                  ),
                  Text(
                    '${_filterDistance.toInt()} km',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
              Slider(
                value: _filterDistance,
                min: 1,
                max: 20,
                divisions: 19,
                activeColor: AppTheme.primary,
                onChanged: (value) {
                  setModalState(() => _filterDistance = value);
                  setState(() => _filterDistance = value);
                },
              ),
              const SizedBox(height: 24),

              // Disaster Type Filter
              Text(
                'Disaster Type',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ['fire', 'flood', 'earthquake', 'cyclone'].map((
                  type,
                ) {
                  final isSelected = _filterType == type;
                  return FilterChip(
                    label: Text(
                      type.substring(0, 1).toUpperCase() + type.substring(1),
                    ),
                    selected: isSelected,
                    onSelected: (selected) {
                      setModalState(() {
                        _filterType = selected ? type : null;
                      });
                      setState(() {
                        _filterType = selected ? type : null;
                      });
                    },
                    selectedColor: AppTheme.primary,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppTheme.foreground,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),

              // Severity Filter
              Text('Severity', style: Theme.of(context).textTheme.labelMedium),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ['high', 'medium', 'low'].map((severity) {
                  final isSelected = _filterSeverity == severity;
                  return FilterChip(
                    label: Text(
                      severity.substring(0, 1).toUpperCase() +
                          severity.substring(1),
                    ),
                    selected: isSelected,
                    onSelected: (selected) {
                      setModalState(() {
                        _filterSeverity = selected ? severity : null;
                      });
                      setState(() {
                        _filterSeverity = selected ? severity : null;
                      });
                    },
                    selectedColor: _getSeverityColor(severity),
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppTheme.foreground,
                    ),
                  );
                }).toList(),
              ),
              const Spacer(),

              // Reset Button
              OutlinedButton(
                onPressed: () {
                  setModalState(() {
                    _filterDistance = 10.0;
                    _filterType = null;
                    _filterSeverity = null;
                  });
                  setState(() {
                    _filterDistance = 10.0;
                    _filterType = null;
                    _filterSeverity = null;
                  });
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                ),
                child: const Text('Reset Filters'),
              ),
            ],
          ),
        );
      },
    );
  }
}
