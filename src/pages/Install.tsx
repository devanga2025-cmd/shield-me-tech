import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, CheckCircle } from "lucide-react";
import appLogo from "@/assets/app-logo.jpg";
import { Link } from "react-router-dom";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <img src={appLogo} alt="Safety SheIld Logo" className="mx-auto w-24 h-24 rounded-2xl shadow-soft" />
          <CardTitle className="text-3xl">Install Safety SheIld</CardTitle>
          <CardDescription className="text-base">
            Get quick access to emergency features right from your home screen
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Instant Emergency Access</p>
                <p className="text-sm text-muted-foreground">Launch emergency alerts with one tap</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Works Offline</p>
                <p className="text-sm text-muted-foreground">Access safety resources even without internet</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">No App Store Needed</p>
                <p className="text-sm text-muted-foreground">Install directly from your browser</p>
              </div>
            </div>
          </div>

          {isInstallable ? (
            <Button 
              onClick={handleInstallClick}
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Install App
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="w-4 h-4" />
                  How to Install:
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>On iPhone:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Tap the Share button (square with arrow)</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right</li>
                  </ol>
                  
                  <p className="pt-2"><strong>On Android:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Tap the menu (three dots) in your browser</li>
                    <li>Tap "Install app" or "Add to Home screen"</li>
                    <li>Tap "Install"</li>
                  </ol>
                </div>
              </div>
              
              <Button 
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Link to="/">Continue to App</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;