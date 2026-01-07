import admin from '../config/firebase';

interface FCMNotification {
    title: string;
    body: string;
    data?: any;
}

export class FCMService {
    /**
     * Send notification to specific device
     */
    static async sendToDevice(fcmToken: string, notification: FCMNotification): Promise<boolean> {
        try {
            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data: notification.data || {},
                token: fcmToken
            };

            await admin.messaging().send(message);
            console.log(`FCM sent to device: ${fcmToken}`);
            return true;
        } catch (error: any) {
            console.error('FCM send failed:', error.message);
            return false;
        }
    }

    /**
     * Send notification to topic (for alerts)
     */
    static async sendToTopic(topic: string, notification: FCMNotification): Promise<boolean> {
        try {
            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data: notification.data || {},
                topic: topic
            };

            await admin.messaging().send(message);
            console.log(`FCM sent to topic: ${topic}`);
            return true;
        } catch (error: any) {
            console.error('FCM topic send failed:', error.message);
            return false;
        }
    }

    /**
     * Send to multiple devices (for geofenced alerts)
     */
    static async sendToMultipleDevices(tokens: string[], notification: FCMNotification): Promise<number> {
        if (tokens.length === 0) return 0;

        try {
            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body
                },
                data: notification.data || {},
                tokens: tokens
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`FCM sent to ${response.successCount}/${tokens.length} devices`);
            return response.successCount;
        } catch (error: any) {
            console.error('FCM multicast failed:', error.message);
            return 0;
        }
    }

    /**
     * Send alert to users in radius
     */
    static async sendAlertToRadius(alert: any, userTokens: string[]): Promise<void> {
        const notification: FCMNotification = {
            title: `🚨 ${alert.severity.toUpperCase()} Alert: ${alert.type}`,
            body: alert.message,
            data: {
                type: 'alert',
                alert_id: alert.alert_id,
                severity: alert.severity,
                coordinates: JSON.stringify(alert.center.coordinates)
            }
        };

        await this.sendToMultipleDevices(userTokens, notification);
    }

    /**
     * Notify user about report verification
     */
    static async notifyReportVerified(userToken: string, report: any, status: string): Promise<void> {
        const notification: FCMNotification = {
            title: status === 'verified' ? '✅ Report Verified' : '❌ Report Rejected',
            body: `Your report "${report.title}" has been ${status}`,
            data: {
                type: 'report_verification',
                report_id: report.report_id,
                status: status
            }
        };

        await this.sendToDevice(userToken, notification);
    }
}
