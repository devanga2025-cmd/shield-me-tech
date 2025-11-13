import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, Send } from "lucide-react";
import { toast } from "sonner";

export const LivePhotoCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success("Camera started");
    } catch (error) {
      toast.error("Unable to access camera");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL("image/png");
        setCapturedPhoto(photoData);
        stopCamera();
        toast.success("Photo captured successfully");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const clearPhoto = () => {
    setCapturedPhoto(null);
    toast.info("Photo cleared");
  };

  const submitPhoto = () => {
    if (capturedPhoto) {
      // Here you can send the photo to your backend or save it
      toast.success("Photo submitted successfully!");
      setCapturedPhoto(null);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          Live Photo Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!stream && !capturedPhoto && (
          <Button onClick={startCamera} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        )}

        {stream && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-muted"
            />
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                Capture Photo
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {capturedPhoto && (
          <div className="space-y-4">
            <img src={capturedPhoto} alt="Captured" className="w-full rounded-lg" />
            <div className="flex gap-2">
              <Button onClick={submitPhoto} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Submit Photo
              </Button>
              <Button onClick={clearPhoto} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};
