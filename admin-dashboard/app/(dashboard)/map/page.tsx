'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useSWR from 'swr';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data.data);

export default function MapPage() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const { data: reportsData } = useSWR('/api/v1/reports?limit=100', fetcher, {
        refreshInterval: 60000
    });

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://demotiles.maplibre.org/style.json',
            center: [78.9629, 20.5937], // Center of India
            zoom: 4
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

        map.current.on('load', () => {
            setMapLoaded(true);
        });

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Add markers when reports data is loaded
    useEffect(() => {
        if (!map.current || !mapLoaded || !reportsData?.items) return;

        // Clear existing markers
        const markers = document.querySelectorAll('.maplibregl-marker');
        markers.forEach(marker => marker.remove());

        // Add markers for each report
        reportsData.items.forEach((report: any) => {
            const [lng, lat] = report.location.coordinates;

            // Color based on severity
            const colors = {
                low: '#84cc16',
                medium: '#f97316',
                high: '#ef4444',
                critical: '#dc2626'
            };

            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.backgroundColor = colors[report.severity as keyof typeof colors];
            el.style.width = '24px';
            el.style.height = '24px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            el.style.cursor = 'pointer';

            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${report.title}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${report.type} - ${report.severity}</p>
          <p style="font-size: 12px; margin-bottom: 4px;">${report.address.formatted}</p>
          <p style="font-size: 11px; color: #999;">
            ${new Date(report.created_at).toLocaleString()}
          </p>
        </div>
      `);

            new maplibregl.Marker({ element: el })
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current!);
        });
    }, [mapLoaded, reportsData]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Live Incident Map
                </h1>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {reportsData?.total || 0} incidents
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <div ref={mapContainer} className="w-full h-full" />
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    <span className="text-gray-600 dark:text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                    <span className="text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                    <span className="text-gray-600 dark:text-gray-400">High</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white"></div>
                    <span className="text-gray-600 dark:text-gray-400">Critical</span>
                </div>
            </div>
        </div>
    );
}
