"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateEventTypeIdeas } from "@/hooks/use-event-types";
import type { EventTypeDraft } from "@/types/event-type";

interface EventTypeGeneratorAssistantProps {
  onApplySuggestion: (suggestion: EventTypeDraft) => void;
  defaultExpanded?: boolean;
}

const colorLabels: Record<string, string> = {
  "#3B82F6": "Blue",
  "#10B981": "Green",
  "#F59E0B": "Amber",
  "#EF4444": "Red",
  "#8B5CF6": "Purple",
  "#EC4899": "Pink",
  "#6B7280": "Gray",
};

export function EventTypeGeneratorAssistant({
  onApplySuggestion,
  defaultExpanded = true,
}: EventTypeGeneratorAssistantProps) {
  const generateEventTypeIdeas = useGenerateEventTypeIdeas();
  const [prompt, setPrompt] = useState("");
  const [audience, setAudience] = useState("");
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const suggestions = generateEventTypeIdeas.data?.suggestions ?? [];
  const provider = generateEventTypeIdeas.data?.provider;

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Describe the kind of event you want to create first.");
      return;
    }

    generateEventTypeIdeas.mutate({
      prompt,
      audience: audience || undefined,
    });
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
          <CardHeader className="transition-colors hover:bg-muted/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span className="label-sm text-muted-foreground">Intelligence Builder</span>
                </div>
                <CardTitle className="heading-sm">Event Type Generator</CardTitle>
                <p className="body-sm mt-2 max-w-2xl text-muted-foreground">
                  {isExpanded
                    ? "Describe your offer in plain English and get a few ready-to-use event drafts."
                    : "Tap to open the event type generator."}
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
            <div className="space-y-2">
              <Label htmlFor="event-type-generator-prompt">What do you offer?</Label>
              <Textarea
                id="event-type-generator-prompt"
                rows={4}
                placeholder="e.g., I offer 20-minute intro calls for new leads and 60-minute strategy sessions for founders who want deeper help."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type-generator-audience">Audience</Label>
              <Input
                id="event-type-generator-audience"
                placeholder="e.g., startup founders, applicants, coaching clients"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateEventTypeIdeas.isPending}
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
                    Generate Event Ideas
                  </>
                )}
              </Button>

              {provider && (
                <p className="body-sm text-muted-foreground">
                  {provider === "gemini"
                    ? "Using intelligence-powered suggestions."
                    : "Using the built-in event generator fallback."}
                </p>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.title}-${index}`}
                    className="rounded-xl border border-border/80 bg-muted/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="body-sm font-medium text-foreground">{suggestion.title}</p>
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: suggestion.color }}
                          />
                        </div>
                        <p className="body-sm text-muted-foreground">
                          {suggestion.durationMinutes} minutes
                          {colorLabels[suggestion.color] ? ` • ${colorLabels[suggestion.color]}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          onApplySuggestion(suggestion);
                          toast.success("Event draft applied.");
                        }}
                      >
                        Use This Draft
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
