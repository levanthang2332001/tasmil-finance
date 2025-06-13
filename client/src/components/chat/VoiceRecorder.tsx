"use client";

import { cn } from "@/lib/utils";
import { LoaderCircle, Mic, Square } from "lucide-react";
import MicRecorder from "mic-recorder-to-mp3";
import { useState } from "react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  setMessage: (transcript: string) => void;
  className?: string;
  disabled?: boolean;
}

const recorder = new MicRecorder({ bitRate: 128 });

export default function VoiceRecorder({ className, setMessage, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startRecording = () => {
    recorder.start().then(() => setIsRecording(true));
  };

  const stopRecording = async () => {
    const [buffer, blob] = await recorder.stop().getMp3();
    setIsRecording(false);

    const file = new File(buffer, "voice.mp3", {
      type: blob.type,
      lastModified: Date.now(),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/voice/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.transcript) {
        setMessage(data.transcript);
      } else {
        toast.error("Error transcribing audio");
      }
    } catch (error) {
      toast.error(`Error transcribing audio: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading || disabled}
      onClick={isRecording ? stopRecording : startRecording}
      className={cn(
        "flex items-center justify-center transition-all duration-200 ease-in-out",
        "hover:scale-105 active:scale-95 cursor-pointer",
        "rounded-full p-2",
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-crypto-blue hover:bg-crypto-blue/90 text-white",
        className
      )}
    >
      {isLoading ? (
        <LoaderCircle className="w-5 h-5 animate-spin" />
      ) : isRecording ? (
        <Square className="w-5 h-5 animate-pulse" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
