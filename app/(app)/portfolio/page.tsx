"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Wand2, Eye, Link as LinkIcon, Loader2 } from "lucide-react";
import { PortfolioContent } from "@/lib/portfolio/schema";

export default function PortfolioBuilderPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<{
    id: string;
    slug: string;
    theme: string;
    isPublic: boolean;
    draftContent?: PortfolioContent;
    publishedContent?: PortfolioContent;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (portfolio?.draftContent) {
      if (!confirm("Generate a new portfolio draft? Your current edits will be replaced.")) {
        return;
      }
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/portfolio/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      } else {
        alert("Failed to generate portfolio. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/portfolio/publish", { method: "POST" });
      if (res.ok) {
        await fetchPortfolio();
      } else {
        alert("Failed to publish portfolio.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to publish portfolio.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      const res = await fetch("/api/portfolio/unpublish", { method: "POST" });
      if (res.ok) {
        await fetchPortfolio();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Portfolio Builder</h1>
          <p className="mt-1 text-text-muted">Turn your Proofly evidence into a professional portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          {portfolio?.isPublic && (
            <button
              onClick={handleUnpublish}
              className="rounded-md border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-3"
            >
              Unpublish
            </button>
          )}
          {portfolio?.draftContent && (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {portfolio ? "Regenerate" : "Generate Portfolio"}
          </button>
        </div>
      </header>

      {portfolio?.isPublic && (
        <div className="mb-8 flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-green-500/10 text-green-500">
              <Eye className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Your portfolio is live</p>
              <a
                href={`/p/${portfolio.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-text-muted transition hover:text-primary"
              >
                proofly.dev/p/{portfolio.slug}
              </a>
            </div>
          </div>
          <a
            href={`/p/${portfolio.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md bg-surface p-2 text-xs font-medium text-text-muted transition hover:bg-surface-3 hover:text-text"
          >
            <LinkIcon className="size-3" /> View Public Page
          </a>
        </div>
      )}

      {portfolio?.draftContent ? (
        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-text">Draft Content</h2>
            <p className="mb-6 text-sm text-text-muted">
              Here is the AI-generated portfolio draft based on your Proofly evidence.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted">Headline</label>
                <input
                  type="text"
                  readOnly
                  className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text opacity-70"
                  value={portfolio.draftContent.hero.headline}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted">Subheadline</label>
                <textarea
                  readOnly
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text opacity-70"
                  value={portfolio.draftContent.hero.subheadline}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted">About</label>
                <textarea
                  readOnly
                  rows={4}
                  className="mt-1 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-text opacity-70"
                  value={portfolio.draftContent.about.content}
                />
              </div>

              {/* Note: Full visual editor is for a future iteration. Read-only preview for now. */}
              <div className="rounded-md bg-primary/10 p-4">
                <p className="text-sm font-medium text-primary">
                  For this MVP phase, manual inline editing is disabled. Click "Publish" to push this draft live, or "Regenerate" to create a new draft from your latest Proofly evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed border-border py-20">
          <FileText className="mb-4 size-10 text-text-muted" />
          <h2 className="mb-2 text-lg font-bold text-text">No Portfolio Found</h2>
          <p className="mb-6 text-sm text-text-muted">
            You haven't generated a portfolio yet. Turn your verified Proofly data into a public showcase.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            Generate Portfolio
          </button>
        </div>
      )}
    </div>
  );
}
