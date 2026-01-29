import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/alert_model.dart';

class ModeratorDashboard extends StatefulWidget {
  final VoidCallback onBack;

  const ModeratorDashboard({super.key, required this.onBack});

  @override
  State<ModeratorDashboard> createState() => _ModeratorDashboardState();
}

class _ModeratorDashboardState extends State<ModeratorDashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<AlertModel> _reports = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadReports();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _loadReports() {
    _reports = [
      AlertModel(
        id: '1',
        type: 'fire',
        title: 'Fire in Commercial Building',
        location: 'Sector 15, Dwarka',
        distance: 1.2,
        time: '5 mins ago',
        verified: false,
        severity: 'high',
        peopleAffected: 25,
        hasMedia: true,
        submittedBy: 'Rahul S.',
        aiConfidence: 92,
      ),
      AlertModel(
        id: '2',
        type: 'flood',
        title: 'Water Logging on Highway',
        location: 'NH-8, Gurgaon',
        distance: 3.8,
        time: '12 mins ago',
        verified: false,
        severity: 'medium',
        peopleAffected: 50,
        hasMedia: true,
        submittedBy: 'Priya M.',
        aiConfidence: 88,
      ),
      AlertModel(
        id: '3',
        type: 'accident',
        title: 'Vehicle Collision',
        location: 'Ring Road, Delhi',
        distance: 6.5,
        time: '30 mins ago',
        verified: false,
        severity: 'high',
        peopleAffected: 5,
        hasMedia: false,
        submittedBy: 'Amit K.',
        aiConfidence: 67,
      ),
    ];
  }

  IconData _getDisasterIcon(String type) {
    switch (type) {
      case 'fire':
        return Icons.local_fire_department;
      case 'flood':
        return Icons.water;
      case 'earthquake':
        return Icons.terrain;
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

  Color _getConfidenceColor(int? confidence) {
    if (confidence == null) return AppTheme.muted;
    if (confidence >= 80) return AppTheme.success;
    if (confidence >= 60) return AppTheme.warning;
    return AppTheme.destructive;
  }

  List<AlertModel> get _pendingReports {
    return _reports.where((r) => !r.verified).toList();
  }

  List<AlertModel> get _verifiedReports {
    return _reports.where((r) => r.verified).toList();
  }

  void _handleApprove(String reportId) {
    setState(() {
      final index = _reports.indexWhere((r) => r.id == reportId);
      if (index != -1) {
        _reports[index] = AlertModel(
          id: _reports[index].id,
          type: _reports[index].type,
          title: _reports[index].title,
          location: _reports[index].location,
          distance: _reports[index].distance,
          time: _reports[index].time,
          verified: true,
          severity: _reports[index].severity,
          peopleAffected: _reports[index].peopleAffected,
          hasMedia: _reports[index].hasMedia,
          submittedBy: _reports[index].submittedBy,
          aiConfidence: _reports[index].aiConfidence,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Report verified and published'),
        backgroundColor: AppTheme.success,
      ),
    );
  }

  void _handleReject(String reportId) {
    setState(() {
      _reports.removeWhere((r) => r.id == reportId);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Report flagged for review'),
        backgroundColor: AppTheme.destructive,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pendingCount = _pendingReports.length;
    final verifiedCount = _verifiedReports.length;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // Header
          SliverAppBar(
            expandedHeight: 140,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: widget.onBack,
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: [AppTheme.secondary, AppTheme.primary],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.check_circle,
                                color: Colors.white,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Moderator Dashboard',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium
                                      ?.copyWith(color: Colors.white),
                                ),
                                Text(
                                  'Review and verify reports',
                                  style: Theme.of(context).textTheme.bodySmall
                                      ?.copyWith(
                                        color: Colors.white.withOpacity(0.8),
                                      ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Stats
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      pendingCount.toString(),
                      'Pending',
                      Icons.warning_amber,
                      AppTheme.warning,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      verifiedCount.toString(),
                      'Verified',
                      Icons.check_circle,
                      AppTheme.success,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      '0',
                      'Flagged',
                      Icons.cancel,
                      AppTheme.destructive,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Tabs
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              child: TabBar(
                controller: _tabController,
                labelColor: AppTheme.primary,
                unselectedLabelColor: AppTheme.mutedForeground,
                indicatorColor: AppTheme.primary,
                tabs: [
                  Tab(
                    text:
                        'Pending${pendingCount > 0 ? " ($pendingCount)" : ""}',
                  ),
                  const Tab(text: 'Verified'),
                  const Tab(text: 'Flagged'),
                ],
              ),
            ),
          ),

          // Content
          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildReportsList(_pendingReports, showActions: true),
                _buildReportsList(_verifiedReports),
                _buildEmptyState('No flagged reports'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    String value,
    String label,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: color.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(10),
        color: color.withOpacity(0.05),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 4),
              Text(
                label,
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(fontSize: 11),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.displaySmall?.copyWith(fontSize: 28),
          ),
        ],
      ),
    );
  }

  Widget _buildReportsList(
    List<AlertModel> reports, {
    bool showActions = false,
  }) {
    if (reports.isEmpty) {
      return _buildEmptyState('No reports');
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: reports.length,
      itemBuilder: (context, index) {
        return _buildReportCard(reports[index], showActions);
      },
    );
  }

  Widget _buildEmptyState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.inbox, size: 64, color: AppTheme.mutedForeground),
          const SizedBox(height: 16),
          Text(
            message,
            style: Theme.of(
              context,
            ).textTheme.bodyLarge?.copyWith(color: AppTheme.mutedForeground),
          ),
        ],
      ),
    );
  }

  Widget _buildReportCard(AlertModel report, bool showActions) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    _getDisasterIcon(report.type),
                    color: AppTheme.primary,
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
                              report.title,
                              style: Theme.of(context).textTheme.bodyMedium
                                  ?.copyWith(fontWeight: FontWeight.w500),
                            ),
                          ),
                          if (report.hasMedia ?? false)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppTheme.border),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                '📷 Media',
                                style: Theme.of(
                                  context,
                                ).textTheme.bodySmall?.copyWith(fontSize: 10),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        report.location,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          if (report.submittedBy != null) ...[
                            Text(
                              'By ${report.submittedBy}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            Text(
                              ' • ',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                          if (report.time != null)
                            Text(
                              report.time!,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // AI Confidence
            if (report.aiConfidence != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.muted.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.trending_up,
                              size: 16,
                              color: AppTheme.secondary,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'AI Confidence Score',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                        Text(
                          '${report.aiConfidence}%',
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(
                                color: _getConfidenceColor(report.aiConfidence),
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: (report.aiConfidence ?? 0) / 100,
                      backgroundColor: AppTheme.border,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        _getConfidenceColor(report.aiConfidence),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            // Additional Info
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'People Affected:',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  '${report.peopleAffected ?? 0}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Cross-verification:',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  'NDMA API ✓',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: AppTheme.secondary),
                ),
              ],
            ),

            // Actions
            if (showActions) ...[
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _handleApprove(report.id),
                      icon: const Icon(Icons.check_circle, size: 16),
                      label: const Text('Approve'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.success,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _handleReject(report.id),
                      icon: const Icon(Icons.cancel, size: 16),
                      label: const Text('Flag'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.destructive,
                        side: const BorderSide(color: AppTheme.destructive),
                      ),
                    ),
                  ),
                ],
              ),
            ] else if (report.verified) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.success,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.check_circle,
                      size: 16,
                      color: Colors.white,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Verified & Published',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
