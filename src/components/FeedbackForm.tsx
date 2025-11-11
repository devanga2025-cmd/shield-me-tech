import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      toast.success("Feedback submitted successfully! Thank you for helping us improve.");
      setFeedback("");
    } else {
      toast.error("Please enter your feedback");
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Share Your Feedback
        </CardTitle>
        <CardDescription>
          Help us improve the platform by sharing your thoughts and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience, suggestions for improvement, or any concerns..."
              className="min-h-[120px]"
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
