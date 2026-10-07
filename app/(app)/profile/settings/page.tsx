'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSettingsSchema, ProfileSettingsInput } from "@/lib/validations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

function getInitials(name?: string) {
  if (!name) return "U";
  return name.substring(0, 2).toUpperCase();
}

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: "",
      bio: "",
      githubUrl: "",
      portfolioUrl: "",
    },
  });

  const bioValue = watch("bio") || "";

  useEffect(() => {
    let active = true;
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.user) {
          setUserData(data.user);
          reset({
            name: data.user.name || "",
            bio: data.user.bio || "",
            githubUrl: data.user.githubUrl || "",
            portfolioUrl: data.user.portfolioUrl || "",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load user data:", err);
        toast.error("Failed to load profile data.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    
    return () => {
      active = false;
    };
  }, [reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update profile.");
      }

      setUserData(json.user);
      toast.success("Profile updated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUploadClick = () => {
    toast.info("Avatar upload coming soon");
  };

  const handleDeleteAccountConfirm = () => {
    toast.info("Account deletion coming soon");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-text-muted">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 py-8 px-4">
      <div>
        <h1 className="font-heading text-3xl font-bold">Profile Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your public profile and preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <Avatar className="size-20 border border-surface-border">
            {userData?.image && <AvatarImage src={userData.image} />}
            <AvatarFallback className="text-lg bg-surface-2">
              {getInitials(userData?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button type="button" variant="outline" onClick={handleAvatarUploadClick}>
              Upload photo
            </Button>
            <p className="text-xs text-text-muted">JPG, GIF or PNG. Max size of 2MB.</p>
          </div>
        </div>

        {/* Primary Domain */}
        <div className="space-y-2">
          <Label>Primary Domain</Label>
          <div>
            <Badge variant="secondary" className="bg-surface-2 text-text">
              {userData?.primaryDomain || "None"}
            </Badge>
          </div>
          <p className="text-xs text-text-muted">
            To change your domain, contact support.
          </p>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input id="name" {...register("name")} placeholder="Your name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-text-muted">{bioValue.length}/300</span>
          </div>
          <Textarea 
            id="bio" 
            {...register("bio")} 
            placeholder="Tell us about yourself..." 
            className="resize-none h-24"
            maxLength={300}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold">Links</h3>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" {...register("githubUrl")} placeholder="https://github.com/username" />
            {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input id="portfolioUrl" {...register("portfolioUrl")} placeholder="https://yoursite.com" />
            {errors.portfolioUrl && <p className="text-xs text-destructive">{errors.portfolioUrl.message}</p>}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-surface-border">
          <Button type="submit" disabled={isSaving} className="bg-amber-500 text-amber-950 hover:bg-amber-400">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 mt-12">
        <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-sm text-text-muted mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive" onClick={handleDeleteAccountConfirm}>
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}
