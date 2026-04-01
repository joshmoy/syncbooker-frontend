"use client";

import { useState } from "react";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateBookingCopy } from "@/hooks/use-event-types";
import type {
  BookingCopySuggestion,
  BookingCopyTone,
} from "@/types/event-type";

const toneOptions: Array<{ value: BookingCopyTone; label: string }> = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "consultative", label: "Consultative" },
  { value: "sales", label: "Sales" },
  { value: "supportive", label: "Supportive" },
];

interface BookingCopyAssistantProps {
  title: string;
  durationMinutes?: number;
  existingDescription?: string;
  onApplySuggestion: (suggestion: BookingCopySuggestion) => void;
}

export function BookingCopyAssistant({
  title,
  durationMinutes,
  existingDescription,
  onApplySuggestion,
}: BookingCopyAssistantProps) {
  const generateBookingCopy = useGenerateBookingCopy();
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<BookingCopyTone>("professional");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestions = generateBookingCopy.data?.suggestions ?? [];
  const provider = generateBookingCopy.data?.provider;

  const handleGenerate = () => {
    if (!title.trim()) {
      toast.error("Add an event title first so the assistant has something to work with.");
      return;
    }

    generateBookingCopy.mutate({
      title,
      durationMinutes,
      audience: audience || undefined,
      goal: goal || undefined,
      tone,
      additionalContext: additionalContext || undefined,
      existingDescription: existingDescription || undefined,
    });
  };

  const handleApply = (suggestion: BookingCopySuggestion) => {
    onApplySuggestion(suggestion);
    toast.success("Copy applied to your event.");
  };

  return (
    <div className="gemini-frame rounded-[1.35rem] p-px">
      <Card className="overflow-hidden rounded-[calc(1.35rem-1px)] border-0 bg-background/95 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="block w-full text-left"
          aria-expanded={isExpanded}
        >
          <CardHeader className="relative overflow-hidden transition-colors hover:bg-muted/20">
            <div className="pointer-events-none absolute inset-0" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span className="label-sm text-muted-foreground">AI Assistant</span>
                </div>
                <CardTitle className="heading-sm flex items-center gap-2">
                  Booking Page Copy Assistant
                </CardTitle>
                <p className="body-sm mt-2 max-w-2xl text-muted-foreground">
                  {isExpanded
                    ? "Generate clearer booking copy from your event title, audience, and goal."
                    : "Tap to open intelligence-powered copy suggestions for this booking page."}
                </p>
              </div>
              <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/85">
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </CardHeader>
        </button>
        {isExpanded && (
          <CardContent className="space-y-5 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-copy-audience">Who is this for?</Label>
                <Input
                  id="booking-copy-audience"
                  placeholder="e.g., founders, candidates, new leads"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-copy-goal">What should this call help with?</Label>
                <Input
                  id="booking-copy-goal"
                  placeholder="e.g., qualify fit, answer questions, plan next steps"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-copy-tone">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as BookingCopyTone)}>
                  <SelectTrigger id="booking-copy-tone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-copy-context">Extra details</Label>
                <Textarea
                  id="booking-copy-context"
                  placeholder="Anything worth mentioning, like pricing context, prep expectations, or what happens after the call"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateBookingCopy.isPending}
                className="bg-[linear-gradient(135deg,#4285f4,#7b61ff_40%,#34a853)] text-white shadow-sm hover:opacity-95"
              >
                {generateBookingCopy.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Copy
                  </>
                )}
              </Button>

              {provider && (
                <p className="body-sm text-muted-foreground">
                  {provider === "gemini"
                    ? "Using your configured Gemini model."
                    : "Using the built-in copy generator fallback."}
                </p>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.label}-${index}`}
                    className="rounded-xl border border-border/80 bg-muted/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="body-sm font-medium text-foreground">{suggestion.label}</p>
                        <h4 className="heading-sm mt-1">{suggestion.title}</h4>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleApply(suggestion)}
                      >
                        Use this copy
                      </Button>
                    </div>
                    <p className="body-sm mt-3 text-muted-foreground">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
