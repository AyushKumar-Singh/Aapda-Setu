import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class HelpSupportScreen extends StatelessWidget {
  final VoidCallback onBack;

  const HelpSupportScreen({super.key, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: onBack,
        ),
        title: const Text('Help & Support'),
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Emergency Numbers Section
            Text(
              'Emergency Numbers',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            _buildEmergencyCard(
              context,
              '112',
              'National Emergency',
              'Single emergency number for all services',
              AppTheme.destructive,
              Icons.emergency,
            ),
            const SizedBox(height: 12),
            _buildEmergencyCard(
              context,
              '101',
              'Fire Department',
              'Fire emergencies and rescue',
              AppTheme.warning,
              Icons.local_fire_department,
            ),
            const SizedBox(height: 12),
            _buildEmergencyCard(
              context,
              '108',
              'Ambulance / NDMA',
              'Medical emergencies and disaster management',
              AppTheme.success,
              Icons.medical_services,
            ),
            const SizedBox(height: 12),
            _buildEmergencyCard(
              context,
              '100',
              'Police',
              'Law enforcement assistance',
              AppTheme.secondary,
              Icons.local_police,
            ),
            const SizedBox(height: 32),

            // Contact Section
            Text(
              'Contact Us',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.email_outlined,
                    size: 40,
                    color: AppTheme.secondary,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Email Support',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'support@aapdaSetu.demo',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.secondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'We typically respond within 24-48 hours',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // FAQ Section
            Text(
              'Frequently Asked Questions',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            _buildFAQCard(
              context,
              'How do I report an incident?',
              'Tap the "Report" tab at the bottom, fill in the details about the emergency, and submit. Your report will be verified by the community.',
            ),
            const SizedBox(height: 12),
            _buildFAQCard(
              context,
              'How are alerts verified?',
              'Reports are verified through community moderation and AI-powered analysis. Verified alerts show a green badge.',
            ),
            const SizedBox(height: 12),
            _buildFAQCard(
              context,
              'Is this an official emergency service?',
              'No. Aapda Setu is a community platform. For immediate emergency assistance, always call official numbers like 112.',
            ),
            const SizedBox(height: 24),

            // Footer
            Center(
              child: Text(
                'Powered by AI • Verified by Community • MVP Prototype',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencyCard(
    BuildContext context,
    String number,
    String title,
    String description,
    Color color,
    IconData icon,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              number,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFAQCard(BuildContext context, String question, String answer) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.help_outline, size: 18, color: AppTheme.primary),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  question,
                  style: Theme.of(context).textTheme.labelMedium,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.only(left: 26),
            child: Text(
              answer,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        ],
      ),
    );
  }
}
