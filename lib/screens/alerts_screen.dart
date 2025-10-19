import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/alert_model.dart';

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

  final List<AlertModel> alerts = [
    AlertModel(
      id: 1,
      type: 'fire',
      title: 'Major Fire in Commercial Building',
      location: 'Connaught Place, Central Delhi',
      distance: 1.2,
      time: '15 mins ago',
      verified: true,
      severity: 'high',
      peopleAffected: 25,
      hasMedia: true,
    ),
    AlertModel(
      id: 2,
      type: 'flood',
      title: 'Heavy Water Logging',
      location: 'Ring Road, Nehru Place',
      distance: 3.8,
      time: '1 hour ago',
      verified: true,
      severity: 'medium',
      peopleAffected: 50,
      hasMedia: true,
    ),
    AlertModel(
      id: 3,
      type: 'accident',
      title: 'Multi-Vehicle Collision',
      location: 'NH-8, Gurgaon Border',
      distance: 6.5,
      time: '2 hours ago',
      verified: true,
      severity: 'high',
      peopleAffected: 8,
      hasMedia: false,
    ),
    AlertModel(
      id: 4,
      type: 'earthquake',
      title: 'Tremors Detected',
      location: 'Delhi NCR Region',
      distance: 8.2,
      time: '3 hours ago',
      verified: false,
      severity: 'low',
      peopleAffected: 0,
      hasMedia: false,
    ),
  ];

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
    return alerts.where((alert) {
      if (alert.distance > _filterDistance) return false;
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
    if (filteredAlerts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.search_off,
              size: 64,
              color: AppTheme.mutedForeground,
            ),
            const SizedBox(height: 16),
            Text(
              'No alerts found with current filters',
              style: Theme.of(
                context,
              ).textTheme.bodyLarge?.copyWith(color: AppTheme.mutedForeground),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredAlerts.length,
      itemBuilder: (context, index) {
        return _buildAlertCard(filteredAlerts[index]);
      },
    );
  }

  Widget _buildMapView(List<AlertModel> filteredAlerts) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue.shade50, Colors.green.shade50],
        ),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.map, size: 64, color: AppTheme.secondary),
              const SizedBox(height: 16),
              Text(
                'Map View',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Interactive map showing ${filteredAlerts.length} active alerts in your area',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppTheme.mutedForeground,
                ),
              ),
            ],
          ),
        ),
      ),
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
