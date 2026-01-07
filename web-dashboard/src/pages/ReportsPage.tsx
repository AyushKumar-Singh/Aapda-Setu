import { motion } from 'motion/react';
import { FileText, Plus, Download } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockReports } from '../utils/mockData';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-[rgb(0,82,255)]" />
              Incident Reports
            </h2>
            <p className="text-muted-foreground">
              All submitted disaster reports and their verification status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">Report ID</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Reported By</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">AI Score</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="border-b hover:bg-accent/5 transition-colors"
                    >
                      <td className="px-6 py-4">{report.id}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{report.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{report.location}</td>
                      <td className="px-6 py-4">{report.userName}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
