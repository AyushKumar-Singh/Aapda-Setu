import { motion } from 'motion/react';
import { Map, MapPin, Layers, Navigation } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockAlerts } from '../utils/mockData';

export function MapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="flex items-center gap-2">
          <Map className="h-6 w-6 text-[rgb(0,82,255)]" />
          Map View
        </h2>
        <p className="text-muted-foreground">
          Interactive disaster map with real-time alert locations
        </p>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className="relative h-[600px] bg-gradient-to-br from-[rgb(0,82,255)]/5 via-background to-[rgb(0,209,178)]/5">
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-10 space-y-2">
              <Button variant="secondary" size="icon">
                <Layers className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Legend */}
            <div className="absolute top-4 right-4 z-10 glass p-4 rounded-lg space-y-2">
              <p>Legend</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[rgb(255,71,58)]"></div>
                  <span className="text-sm">Fire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[rgb(0,82,255)]"></div>
                  <span className="text-sm">Flood</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-warning"></div>
                  <span className="text-sm">Earthquake</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive"></div>
                  <span className="text-sm">Accident</span>
                </div>
              </div>
            </div>

            {/* Placeholder Map with Markers */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <MapPin className="h-16 w-16 text-[rgb(0,82,255)] mx-auto" />
                <div>
                  <p className="text-muted-foreground">
                    Map integration ready
                  </p>
                  <p className="text-muted-foreground">
                    Connect to Google Maps / Mapbox / OpenStreetMap
                  </p>
                </div>
              </div>
            </div>

            {/* Alert markers simulation */}
            {mockAlerts.slice(0, 5).map((alert, index) => (
              <div
                key={alert.id}
                className="absolute"
                style={{
                  top: `${20 + index * 15}%`,
                  left: `${15 + index * 20}%`,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative"
                >
                  <div
                    className={`h-4 w-4 rounded-full animate-ping absolute ${
                      alert.type === 'fire'
                        ? 'bg-[rgb(255,71,58)]'
                        : alert.type === 'flood'
                        ? 'bg-[rgb(0,82,255)]'
                        : alert.type === 'earthquake'
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-4 rounded-full relative ${
                      alert.type === 'fire'
                        ? 'bg-[rgb(255,71,58)]'
                        : alert.type === 'flood'
                        ? 'bg-[rgb(0,82,255)]'
                        : alert.type === 'earthquake'
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                  ></div>
                </motion.div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Map Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Active Markers</p>
                <h3>8</h3>
              </div>
              <Badge variant="destructive">High</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground">Coverage Area</p>
              <h3>250 km²</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground">Active Geofences</p>
              <h3>12</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground">Response Teams</p>
              <h3>24</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
