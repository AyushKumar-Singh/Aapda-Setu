import { motion } from 'motion/react';
import { Radio, AlertTriangle, MapPin, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockAlerts } from '../utils/mockData';
import type { DisasterType, AlertStatus } from '../utils/mockData';

export function AlertsPage() {
  const getDisasterIcon = (type: DisasterType) => {
    switch (type) {
      case 'fire':
        return (
          <svg className="h-5 w-5 text-[rgb(255,71,58)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 23a7.5 7.5 0 0 0 7.5-7.5c0-7.5-7.5-13.5-7.5-13.5S4.5 8 4.5 15.5A7.5 7.5 0 0 0 12 23z" />
          </svg>
        );
      case 'flood':
        return (
          <svg className="h-5 w-5 text-[rgb(0,82,255)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        );
      case 'earthquake':
        return (
          <svg className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h3l3-9 6 18 3-9h3" />
          </svg>
        );
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="flex items-center gap-2">
          <Radio className="h-6 w-6 text-[rgb(255,71,58)] animate-pulse" />
          Live Alerts
        </h2>
        <p className="text-muted-foreground">
          Real-time disaster alerts and emergency notifications
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Input placeholder="Search by location, type..." className="w-full" />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Disaster Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="accident">Accident</SelectItem>
                    <SelectItem value="landslide">Landslide</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {mockAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      alert.severity === 'critical'
                        ? 'bg-destructive/10'
                        : alert.severity === 'high'
                        ? 'bg-[rgb(255,71,58)]/10'
                        : alert.severity === 'medium'
                        ? 'bg-warning/10'
                        : 'bg-[rgb(0,82,255)]/10'
                    }`}
                  >
                    {getDisasterIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3>{alert.title}</h3>
                          <p className="text-muted-foreground">{alert.description}</p>
                        </div>
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
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(alert.reportedAt).toLocaleString()}</span>
                      </div>
                      {alert.verification === 'ai-verified' && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          AI Verified {alert.confidenceScore}%
                        </Badge>
                      )}
                    </div>
                    {alert.responseTeams && alert.responseTeams.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-muted-foreground text-sm">Response Teams:</span>
                        {alert.responseTeams.map((team, i) => (
                          <Badge key={i} variant="secondary">
                            {team}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
