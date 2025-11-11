import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Square, Play, X } from "lucide-react";
import { toast } from "sonner";

export const LiveVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        stopStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Unable to access camera/microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const clearVideo = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    toast.info("Video cleared");
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-6 h-6 text-primary" />
          Live Video Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRecording && !recordedVideo && (
          <Button onClick={startRecording} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-muted"
            />
            <Button onClick={stopRecording} variant="destructive" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        )}

        {recordedVideo && (
          <div className="space-y-4">
            <video
              src={recordedVideo}
              controls
              className="w-full rounded-lg bg-muted"
            />
            <Button onClick={clearVideo} variant="outline" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Clear Video
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
