import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ReportScreen extends StatefulWidget {
  final VoidCallback onBack;

  const ReportScreen({super.key, required this.onBack});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  int _step = 1;
  String _disasterType = '';
  String _description = '';
  int _peopleAffected = 5;
  bool _submitting = false;
  bool _submitted = false;

  final List<DisasterType> _disasterTypes = [
    DisasterType('fire', '🔥', 'Fire'),
    DisasterType('flood', '🌊', 'Flood'),
    DisasterType('earthquake', '🌍', 'Earthquake'),
    DisasterType('cyclone', '🌀', 'Cyclone'),
    DisasterType('landslide', '⛰️', 'Landslide'),
    DisasterType('accident', '🚗', 'Accident'),
    DisasterType('other', '⚠️', 'Other Emergency'),
  ];

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppTheme.destructive : AppTheme.success,
      ),
    );
  }

  Future<void> _handleSubmit() async {
    if (_disasterType.isEmpty) {
      _showSnackBar('Please select a disaster type', isError: true);
      return;
    }
    if (_description.trim().isEmpty) {
      _showSnackBar('Please provide a description', isError: true);
      return;
    }

    setState(() => _submitting = true);

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 1500));

    setState(() {
      _submitting = false;
      _submitted = true;
    });

    _showSnackBar('Report submitted for verification');

    await Future.delayed(const Duration(seconds: 2));
    widget.onBack();
  }

  void _handleContinue() {
    print(
      'Continue button pressed. Current step: $_step, Disaster type: $_disasterType',
    ); // Debug

    // Add validation for each step before continuing
    if (_step == 1 && _disasterType.isEmpty) {
      _showSnackBar('Please select a disaster type', isError: true);
      return;
    }

    if (_step == 3 && _description.trim().isEmpty) {
      _showSnackBar('Please provide a description', isError: true);
      return;
    }

    setState(() {
      _step++;
      print('Step updated to: $_step'); // Debug
    });
  }

  void _handleBack() {
    setState(() {
      _step--;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return _buildSubmittedView();
    }

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
            const Text('Report Incident'),
            Text(
              'Step $_step of 4',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
        backgroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Progress Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Row(
              children: List.generate(4, (index) {
                return Expanded(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    height: 4,
                    decoration: BoxDecoration(
                      color: index < _step ? AppTheme.primary : AppTheme.border,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                );
              }),
            ),
          ),

          // Form Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: _buildStepContent(),
            ),
          ),

          // Footer Actions
          Container(
            color: Colors.white,
            padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 16,
              bottom: MediaQuery.of(context).padding.bottom + 16,
            ),
            child: Row(
              children: [
                if (_step > 1) ...[
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        print('Back button pressed');
                        _handleBack();
                      },
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 48),
                      ),
                      child: const Text('Back'),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                // For step 2, show both Skip and Continue buttons
                if (_step == 2) ...[
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        print('Skip button pressed');
                        _handleContinue();
                      },
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 48),
                      ),
                      child: const Text('Skip'),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: _step < 4
                      ? ElevatedButton(
                          onPressed: () {
                            print('Continue button tapped');
                            _handleContinue();
                          },
                          style: ElevatedButton.styleFrom(
                            minimumSize: const Size(double.infinity, 48),
                          ),
                          child: Text(_step == 2 ? 'Continue' : 'Continue'),
                        )
                      : ElevatedButton(
                          onPressed: _submitting ? null : _handleSubmit,
                          style: ElevatedButton.styleFrom(
                            minimumSize: const Size(double.infinity, 48),
                          ),
                          child: Text(
                            _submitting ? 'Submitting...' : 'Submit Report',
                          ),
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_step) {
      case 1:
        return _buildStep1();
      case 2:
        return _buildStep2();
      case 3:
        return _buildStep3();
      case 4:
        return _buildStep4();
      default:
        return Container();
    }
  }

  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Disaster Type',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: 8),
        Text(
          'Choose the type of emergency you\'re reporting',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 24),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.2,
          ),
          itemCount: _disasterTypes.length,
          itemBuilder: (context, index) {
            final type = _disasterTypes[index];
            final isSelected = _disasterType == type.value;

            return Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  setState(() {
                    _disasterType = type.value;
                  });
                  print('Selected: ${type.value}'); // Debug print

                  // Automatically move to next step after selection
                  Future.delayed(const Duration(milliseconds: 300), () {
                    if (mounted) {
                      setState(() {
                        _step = 2;
                      });
                    }
                  });
                },
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: isSelected ? AppTheme.primary : AppTheme.border,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(10),
                    color: isSelected
                        ? AppTheme.primary.withOpacity(0.05)
                        : Colors.white,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(type.emoji, style: const TextStyle(fontSize: 48)),
                      const SizedBox(height: 8),
                      Text(
                        type.label,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Upload Media (Optional)',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: 8),
        Text(
          'Add photos or videos to help verify your report',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            border: Border.all(
              color: AppTheme.border,
              width: 2,
              style: BorderStyle.solid,
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: AppTheme.muted,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.camera_alt,
                  size: 32,
                  color: AppTheme.mutedForeground,
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.upload, size: 16),
                label: const Text('Choose Files'),
              ),
              const SizedBox(height: 8),
              Text(
                'Photos will be compressed before upload',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.secondary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.lightbulb_outline,
                color: AppTheme.secondary,
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Tip: Clear photos help our AI verify incidents faster',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStep3() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Location', style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 8),
        Text(
          'Confirm the incident location',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 24),
        Container(
          height: 192,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.blue.shade50, Colors.green.shade50],
            ),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppTheme.border),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.location_on,
                  size: 48,
                  color: AppTheme.secondary,
                ),
                const SizedBox(height: 8),
                Text(
                  'Current Location Detected',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 4),
                Text(
                  'Sector 15, Dwarka, New Delhi',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        OutlinedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.edit_location, size: 16),
          label: const Text('Edit Location'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 48),
          ),
        ),
        const SizedBox(height: 24),
        Text('Description', style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 8),
        TextField(
          maxLines: 5,
          maxLength: 250,
          onChanged: (value) {
            setState(() => _description = value);
          },
          decoration: const InputDecoration(
            hintText: 'Describe what happened (max 250 characters)',
          ),
        ),
      ],
    );
  }

  Widget _buildStep4() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Additional Information',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: 8),
        Text(
          'Help responders assess the situation',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'People Affected',
              style: Theme.of(context).textTheme.labelMedium,
            ),
            Text(
              '$_peopleAffected ${_peopleAffected == 1 ? "person" : "people"}',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
        Slider(
          value: _peopleAffected.toDouble(),
          min: 0,
          max: 50,
          divisions: 50,
          activeColor: AppTheme.primary,
          onChanged: (value) {
            setState(() => _peopleAffected = value.toInt());
          },
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('0', style: Theme.of(context).textTheme.bodySmall),
            Text('50+', style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.muted,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Report Summary',
                style: Theme.of(
                  context,
                ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 12),
              _buildSummaryRow('Type', _getDisasterLabel()),
              _buildSummaryRow('Location', 'Sector 15, Dwarka'),
              _buildSummaryRow('People Affected', '$_peopleAffected'),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.warning.withOpacity(0.1),
            border: Border.all(color: AppTheme.warning.withOpacity(0.2)),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.warning_amber,
                color: AppTheme.warning,
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'False reports may result in account suspension. Please ensure all information is accurate.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          Text(value, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }

  String _getDisasterLabel() {
    final type = _disasterTypes.firstWhere(
      (t) => t.value == _disasterType,
      orElse: () => _disasterTypes.last,
    );
    return '${type.emoji} ${type.label}';
  }

  Widget _buildSubmittedView() {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.success.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle,
                  size: 80,
                  color: AppTheme.success,
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Report Submitted!',
                style: Theme.of(context).textTheme.headlineLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Your report has been submitted for AI verification and will be reviewed by our moderators.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppTheme.mutedForeground,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.secondary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'AI Confidence Score: 92%',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(color: AppTheme.secondary),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class DisasterType {
  final String value;
  final String emoji;
  final String label;

  DisasterType(this.value, this.emoji, this.label);
}
