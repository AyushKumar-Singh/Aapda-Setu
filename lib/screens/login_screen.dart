import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLogin;

  const LoginScreen({super.key, required this.onLogin});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _loading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppTheme.destructive : AppTheme.success,
      ),
    );
  }

  Future<void> _handleSendOtp() async {
    if (_phoneController.text.length != 10) {
      _showSnackBar(
        'Please enter a valid 10-digit phone number',
        isError: true,
      );
      return;
    }

    setState(() => _loading = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _loading = false;
      _otpSent = true;
    });

    _showSnackBar('OTP sent to your phone');
  }

  Future<void> _handleVerifyOtp() async {
    if (_otpController.text.length != 6) {
      _showSnackBar('Please enter the 6-digit OTP', isError: true);
      return;
    }

    setState(() => _loading = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    setState(() => _loading = false);

    _showSnackBar('Login successful!');
    widget.onLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 60),

              // Logo and Title
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.shield, size: 48, color: AppTheme.primary),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Aapda Setu',
                        style: Theme.of(context).textTheme.headlineLarge
                            ?.copyWith(
                              color: AppTheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Text(
                        'Emergency Response',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 60),

              // Welcome Text
              Text('Welcome', style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 8),
              Text(
                'Login to access emergency services',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppTheme.mutedForeground,
                ),
              ),
              const SizedBox(height: 40),

              // Phone Number Input
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Phone Number',
                    style: Theme.of(context).textTheme.labelMedium,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.inputBackground,
                          border: Border.all(color: AppTheme.border),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.phone,
                              size: 16,
                              color: AppTheme.mutedForeground,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '+91',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          maxLength: 10,
                          enabled: !_otpSent,
                          decoration: const InputDecoration(
                            hintText: '10-digit number',
                            counterText: '',
                          ),
                          onChanged: (value) {
                            // Filter to digits only
                            final filtered = value.replaceAll(
                              RegExp(r'[^0-9]'),
                              '',
                            );
                            if (filtered != value) {
                              _phoneController.value = TextEditingValue(
                                text: filtered,
                                selection: TextSelection.collapsed(
                                  offset: filtered.length,
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // OTP Input (shown after OTP sent)
              if (_otpSent) ...[
                const SizedBox(height: 24),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Enter OTP',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _otpController,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      decoration: const InputDecoration(
                        hintText: '6-digit OTP',
                        counterText: '',
                      ),
                      onChanged: (value) {
                        final filtered = value.replaceAll(
                          RegExp(r'[^0-9]'),
                          '',
                        );
                        if (filtered != value) {
                          _otpController.value = TextEditingValue(
                            text: filtered,
                            selection: TextSelection.collapsed(
                              offset: filtered.length,
                            ),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ],

              const SizedBox(height: 32),

              // Action Button
              SizedBox(
                width: double.infinity,
                child: !_otpSent
                    ? ElevatedButton(
                        onPressed: _loading ? null : _handleSendOtp,
                        child: Text(_loading ? 'Sending...' : 'Send OTP'),
                      )
                    : Column(
                        children: [
                          ElevatedButton(
                            onPressed: _loading ? null : _handleVerifyOtp,
                            child: Text(
                              _loading ? 'Verifying...' : 'Verify & Login',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _otpSent = false;
                                _otpController.clear();
                              });
                            },
                            child: const Text('Change Number'),
                          ),
                        ],
                      ),
              ),

              const SizedBox(height: 32),

              // Terms and Privacy
              Text(
                'By continuing, you agree to our Terms of Service and Privacy Policy',
                textAlign: TextAlign.center,
                style: Theme.of(
                  context,
                ).textTheme.bodySmall?.copyWith(fontSize: 11),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
