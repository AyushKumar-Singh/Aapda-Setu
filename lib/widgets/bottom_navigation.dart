import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class BottomNavigation extends StatelessWidget {
  final String currentTab;
  final Function(String) onTabChange;

  const BottomNavigation({
    super.key,
    required this.currentTab,
    required this.onTabChange,
  });

  @override
  Widget build(BuildContext context) {
    final tabs = [
      NavTab('home', 'Home', Icons.home),
      NavTab('report', 'Report', Icons.warning_amber),
      NavTab('chatbot', 'AI', Icons.chat),
      NavTab('alerts', 'Alerts', Icons.notifications),
      NavTab('profile', 'Profile', Icons.person),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppTheme.border, width: 1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: tabs.map((tab) {
              final isActive = currentTab == tab.id;

              return Expanded(
                child: InkWell(
                  onTap: () => onTabChange(tab.id),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        tab.icon,
                        size: 24,
                        color: isActive
                            ? AppTheme.primary
                            : AppTheme.mutedForeground,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tab.label,
                        style: TextStyle(
                          fontSize: 11,
                          color: isActive
                              ? AppTheme.primary
                              : AppTheme.mutedForeground,
                          fontWeight: isActive
                              ? FontWeight.w500
                              : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}

class NavTab {
  final String id;
  final String label;
  final IconData icon;

  NavTab(this.id, this.label, this.icon);
}
