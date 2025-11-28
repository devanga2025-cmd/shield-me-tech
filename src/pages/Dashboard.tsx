import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Shield,
  LogOut,
  Heart,
  Info,
  User
} from "lucide-react";
import { LivePhotoCapture } from "@/components/LivePhotoCapture";
import { LiveVideoRecorder, LiveVideoRecorderRef } from "@/components/LiveVideoRecorder";
import { LiveAudioRecorder, LiveAudioRecorderRef } from "@/components/LiveAudioRecorder";
import { FeedbackForm } from "@/components/FeedbackForm";
import LocationMap from "@/components/LocationMap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const videoRecorderRef = useRef<LiveVideoRecorderRef>(null);
  const audioRecorderRef = useRef<LiveAudioRecorderRef>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      toast.error("Please login to access the dashboard");
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  const handleEmergencyAlert = () => {
    setShowEmergencyInfo(true);
    toast.success("Emergency alert activated! Help is on the way!", {
      duration: 5000,
    });

    // Start video and audio recording automatically
    videoRecorderRef.current?.startRecording();
    audioRecorderRef.current?.startRecording();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.info(`Location shared: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          toast.error("Unable to access location. Please enable location services.");
        }
      );
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Women Safety Portal</h1>
                <p className="text-white/80 text-sm">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Alert Section */}
        <Card className="mb-8 shadow-glow border-2 border-destructive/20 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              Emergency Alert
            </CardTitle>
            <CardDescription>
              Press the button below in case of emergency
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button
              variant="emergency"
              size="lg"
              onClick={handleEmergencyAlert}
              className="w-full max-w-md mx-auto text-lg h-16"
            >
              <AlertTriangle className="w-6 h-6 mr-2" />
              ACTIVATE EMERGENCY ALERT
            </Button>

            {showEmergencyInfo && (
              <div className="bg-muted p-6 rounded-lg animate-scale-in space-y-6">
                <h3 className="font-bold text-xl mb-4 text-destructive flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6" />
                  We are here to help you!
                </h3>
                {location && (
                  <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}


                {/* Location Map */}
                {location && (
                  <div className="mt-4">
                    <LocationMap location={location} />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      💡 Update your Mapbox token in <code className="bg-muted px-1 py-0.5 rounded">src/config/mapbox.ts</code>
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Emergency Contacts
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>National Emergency: 112</li>
                      <li>Women Helpline: 1091</li>
                      <li>Police: 100</li>
                      <li>Ambulance: 102</li>
                    </ul>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Nearby Safe Places
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>Police Station (0.5 km)</li>
                      <li>Hospital (1.2 km)</li>
                      <li>Women's Shelter (2.3 km)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Safety Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                Safety Tips & Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Essential Safety Tips:</h3>
                <ul className="space-y-2 text-sm list-disc list-inside">
                  <li>Always inform someone about your whereabouts</li>
                  <li>Keep emergency contacts on speed dial</li>
                  <li>Trust your instincts and avoid unsafe situations</li>
                  <li>Stay in well-lit and populated areas at night</li>
                  <li>Keep your phone charged and accessible</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Important Helpline Numbers:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>National Emergency:</span>
                    <a href="tel:112" className="text-primary hover:underline font-medium">112</a>
                  </div>
                  <div className="flex justify-between">
                    <span>Women Helpline:</span>
                    <a href="tel:1091" className="text-primary hover:underline font-medium">1091</a>
                  </div>
                  <div className="flex justify-between">
                    <span>Domestic Violence:</span>
                    <a href="tel:181" className="text-primary hover:underline font-medium">181</a>
                  </div>
                  <div className="flex justify-between">
                    <span>Cyber Crime:</span>
                    <a href="tel:155620" className="text-primary hover:underline font-medium">1930</a>
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/KVpxP3ZZtAc"
                  title="Women Safety Awareness"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* User Profile & Live Capture */}
          <div className="space-y-8">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{currentUser.phone}</span>
                    </div>
                  )}
                  {currentUser.address && (
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium">{currentUser.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <LivePhotoCapture />
          </div>
        </div>

        {/* Live Recording & Feedback Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <LiveVideoRecorder ref={videoRecorderRef} />
          <LiveAudioRecorder ref={audioRecorderRef} />
        </div>

        <div className="mt-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
