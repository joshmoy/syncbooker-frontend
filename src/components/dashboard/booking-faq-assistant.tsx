"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerateBookingFaqs } from "@/hooks/use-event-types";
import type { EventTypeFaq } from "@/types/event-type";

interface BookingFaqAssistantProps {
  title: string;
  description?: string;
  onApplyFaqs: (faqs: EventTypeFaq[]) => void;
}

export function BookingFaqAssistant({
  title,
  description,
  onApplyFaqs,
}: BookingFaqAssistantProps) {
  const generateBookingFaqs = useGenerateBookingFaqs();
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const faqs = generateBookingFaqs.data?.faqs ?? [];
  const provider = generateBookingFaqs.data?.provider;

  const handleGenerate = () => {
    if (!title.trim()) {
      toast.error("Add an event title first so the FAQ assistant has enough context.");
      return;
    }

    generateBookingFaqs.mutate({
      title,
      description,
      businessType: businessType || undefined,
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
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span className="label-sm text-muted-foreground">AI Assistant</span>
                </div>
                <CardTitle className="heading-sm">Booking Page FAQ Assistant</CardTitle>
                <p className="body-sm mt-2 max-w-2xl text-muted-foreground">
                  {isExpanded
                    ? "Generate questions and answers visitors commonly need before they book."
                    : "Tap to open intelligence-powered FAQ generation for this booking page."}
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
                <Label htmlFor="booking-faq-business-type">Business type</Label>
                <Input
                  id="booking-faq-business-type"
                  placeholder="e.g., coaching, consulting, recruiting"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-faq-audience">Audience</Label>
                <Input
                  id="booking-faq-audience"
                  placeholder="e.g., startup founders, job candidates, clients"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={generateBookingFaqs.isPending}
                className="bg-[linear-gradient(135deg,#4285f4,#7b61ff_40%,#34a853)] text-white shadow-sm hover:opacity-95"
              >
                {generateBookingFaqs.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate FAQs
                  </>
                )}
              </Button>

              {provider && (
                <p className="body-sm text-muted-foreground">
                  {provider === "gemini"
                    ? "Using intelligence-powered suggestions."
                    : "Using the built-in FAQ generator fallback."}
                </p>
              )}
            </div>

            {faqs.length > 0 && (
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={`${faq.question}-${index}`}
                    className="rounded-xl border border-border/80 bg-muted/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                  >
                    <p className="body-sm font-medium text-foreground">{faq.question}</p>
                    <p className="body-sm mt-2 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onApplyFaqs(faqs);
                    toast.success("FAQs applied to this event.");
                  }}
                >
                  Use These FAQs
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
