import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/alert_model.dart';

class HomeScreen extends StatefulWidget {
  final Function(String) onNavigate;
  final int unreadAlerts;

  const HomeScreen({
    super.key,
    required this.onNavigate,
    this.unreadAlerts = 0,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  double _radius = 5.0;
  final TextEditingController _searchController = TextEditingController();

  final List<AlertModel> recentAlerts = [
    AlertModel(
      id: 1,
      type: 'fire',
      title: 'Fire in Residential Area',
      location: 'Sector 15, Dwarka',
      distance: 2.3,
      verified: true,
      severity: 'high',
    ),
    AlertModel(
      id: 2,
      type: 'flood',
      title: 'Water Logging Reported',
      location: 'Ring Road, Nehru Place',
      distance: 4.1,
      verified: true,
      severity: 'medium',
    ),
    AlertModel(
      id: 3,
      type: 'earthquake',
      title: 'Tremors Detected',
      location: 'Delhi NCR Region',
      distance: 8.5,
      verified: false,
      severity: 'low',
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            floating: true,
            backgroundColor: Colors.white,
            elevation: 0,
            expandedHeight: 140,
            flexibleSpace: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              color: AppTheme.primary,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'New Delhi',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                          ],
                        ),
                        Stack(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.notifications_outlined),
                              onPressed: () => widget.onNavigate('alerts'),
                            ),
                            if (widget.unreadAlerts > 0)
                              Positioned(
                                right: 8,
                                top: 8,
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: const BoxDecoration(
                                    color: AppTheme.primary,
                                    shape: BoxShape.circle,
                                  ),
                                  constraints: const BoxConstraints(
                                    minWidth: 16,
                                    minHeight: 16,
                                  ),
                                  child: Text(
                                    '${widget.unreadAlerts}',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: 'Search location or alert type...',
                        prefixIcon: const Icon(Icons.search, size: 20),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: AppTheme.border),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Map View
          SliverToBoxAdapter(
            child: Container(
              height: 320,
              margin: const EdgeInsets.only(bottom: 1),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.blue.shade50, Colors.green.shade50],
                ),
                border: const Border(
                  bottom: BorderSide(color: AppTheme.border),
                ),
              ),
              child: Stack(
                children: [
                  // Map Placeholder
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.navigation,
                          size: 64,
                          color: AppTheme.secondary,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Interactive Map View',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: AppTheme.mutedForeground),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${recentAlerts.length} alerts within ${_radius.toInt()} km',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),

                  // Simulated Map Pins
                  ..._buildMapPins(),

                  // Radius Selector
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Alert Radius: ${_radius.toInt()} km',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                              Text(
                                '${recentAlerts.length} alerts',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                          Slider(
                            value: _radius,
                            min: 1,
                            max: 20,
                            divisions: 19,
                            activeColor: AppTheme.primary,
                            onChanged: (value) {
                              setState(() {
                                _radius = value;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Quick Actions
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Quick Actions',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.5,
                    children: [
                      _buildQuickActionCard(
                        'Report Incident',
                        Icons.add_circle,
                        AppTheme.primary,
                        Colors.white,
                        () => widget.onNavigate('report'),
                        isPrimary: true,
                      ),
                      _buildQuickActionCard(
                        'View Alerts',
                        Icons.notifications,
                        Colors.white,
                        AppTheme.foreground,
                        () => widget.onNavigate('alerts'),
                      ),
                      _buildQuickActionCard(
                        'AI Assistant',
                        Icons.chat,
                        Colors.white,
                        AppTheme.foreground,
                        () => widget.onNavigate('chatbot'),
                        emoji: '🤖',
                      ),
                      _buildQuickActionCard(
                        'Resources',
                        Icons.medical_services,
                        Colors.white,
                        AppTheme.foreground,
                        () {},
                        emoji: '🏥',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Recent Alerts
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Recent Alerts',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      TextButton(
                        onPressed: () => widget.onNavigate('alerts'),
                        child: const Text('View All'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...recentAlerts.map((alert) => _buildAlertCard(alert)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildMapPins() {
    return [
      _buildMapPin(0.25, 0.33, AppTheme.destructive, true),
      _buildMapPin(0.5, 0.75, AppTheme.warning, false),
      _buildMapPin(0.75, 0.5, AppTheme.secondary, false),
    ];
  }

  Widget _buildMapPin(double left, double top, Color color, bool pulse) {
    return Positioned(
      left: MediaQuery.of(context).size.width * left,
      top: 100 + (100 * top),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          boxShadow: pulse
              ? [
                  BoxShadow(
                    color: color.withOpacity(0.5),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ]
              : null,
        ),
        child: const Icon(Icons.place, color: Colors.white, size: 16),
      ),
    );
  }

  Widget _buildQuickActionCard(
    String title,
    IconData icon,
    Color backgroundColor,
    Color foregroundColor,
    VoidCallback onTap, {
    bool isPrimary = false,
    String? emoji,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(10),
          border: isPrimary
              ? null
              : Border.all(color: AppTheme.border, width: 2),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (emoji != null)
              Text(emoji, style: const TextStyle(fontSize: 32))
            else
              Icon(icon, size: 32, color: foregroundColor),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: foregroundColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(AlertModel alert) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
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
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.success,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'Verified',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: Colors.white, fontSize: 10),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    alert.location,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${alert.distance} km away',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
