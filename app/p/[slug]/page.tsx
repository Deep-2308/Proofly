import { notFound } from "next/navigation";
import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { Globe, ShieldCheck, ExternalLink, Code2, Briefcase } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await dbConnect();
  const portfolio = await Portfolio.findOne({ slug: params.slug, isPublic: true }).lean();
  
  if (!portfolio || !portfolio.publishedContent) {
    return { title: "Portfolio Not Found" };
  }

  const { hero, about } = portfolio.publishedContent;
  
  return {
    title: hero.headline || "Portfolio",
    description: about.content?.slice(0, 160),
    openGraph: {
      title: hero.headline,
      description: about.content?.slice(0, 160),
    }
  };
}

export default async function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  await dbConnect();
  const portfolio = await Portfolio.findOne({ slug: params.slug, isPublic: true }).lean();

  if (!portfolio || !portfolio.publishedContent) {
    notFound();
  }

  const content = portfolio.publishedContent;

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-surface-2 pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
            {content.hero.headline}
          </h1>
          {content.hero.subheadline && (
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              {content.hero.subheadline}
            </p>
          )}
          
          {content.contact && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {content.contact.github && (
                <a href={content.contact.github} target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition">
                  <Code2 className="size-6" />
                </a>
              )}
              {content.contact.linkedin && (
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition">
                  <Briefcase className="size-6" />
                </a>
              )}
              {content.contact.website && (
                <a href={content.contact.website} target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition">
                  <Globe className="size-6" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 mt-16 space-y-24">
        
        {/* About Section */}
        {content.about?.content && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-text mb-6">About</h2>
            <div className="prose prose-invert max-w-none text-text-muted leading-relaxed">
              {content.about.content.split("\n").map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {content.skills && content.skills.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-text mb-6">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2">
                  <span className="text-sm font-medium text-text">{skill.name}</span>
                  {skill.evidence && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="size-3" />
                      Verified
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Proofly Evidence Section */}
        {content.evidence && content.evidence.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-heading text-2xl font-bold text-text">Proofly Evidence</h2>
              <div className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-4" />
                Verified by Proofly
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {content.evidence.map((ev, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl border border-border bg-surface-2 p-6 transition hover:border-primary/50">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="font-bold text-text">{ev.title}</h3>
                    {ev.url && (
                      <a href={ev.url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mb-4">{ev.description}</p>
                  {ev.badgeSummary && (
                    <div className="mt-auto flex items-center gap-2 rounded-md bg-surface p-3 text-sm text-text border border-border">
                      <Code2 className="size-4 text-primary shrink-0" />
                      <span className="italic">&ldquo;{ev.badgeSummary}&rdquo;</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {content.projects && content.projects.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-text mb-6">Featured Projects</h2>
            <div className="grid gap-6">
              {content.projects.map((proj, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-surface p-6 md:p-8">
                  <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text">{proj.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span key={tIdx} className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {proj.repositoryUrl && (
                        <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text transition hover:bg-surface-3">
                          <Code2 className="size-4" /> Code
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                          <Globe className="size-4" /> Live
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-sm text-text-muted leading-relaxed">
                    {proj.description.split("\n").map((para, i) => (
                      <p key={i} className="mb-2">{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {content.experience && content.experience.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-text mb-6">Experience</h2>
            <div className="space-y-8 border-l-2 border-border pl-6 ml-3">
              {content.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[35px] top-1.5 size-4 rounded-full border-4 border-background bg-border" />
                  <h3 className="font-bold text-text text-lg">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted mb-3 mt-1">
                    <span className="font-medium text-primary">{exp.company}</span>
                    <span>&bull;</span>
                    <span>{exp.duration}</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
