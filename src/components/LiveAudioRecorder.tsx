import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, X } from "lucide-react";
import { toast } from "sonner";

export const LiveAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Audio recording started");
    } catch (error) {
      toast.error("Unable to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Audio recording stopped");
    }
  };

  const clearAudio = () => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }
    setRecordedAudio(null);
    setRecordingTime(0);
    toast.info("Audio cleared");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-6 h-6 text-primary" />
          Live Audio Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRecording && !recordedAudio && (
          <Button onClick={startRecording} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="bg-muted p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording...</span>
              </div>
              <div className="text-3xl font-bold">{formatTime(recordingTime)}</div>
            </div>
            <Button onClick={stopRecording} variant="destructive" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        )}

        {recordedAudio && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <audio src={recordedAudio} controls className="w-full" />
            </div>
            <Button onClick={clearAudio} variant="outline" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Clear Audio
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
