import { motion } from 'motion/react';
import { useState } from 'react';
import { Bell, Key, Save, Shield, Sliders, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../context/ThemeContext';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('ak-xxxxxxxxxxxxxxxxxxxxxxxx');
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    criticalAlerts: true,
    verificationRequired: true,
    systemAlerts: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2>Settings</h2>
        <p className="text-muted-foreground">
          Configure system preferences and disaster response settings
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure external services and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">System API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="flex-1"
                />
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
              <p className="text-muted-foreground">
                Secure key for accessing Aapda Setu services
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="maps-api">Maps API Key</Label>
              <Input
                id="maps-api"
                type="password"
                placeholder="Google Maps / Mapbox API key"
                defaultValue="gm-xxxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-muted-foreground">
                Required for interactive map features
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-api">SMS Gateway API</Label>
              <Input
                id="sms-api"
                type="password"
                placeholder="Twilio / AWS SNS credentials"
                defaultValue="tw-xxxxxxxxxxxxxxxxxxxxx"
              />
              <p className="text-muted-foreground">
                For sending emergency SMS alerts
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Configuration */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <CardTitle>Alert Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure AI verification and alert thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Confidence Threshold */}
            <div className="space-y-4">
              <div>
                <p className="mb-3">AI Verification Settings</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Confidence Threshold</Label>
                      <p className="text-muted-foreground">
                        Minimum AI score to auto-verify reports
                      </p>
                    </div>
                    <span className="text-primary">{confidenceThreshold[0]}%</span>
                  </div>
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Verification</Label>
                  <p className="text-muted-foreground">
                    Enable AI to auto-verify high confidence reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Manual Review Queue</Label>
                  <p className="text-muted-foreground">
                    Send low confidence reports for manual review
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            {/* Response Settings */}
            <div className="space-y-3">
              <p>Emergency Response Settings</p>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Dispatch Teams</Label>
                  <p className="text-muted-foreground">
                    Automatically notify response teams for critical alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Geofencing Alerts</Label>
                  <p className="text-muted-foreground">
                    Send alerts to users within affected areas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Real-time Tracking</Label>
                  <p className="text-muted-foreground">
                    Track response team locations on map
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how and when you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <p>Alert Types</p>
              <div className="flex items-center justify-between">
                <Label>Critical Alerts (Fire, Earthquake)</Label>
                <Switch
                  checked={notifications.criticalAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, criticalAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Verification Required</Label>
                <Switch
                  checked={notifications.verificationRequired}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, verificationRequired: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>System Alerts</Label>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, systemAlerts: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location & Coverage */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Location & Coverage</CardTitle>
            </div>
            <CardDescription>
              Configure geographical monitoring settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Coverage Radius</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  defaultValue="50"
                  min="1"
                  max="500"
                  className="w-24"
                />
                <span className="text-muted-foreground">kilometers</span>
              </div>
              <p className="text-muted-foreground">
                Alert radius for geofencing and notifications
              </p>
            </div>
            <div className="space-y-2">
              <Label>Primary Operating Region</Label>
              <Input placeholder="e.g., Delhi NCR, Mumbai, etc." />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>
              Manage security and data privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-muted-foreground">
                  Auto-logout after 30 minutes of inactivity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Data Retention</Label>
              <p className="text-muted-foreground">
                Alert and report data is retained for 90 days
              </p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-end"
      >
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </motion.div>
    </div>
  );
}
