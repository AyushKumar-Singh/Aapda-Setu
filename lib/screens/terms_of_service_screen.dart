import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class TermsOfServiceScreen extends StatelessWidget {
  final VoidCallback onBack;

  const TermsOfServiceScreen({super.key, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: onBack,
        ),
        title: const Text('Terms of Service'),
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSection(
              context,
              '1. User Responsibilities',
              'Users must not submit false, misleading, or malicious reports. All submissions should be made in good faith to help the community stay informed about genuine emergencies.',
              icon: Icons.person_outline,
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              '2. Platform Purpose',
              'Aapda Setu is designed for emergency awareness and community safety information sharing. It is NOT a replacement for official emergency services.',
              icon: Icons.info_outline,
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              '3. Official Services',
              'This platform is not affiliated with any government agency or official emergency response service. Always contact official emergency numbers (112, 100, 101, 102, 108) for immediate assistance.',
              icon: Icons.local_police_outlined,
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              '4. Content Moderation',
              'We reserve the right to remove any content that violates these terms. Users who repeatedly submit false reports may be restricted from the platform.',
              icon: Icons.shield_outlined,
            ),
            const SizedBox(height: 24),
            _buildSection(
              context,
              '5. Liability Disclaimer',
              'Aapda Setu provides information on an "as-is" basis. We do not guarantee the accuracy of user-submitted reports and are not liable for any actions taken based on this information.',
              icon: Icons.gavel_outlined,
            ),
            const SizedBox(height: 32),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.secondary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.secondary.withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.science_outlined, color: AppTheme.secondary),
                  const SizedBox(height: 8),
                  Text(
                    'MVP Prototype',
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: AppTheme.secondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'This is a demonstration version created for hackathon evaluation purposes.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Center(
              child: Text(
                'Last updated: January 2026',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, String content, {required IconData icon}) {
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
            children: [
              Icon(icon, size: 20, color: AppTheme.primary),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.labelLarge,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}
