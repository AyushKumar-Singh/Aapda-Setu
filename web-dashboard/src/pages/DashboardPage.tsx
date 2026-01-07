import { motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  MapPin,
  TrendingUp,
  Activity,
  Radio,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  mockAlerts,
  dashboardStats,
  alertTrendData,
  disasterTypeDistribution,
  responseTimeData,
} from '../utils/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ElementType;
  iconColor: string;
  delay: number;
}

function StatCard({ title, value, change, changeType, icon: Icon, iconColor, delay }: StatCardProps) {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
            {change && (
              <p className={`text-sm font-medium mt-1 ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                {change} from last month
              </p>
            )}
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-soft ${iconColor}`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const activeAlerts = mockAlerts.filter((alert) => alert.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Disaster Management Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time monitoring and AI-powered disaster response system
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            System Active
          </Badge>
          <Badge variant="secondary">AI Verification: ON</Badge>
          <Badge variant="secondary">Response Teams: 24 Active</Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Alerts"
          value={dashboardStats.activeAlerts}
          change="+2"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="bg-[rgb(255,71,58)]"
          delay={0}
        />
        <StatCard
          title="Verified Today"
          value={dashboardStats.verifiedToday}
          change="+3"
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-[rgb(34,197,94)]"
          delay={0.1}
        />
        <StatCard
          title="Avg Response Time"
          value={`${dashboardStats.avgResponseTime} min`}
          change="-2 min"
          changeType="positive"
          icon={Clock}
          iconColor="bg-[rgb(0,82,255)]"
          delay={0.2}
        />
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers}
          change="+15"
          changeType="positive"
          icon={Users}
          iconColor="bg-[rgb(0,209,178)]"
          delay={0.3}
        />
      </div>

      {/* AI System Status */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-[rgb(0,82,255)]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[rgb(0,82,255)]" />
                    AI Verification System
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Real-time disaster report validation
                  </p>
                </div>
                <Badge className="bg-success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span>{dashboardStats.aiAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Auto-Verified</span>
                  <span className="text-success">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Manual Review</span>
                  <span className="text-warning">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="text-destructive">7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-[rgb(0,209,178)]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[rgb(0,209,178)]" />
                    Response Teams
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Emergency response coordination
                  </p>
                </div>
                <Badge className="bg-success">{dashboardStats.responseTeams} Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Fire Brigade</span>
                  <span>8 Teams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">NDRF</span>
                  <span>5 Teams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Medical</span>
                  <span>6 Teams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Local Police</span>
                  <span>5 Teams</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alert Trend Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Alert Trend Analysis</CardTitle>
              <p className="text-muted-foreground">
                Monthly alerts reported and resolved
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={alertTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="rgb(255,71,58)"
                    strokeWidth={2}
                    name="Total Alerts"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="rgb(34,197,94)"
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disaster Type Distribution */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Disaster Type Distribution</CardTitle>
              <p className="text-muted-foreground">
                Breakdown by disaster category
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={disasterTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {disasterTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Active Alerts */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-[rgb(255,71,58)] animate-pulse" />
                  Live Active Alerts
                </CardTitle>
                <p className="text-muted-foreground">
                  Critical alerts requiring immediate attention
                </p>
              </div>
              <Button variant="outline">View All Alerts</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.slice(0, 4).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          alert.severity === 'critical'
                            ? 'bg-destructive/10'
                            : alert.severity === 'high'
                            ? 'bg-[rgb(255,71,58)]/10'
                            : alert.severity === 'medium'
                            ? 'bg-warning/10'
                            : 'bg-[rgb(0,82,255)]/10'
                        }`}
                      >
                        {alert.type === 'fire' ? (
                          <svg className="h-5 w-5 text-[rgb(255,71,58)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 23a7.5 7.5 0 0 0 7.5-7.5c0-7.5-7.5-13.5-7.5-13.5S4.5 8 4.5 15.5A7.5 7.5 0 0 0 12 23z" />
                          </svg>
                        ) : alert.type === 'flood' ? (
                          <svg className="h-5 w-5 text-[rgb(0,82,255)]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                        ) : alert.type === 'earthquake' ? (
                          <svg className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h3l3-9 6 18 3-9h3" />
                          </svg>
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p>{alert.title}</p>
                          <Badge
                            variant={
                              alert.severity === 'critical' || alert.severity === 'high'
                                ? 'destructive'
                                : alert.severity === 'medium'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {alert.severity}
                          </Badge>
                          {alert.verification === 'ai-verified' && (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              AI Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}</span>
                          </div>
                          <span>•</span>
                          <span>{new Date(alert.reportedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="text-success">{alert.confidenceScore}%</p>
                    </div>
                  </div>
                  {alert.responseTeams && alert.responseTeams.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-muted-foreground text-sm">Response Teams:</span>
                      {alert.responseTeams.map((team, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {team}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}