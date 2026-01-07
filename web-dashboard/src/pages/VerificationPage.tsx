import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Image, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { mockReports } from '../utils/mockData';
import { toast } from 'sonner@2.0.3';

export function VerificationPage() {
  const pendingReports = mockReports.filter((report) => report.status === 'pending');

  const handleVerify = (reportId: string, action: 'verify' | 'reject') => {
    toast.success(
      action === 'verify'
        ? `Report ${reportId} verified successfully`
        : `Report ${reportId} rejected`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-[rgb(0,209,178)]" />
          Report Verification
        </h2>
        <p className="text-muted-foreground">
          Verify incoming disaster reports with AI assistance
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Pending</p>
                <h3>{pendingReports.length}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">AI Accuracy</p>
                <h3>91.5%</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Verified Today</p>
                <h3>12</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-[rgb(0,209,178)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Queue */}
      <div className="space-y-4">
        {mockReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{report.id}</CardTitle>
                    <p className="text-muted-foreground">
                      Reported by {report.userName} • {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      report.status === 'verified'
                        ? 'default'
                        : report.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">Disaster Type</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>{report.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Description</p>
                      <p className="mt-1">{report.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground">AI Confidence Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              report.aiConfidence > 70
                                ? 'bg-success'
                                : report.aiConfidence > 40
                                ? 'bg-warning'
                                : 'bg-destructive'
                            }`}
                            style={{ width: `${report.aiConfidence}%` }}
                          ></div>
                        </div>
                        <span
                          className={
                            report.aiConfidence > 70
                              ? 'text-success'
                              : report.aiConfidence > 40
                              ? 'text-warning'
                              : 'text-destructive'
                          }
                        >
                          {report.aiConfidence}%
                        </span>
                      </div>
                    </div>
                    {report.photos.length > 0 && (
                      <div>
                        <p className="text-muted-foreground">Photos</p>
                        <div className="flex gap-2 mt-1">
                          {report.photos.map((photo, i) => (
                            <div
                              key={i}
                              className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center"
                            >
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {report.verificationNotes && (
                  <div>
                    <p className="text-muted-foreground">Verification Notes</p>
                    <p className="mt-1 text-sm">{report.verificationNotes}</p>
                  </div>
                )}

                {report.status === 'pending' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground mb-2">Verification Notes (Optional)</p>
                      <Textarea placeholder="Add notes about this verification..." />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerify(report.id, 'verify')}
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Report
                      </Button>
                      <Button
                        onClick={() => handleVerify(report.id, 'reject')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Report
                      </Button>
                      <Button variant="outline">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Needs Review
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
