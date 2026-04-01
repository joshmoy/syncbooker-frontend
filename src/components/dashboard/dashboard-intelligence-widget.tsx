"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, MessageSquare, Mic, Sparkles, Square, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { eventTypesService } from "@/lib/event-types";
import {
  eventTypeKeys,
  useCreateEventType,
  useGenerateBookingFaqs,
  useGenerateEventTypeIdeas,
} from "@/hooks/use-event-types";
import type { EventTypeDraft } from "@/types/event-type";

type IntelligenceMessage =
  | {
      id: string;
      role: "assistant" | "user";
      text: string;
    }
  | {
      id: string;
      role: "user";
      text: string;
      audioDataUrl: string;
      durationSeconds: number;
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      suggestions: EventTypeDraft[];
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      createdEventTitle: string;
      createdEventId: string;
      createdEventDescription: string;
      faqsAdded?: boolean;
    };

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const STORAGE_KEY = "dashboard-intelligence-widget";
const MAX_VOICE_NOTE_MS = 90_000;
const defaultMessages: IntelligenceMessage[] = [
  {
    id: createId(),
    role: "assistant",
    text:
      "Describe what you offer, and I can turn it into event type drafts you can create right here.",
  },
];

const colorLabels: Record<string, string> = {
  "#3B82F6": "Blue",
  "#10B981": "Green",
  "#F59E0B": "Amber",
  "#EF4444": "Red",
  "#8B5CF6": "Purple",
  "#EC4899": "Pink",
  "#6B7280": "Gray",
};

function getDefaultMessages(): IntelligenceMessage[] {
  return defaultMessages.map((message) => ({
    ...message,
    id: createId(),
  }));
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the recorded audio."));
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read the recorded audio."));
    reader.readAsDataURL(blob);
  });
}

export function DashboardIntelligenceWidget() {
  const queryClient = useQueryClient();
  const generateEventTypeIdeas = useGenerateEventTypeIdeas();
  const generateBookingFaqs = useGenerateBookingFaqs();
  const createEventType = useCreateEventType(null);
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeCreateTitle, setActiveCreateTitle] = useState<string | null>(null);
  const [activeFaqEventId, setActiveFaqEventId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IntelligenceMessage[]>(getDefaultMessages);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);

  useEffect(() => {
    try {
      const storedState = window.localStorage.getItem(STORAGE_KEY);

      if (!storedState) {
        return;
      }

      const parsedState = JSON.parse(storedState) as {
        isOpen?: boolean;
        prompt?: string;
        messages?: IntelligenceMessage[];
      };

      setIsOpen(parsedState.isOpen ?? false);
      setPrompt(parsedState.prompt ?? "");
      setMessages(
        Array.isArray(parsedState.messages) && parsedState.messages.length > 0
          ? parsedState.messages
          : getDefaultMessages()
      );
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isOpen,
        prompt,
        messages,
      })
    );
  }, [hasHydrated, isOpen, prompt, messages]);

  const appendMessage = (message: IntelligenceMessage) => {
    setMessages((current) => [...current, message]);
  };

  const clearRecordingTimeout = () => {
    if (recordingTimeoutRef.current) {
      window.clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const resetRecorderState = () => {
    recordingChunksRef.current = [];
    recordingStartedAtRef.current = null;
    discardRecordingRef.current = false;
    mediaRecorderRef.current = null;
    setIsRecording(false);
    clearRecordingTimeout();
    stopMediaStream();
  };

  const stopVoiceNoteRecording = (discard = false) => {
    discardRecordingRef.current = discard;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      return;
    }

    resetRecorderState();
  };

  const resetChat = () => {
    stopVoiceNoteRecording(true);
    setPrompt("");
    setActiveCreateTitle(null);
    setActiveFaqEventId(null);
    setMessages(getDefaultMessages());
  };

  useEffect(() => {
    return () => {
      stopVoiceNoteRecording(true);
    };
  }, []);

  const updateEventFaqs = useMutation({
    mutationFn: ({
      id,
      faqs,
    }: {
      id: string;
      faqs: { question: string; answer: string }[];
    }) => eventTypesService.updateEventType(id, { faqs }),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.detail(variables.id) });
    },
  });

  const handleGenerate = () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    appendMessage({
      id: createId(),
      role: "user",
      text: trimmedPrompt,
    });
    setPrompt("");

    generateEventTypeIdeas.mutate(
      { prompt: trimmedPrompt },
      {
        onSuccess: (response) => {
          appendMessage({
            id: createId(),
            role: "assistant",
            text: "I drafted a few event types for you. Choose one and I’ll create it immediately.",
            suggestions: response.suggestions,
          });
        },
      }
    );
  };

  const handleCreateEvent = (suggestion: EventTypeDraft) => {
    setActiveCreateTitle(suggestion.title);

    createEventType.mutate(
      {
        title: suggestion.title,
        durationMinutes: suggestion.durationMinutes,
        description: suggestion.description,
        color: suggestion.color,
      },
      {
        onSuccess: (response) => {
          appendMessage({
            id: createId(),
            role: "assistant",
            text: `Created "${suggestion.title}" for you.`,
            createdEventTitle: suggestion.title,
            createdEventId: response.eventType.id,
            createdEventDescription: suggestion.description,
          });
          setActiveCreateTitle(null);
        },
        onError: () => {
          setActiveCreateTitle(null);
        },
      }
    );
  };

  const handleAddFaqs = (message: Extract<IntelligenceMessage, { createdEventId: string }>) => {
    setActiveFaqEventId(message.createdEventId);

    generateBookingFaqs.mutate(
      {
        title: message.createdEventTitle,
        description: message.createdEventDescription,
      },
      {
        onSuccess: (response) => {
          updateEventFaqs.mutate(
            {
              id: message.createdEventId,
              faqs: response.faqs,
            },
            {
              onSuccess: () => {
                setMessages((current) =>
                  current.map((entry) =>
                    entry.id === message.id
                      ? {
                          ...entry,
                          faqsAdded: true,
                          text: `Created "${message.createdEventTitle}" for you and added FAQs to help visitors book with more confidence.`,
                        }
                      : entry
                  )
                );
                setActiveFaqEventId(null);
              },
              onError: () => {
                setActiveFaqEventId(null);
              },
            }
          );
        },
        onError: () => {
          setActiveFaqEventId(null);
        },
      }
    );
  };

  const handleVoiceNoteToggle = async () => {
    if (isRecording) {
      stopVoiceNoteRecording();
      return;
    }

    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      toast.error("Voice notes are not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      discardRecordingRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const durationMs = Date.now() - (recordingStartedAtRef.current || Date.now());
        const shouldDiscard = discardRecordingRef.current;
        const audioBlob = new Blob(recordingChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        resetRecorderState();

        if (shouldDiscard || audioBlob.size === 0) {
          return;
        }

        try {
          const audioDataUrl = await blobToDataUrl(audioBlob);

          appendMessage({
            id: createId(),
            role: "user",
            text: "Voice note",
            audioDataUrl,
            durationSeconds: Math.max(1, Math.round(durationMs / 1000)),
          });

          appendMessage({
            id: createId(),
            role: "assistant",
            text:
              "Voice note saved. If you want event drafts from it, add a short text note with the offer details and I’ll take it from there.",
          });
        } catch {
          toast.error("We couldn't save that voice note. Please try again.");
        }
      };

      recorder.start();
      setIsRecording(true);
      recordingTimeoutRef.current = window.setTimeout(() => {
        stopVoiceNoteRecording();
        toast.message("Voice note stopped after 90 seconds.");
      }, MAX_VOICE_NOTE_MS);
    } catch {
      stopVoiceNoteRecording(true);
      toast.error("Microphone access is required to record a voice note.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
      {isOpen ? (
        <Card className="flex h-[min(75vh,680px)] w-[min(calc(100vw-2rem),420px)] flex-col overflow-hidden border-border/80 shadow-2xl">
          <CardHeader className="border-b border-border/80 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span className="label-sm text-muted-foreground">Intelligence Assistant</span>
                </div>
                <CardTitle className="heading-sm">Event Builder Chat</CardTitle>
                <p className="body-sm mt-2 text-muted-foreground">
                  Generate event drafts and create them without leaving the page.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-0">
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 p-4">
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-2xl px-4 py-3 shadow-sm ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card"
                        }`}
                      >
                        <p className="body-sm">{message.text}</p>

                        {"audioDataUrl" in message && (
                          <div className="mt-3 rounded-xl border border-border/80 bg-background/70 p-3">
                            <audio controls src={message.audioDataUrl} className="w-full" />
                            <p className="body-sm mt-2 text-muted-foreground">
                              {message.durationSeconds} second voice note
                            </p>
                          </div>
                        )}

                        {"suggestions" in message && message.suggestions.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {message.suggestions.map((suggestion, index) => {
                              const isCreating = activeCreateTitle === suggestion.title;

                              return (
                                <div
                                  key={`${suggestion.title}-${index}`}
                                  className="rounded-xl border border-border/80 bg-muted/30 p-4"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <p className="body-sm font-medium text-foreground">
                                          {suggestion.title}
                                        </p>
                                        <div
                                          className="h-3 w-3 rounded-full"
                                          style={{ backgroundColor: suggestion.color }}
                                        />
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                          {suggestion.durationMinutes} minutes
                                        </Badge>
                                        <Badge variant="outline">
                                          {colorLabels[suggestion.color] || "Styled"}
                                        </Badge>
                                      </div>
                                    </div>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => handleCreateEvent(suggestion)}
                                      disabled={isCreating || createEventType.isPending}
                                    >
                                      {isCreating ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Creating...
                                        </>
                                      ) : (
                                        "Create Event"
                                      )}
                                    </Button>
                                  </div>

                                  <p className="body-sm mt-3 text-muted-foreground">
                                    {suggestion.description}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {"createdEventTitle" in message && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link href={`/dashboard/events/${message.createdEventId}`}>
                              <Button variant="outline" size="sm">
                                Open Event Details
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                            {!message.faqsAdded && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddFaqs(message)}
                                disabled={
                                  activeFaqEventId === message.createdEventId ||
                                  generateBookingFaqs.isPending ||
                                  updateEventFaqs.isPending
                                }
                              >
                                {activeFaqEventId === message.createdEventId ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding FAQs...
                                  </>
                                ) : (
                                  "Add Intelligence Generated FAQs"
                                )}
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={resetChat}>
                              Create Another Event
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {generateEventTypeIdeas.isPending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="body-sm">Thinking through event ideas...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-border/80 p-4">
              <div className="space-y-3">
                <Textarea
                  rows={4}
                  placeholder="Try: I offer 20-minute intro calls for candidates and 60-minute paid strategy sessions for founders."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={handleVoiceNoteToggle}
                    className="min-w-[150px]"
                  >
                    {isRecording ? (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Record Voice Note
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generateEventTypeIdeas.isPending || isRecording}
                    className="bg-[linear-gradient(135deg,#4285f4,#7b61ff_40%,#34a853)] text-white shadow-sm hover:opacity-95"
                  >
                    {generateEventTypeIdeas.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Drafts
                      </>
                    )}
                  </Button>
                </div>
                <p className="body-sm text-muted-foreground">
                  Voice notes stay in this chat, and they reset when you start another event or log
                  out.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          size="lg"
          className="h-14 rounded-full bg-[linear-gradient(135deg,#4285f4,#7b61ff_40%,#34a853)] px-5 text-white shadow-xl hover:opacity-95"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Intelligence Assistant
        </Button>
      )}
    </div>
  );
}
