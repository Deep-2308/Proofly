"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, Square, Check, Loader2, Volume2, AlertCircle } from "lucide-react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface InterviewData {
  id: string;
  role: string;
  difficulty: string;
  questionCount: number;
  status: "setup" | "in_progress" | "completed" | "abandoned";
  turns: { question: string; answer?: string }[];
}

export function InterviewRoom({ initialData }: { initialData: InterviewData }) {
  const router = useRouter();
  const [data, setData] = useState<InterviewData>(initialData);
  const [micGranted, setMicGranted] = useState<boolean>(false);
  const [micChecking, setMicChecking] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<"Listening..." | "Thinking..." | "Preparing your next question...">("Listening...");
  
  const [error, setError] = useState<string | null>(null);
  
  const { isRecording, startRecording, stopRecording, error: recorderError } = useMediaRecorder();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported } = useSpeechSynthesis();
  
  const currentQuestionNumber = data.turns.length === 0 ? 1 : data.turns.length;
  const currentQuestionText = data.turns.length > 0 ? data.turns[data.turns.length - 1].question : "Welcome to the interview.";
  
  // Ref to prevent double-submitting
  const isSubmitting = useRef(false);
  const hasInitialized = useRef(false);

  const submitTurn = async (audioBlob: Blob | null) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setProcessing(true);
    if (audioBlob) setProcessingState("Thinking...");
    setError(null);

    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append("audio", audioBlob, "audio.webm");
      }
      formData.append("turnIndex", String(data.turns.length));

      const res = await fetch(`/api/interviews/${data.id}/turn`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to process turn.");
      }

      const freshRes = await fetch(`/api/interviews/${data.id}`);
      const freshData = await freshRes.json();
      if (freshRes.ok && freshData.interview) {
        setData(freshData.interview);
      }

      if (result.isComplete) {
        setProcessing(true);
        setProcessingState("Preparing your next question...");
        await fetch(`/api/interviews/${data.id}/complete`, { method: "POST" });
        router.push(`/interviews/${data.id}/report`);
      } else if (result.spokenText) {
        speak(result.spokenText);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
      isSubmitting.current = false;
    }
  };

  useEffect(() => {
    if (data.status === "completed") {
      router.replace(`/interviews/${data.id}/report`);
    } else if (data.status === "setup" && !hasInitialized.current) {
      hasInitialized.current = true;
      submitTurn(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.status]);

  const checkMicrophone = async () => {
    setMicChecking(true);
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // close immediately
      stream.getTracks().forEach(t => t.stop());
      setMicGranted(true);
    } catch (err) {
      setMicError(err instanceof Error ? err.message : "Microphone access denied or unavailable.");
    } finally {
      setMicChecking(false);
    }
  };

  const handleStartRecording = async () => {
    if (isSpeaking) stopSpeaking();
    setError(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob || audioBlob.size === 0) {
      setError("No audio was recorded. Please try again.");
      return null;
    }
    return audioBlob;
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    
    setError(null);
    setProcessing(true);
    setProcessingState("Listening...");
    
    const audioBlob = await handleStopRecording();
    if (!audioBlob) {
      setProcessing(false);
      return;
    }

    await submitTurn(audioBlob);
  };



  if (data.status === "completed") {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-text-muted">Preparing your interview report...</p>
      </div>
    );
  }

  if (!micGranted) {
    return (
      <div className="mx-auto mt-10 max-w-md w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-surface p-6 shadow-sm text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Mic size={24} />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">Microphone Check</h2>
          <p className="text-text-muted text-sm mb-6">
            We need access to your microphone to capture your voice answers during the interview.
          </p>
          
          {micError && (
            <div className="mb-4 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500 flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              {micError}
            </div>
          )}

          <button
            onClick={checkMicrophone}
            disabled={micChecking}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {micChecking ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
            {micChecking ? "Checking..." : "Allow Microphone"}
          </button>
        </motion.div>
      </div>
    );
  }

  if (data.status === "setup") {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        {error ? (
          <div className="text-center space-y-4 max-w-md">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-500/10 text-red-500">
              <AlertCircle size={24} />
            </div>
            <p className="font-semibold text-text">Failed to start interview</p>
            <p className="text-sm text-text-muted">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                hasInitialized.current = false;
                submitTurn(null);
              }}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-text-muted">Starting interview...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div>
          <h1 className="font-heading text-lg font-bold text-text">{data.role}</h1>
          <p className="text-xs text-text-muted capitalize">Difficulty: {data.difficulty}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-text">Question {currentQuestionNumber} of {data.questionCount}</p>
          <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-border">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${(currentQuestionNumber / data.questionCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ERROR */}
      {(error || recorderError) && (
        <div className="mb-6 rounded-md border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error || recorderError}
          </div>
          {!processing && (
            <button onClick={() => setError(null)} className="hover:underline text-xs font-semibold">Dismiss</button>
          )}
        </div>
      )}

      {/* MAIN INTERVIEW AREA */}
      <motion.div 
        className="mb-6 flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 shadow-sm min-h-[300px]"
      >
        <div className="relative mb-6">
          {/* AI Avatar */}
          <div className="relative z-10 grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
            <Volume2 size={32} />
          </div>
          {/* Speaking Pulse Animation */}
          {isSpeaking && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 z-0 rounded-full bg-accent"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute inset-0 z-0 rounded-full bg-accent"
              />
            </>
          )}
        </div>

        {isSpeaking ? (
          <p className="text-center font-medium text-text animate-pulse">AI is speaking...</p>
        ) : processing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-center font-medium text-text-muted">{processingState}</p>
          </div>
        ) : (
          <div className="w-full max-w-xl text-center space-y-4">
            <p className="text-lg md:text-xl font-semibold text-text leading-relaxed">
              &quot;{currentQuestionText}&quot;
            </p>
            {!isSupported && (
              <p className="text-xs text-amber-500">
                Text-to-speech is unsupported in your browser. Please read the question above.
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* CONTROLS */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col items-center justify-center">
        {isRecording ? (
          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
              </span>
              Recording...
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                onClick={handleStopRecording}
                disabled={processing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md bg-surface-2 border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface-3 disabled:opacity-50"
              >
                <Square size={16} /> Stop
              </button>
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-sm"
              >
                <Check size={16} /> Submit Answer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStartRecording}
            disabled={processing || isSpeaking}
            className="flex w-full max-w-xs items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/85 hover:shadow-[0_0_20px_-6px_var(--accent)] disabled:opacity-50 disabled:hover:shadow-none"
          >
            <Mic size={18} />
            {isSpeaking ? "Wait for AI..." : "Start Recording"}
          </button>
        )}
      </div>
    </div>
  );
}
