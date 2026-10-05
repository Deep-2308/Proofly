"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Brain, Briefcase, Code2, Globe, Github, Sparkles } from "lucide-react";
import type { PublicProfile } from "@/lib/profile";

interface ProfileExperienceProps {
  profile: PublicProfile;
  isOwn: boolean;
}

export function ProfileExperience({ profile, isOwn }: ProfileExperienceProps) {
  const { user, badges, projects, avgScore } = profile;

  return (
    <div className="relative min-h-screen bg-canvas p-6 md:p-12 overflow-hidden">
      {/* 3D-ish Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-surface/40 border border-surface-border p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
        >
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full border-4 border-surface shadow-xl" />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-surface shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-heading font-bold text-white">
              {user.name.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text">{user.name}</h1>
              {badges.length > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-success/15 text-success border border-success/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck className="w-4 h-4" /> AI Verified
                </span>
              )}
            </div>
            
            <p className="text-xl text-primary font-medium">{user.primaryDomain || "Multidisciplinary Explorer"}</p>
            <p className="text-text-muted max-w-2xl leading-relaxed">{user.bio || "No biography provided yet. Ready to prove their skills to the world."}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors">
                  <Github className="w-5 h-5" /> GitHub
                </a>
              )}
              {user.portfolioUrl && (
                <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors">
                  <Globe className="w-5 h-5" /> Portfolio
                </a>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center bg-surface/60 border border-surface-border p-6 rounded-2xl min-w-[140px]">
            <span className="text-4xl font-heading font-black text-primary">{avgScore || 0}</span>
            <span className="text-xs text-text-muted uppercase tracking-widest font-semibold mt-1">Avg Score</span>
          </div>
        </motion.header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Skills & Badges */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <section className="bg-surface/30 border border-surface-border p-6 rounded-3xl backdrop-blur-md">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">
                <Brain className="w-4 h-4 text-accent" /> Verified Skills
              </h3>
              
              <div className="space-y-4">
                {badges.length === 0 ? (
                  <p className="text-sm text-text-muted italic">No verified skills yet.</p>
                ) : (
                  badges.map((badge, idx) => (
                    <div key={badge.id} className="relative group p-4 bg-surface/50 border border-surface-border rounded-2xl hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-heading font-semibold text-text">{badge.skillName}</span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Score: {badge.score}</span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2">{badge.badgeSummary}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Projects & Experience */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <section className="bg-surface/30 border border-surface-border p-8 rounded-3xl backdrop-blur-md">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">
                <Briefcase className="w-4 h-4 text-primary" /> Project Portfolio
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.length === 0 ? (
                  <p className="text-sm text-text-muted italic">Has not joined any projects yet.</p>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="p-5 bg-surface/50 border border-surface-border rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/30">
                      <div>
                        <h4 className="font-heading font-semibold text-lg text-text mb-2">{project.title}</h4>
                        <p className="text-sm text-text-muted line-clamp-3 mb-4">{project.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-text-muted bg-surface px-2 py-1 rounded-md border border-surface-border">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted bg-surface px-2 py-1 rounded-md border border-surface-border">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            
            {/* Private Stats (Only visible to owner) */}
            {isOwn && profile.privateStats && (
              <section className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6 rounded-3xl backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-canvas/50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Your Private Dashboard</h4>
                    <p className="text-xs text-text-muted">Only you can see this.</p>
                  </div>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-black font-heading text-text">{profile.privateStats.totalAttempts}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Attempts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black font-heading text-success">{profile.privateStats.passed}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Passed</p>
                  </div>
                </div>
              </section>
            )}

          </motion.div>

        </div>
      </div>
    </div>
  );
}
