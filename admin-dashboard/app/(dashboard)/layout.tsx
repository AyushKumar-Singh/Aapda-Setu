export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // No authentication required for prototype
    return <>{children}</>;
}
