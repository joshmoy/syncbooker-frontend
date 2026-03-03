"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { googleService } from "@/lib/google";
import {
  useSettings,
  useUpdateSettings,
  useUploadDisplayPicture,
  useUploadBanner,
  useRemoveDisplayPicture,
  useRemoveBanner,
} from "@/hooks/use-settings";

export default function SettingsPage() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const uploadDisplayPicture = useUploadDisplayPicture();
  const uploadBanner = useUploadBanner();
  const removeDisplayPicture = useRemoveDisplayPicture();
  const removeBanner = useRemoveBanner();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // Load user settings on mount
  useEffect(() => {
    if (settings?.user) {
      setName(settings.user.name || "");
      setEmail(settings.user.email || "");
      setUsername(settings.user.username || "");
    }
  }, [settings]);

  // Check for google_connected param
  useEffect(() => {
    if (searchParams.get("google_connected") === "true") {
      toast.success("Google Calendar connected successfully!");
    }
  }, [searchParams]);

  const handleConnectGoogle = async () => {
    try {
      setIsConnectingGoogle(true);
      const { url } = await googleService.getAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to get Google authentication URL");
      setIsConnectingGoogle(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setProfileFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Automatically upload the profile picture
      uploadDisplayPicture.mutate(file, {
        onSuccess: () => {
          setProfileFile(null);
          setProfilePicturePreview(null);
          if (profileInputRef.current) {
            profileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setBannerFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Automatically upload the banner
      uploadBanner.mutate(file, {
        onSuccess: () => {
          setBannerFile(null);
          setBannerPreview(null);
          if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleUploadProfilePicture = async () => {
    if (profileFile) {
      uploadDisplayPicture.mutate(profileFile, {
        onSuccess: () => {
          setProfileFile(null);
          setProfilePicturePreview(null);
          if (profileInputRef.current) {
            profileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleUploadBanner = async () => {
    if (bannerFile) {
      uploadBanner.mutate(bannerFile, {
        onSuccess: () => {
          setBannerFile(null);
          setBannerPreview(null);
          if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
          }
        },
      });
    }
  };

  const handleRemoveProfilePicture = () => {
    // If there's a preview, just clear it
    if (profilePicturePreview || profileFile) {
      setProfilePicturePreview(null);
      setProfileFile(null);
      if (profileInputRef.current) {
        profileInputRef.current.value = "";
      }
    } else {
      // Otherwise, remove from server
      removeDisplayPicture.mutate();
    }
  };

  const handleRemoveBanner = () => {
    // If there's a preview, just clear it
    if (bannerPreview || bannerFile) {
      setBannerPreview(null);
      setBannerFile(null);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    } else {
      // Otherwise, remove from server
      removeBanner.mutate();
    }
  };

  const handleSaveProfile = () => {
    updateSettings.mutate({
      name: name !== settings?.user.name ? name : undefined,
      username: username !== settings?.user.username ? username : undefined,
    });
  };

  const handleSaveAccount = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    updateSettings.mutate({
      currentPassword,
      password: newPassword,
    }, {
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
    });
  };

  const getInitials = () => {
    return (name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const displayPicture = profilePicturePreview || settings?.user.displayPicture || "/avatar.png";
  const banner = bannerPreview || settings?.user.banner || "/banner-image-placeholder.jpg";

  if (settingsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          {/* Tab bar */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-md" />
            ))}
          </div>
          {/* Profile card skeleton */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
              {/* Fields */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
              <Skeleton className="h-10 w-28 rounded-md" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="heading-lg">Settings</h1>
          <p className="body-md mt-2 text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Image */}
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-muted-foreground/50">
                    <div className="relative h-48 w-full">
                      <Image
                        src={banner}
                        alt="Banner"
                        fill
                        className="object-cover"
                      />
                        {uploadBanner.isPending && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="flex flex-col items-center gap-2 text-white">
                              <Loader2 className="h-8 w-8 animate-spin" />
                              <p className="body-sm">Uploading banner...</p>
                            </div>
                          </div>
                        )}
                        {settings?.user.banner && !uploadBanner.isPending && !removeBanner.isPending && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 z-10"
                            onClick={handleRemoveBanner}
                            disabled={removeBanner.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {removeBanner.isPending && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="flex flex-col items-center gap-2 text-white">
                              <Loader2 className="h-8 w-8 animate-spin" />
                              <p className="body-sm">Removing banner...</p>
                            </div>
                          </div>
                        )}
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        style={{ pointerEvents: 'none' }}
                      />
                      <div 
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => !uploadBanner.isPending && !removeBanner.isPending && bannerInputRef.current?.click()}
                        style={{ zIndex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        {displayPicture ? (
                          <AvatarImage src={displayPicture} alt={name} />
                        ) : (
                          <AvatarFallback className="text-2xl">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="body-sm text-muted-foreground">
                        Upload a profile picture (Max 5MB)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => profileInputRef.current?.click()}
                          disabled={uploadDisplayPicture.isPending}
                        >
                          {uploadDisplayPicture.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Change Picture
                            </>
                          )}
                        </Button>
                        {settings?.user.displayPicture && !uploadDisplayPicture.isPending && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveProfilePicture}
                            disabled={removeDisplayPicture.isPending}
                          >
                            {removeDisplayPicture.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Remove
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex items-center gap-2">
                    <span className="body-sm text-muted-foreground">
                      {new URL(process.env.NEXT_PUBLIC_APP_URL || "https://syncbooker.com").host}/
                    </span>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="body-sm text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  onClick={handleSaveAccount}
                  disabled={updateSettings.isPending || !newPassword}
                >
                  {updateSettings.isPending ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Google Calendar</h4>
                        {settings?.user.googleConnected && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="body-sm text-muted-foreground">
                        Sync your bookings and create Google Meet links automatically.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleConnectGoogle}
                    disabled={isConnectingGoogle}
                  >
                    {isConnectingGoogle ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : settings?.user.googleConnected ? (
                      "Reconnect"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-md text-muted-foreground">
                  Notification settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}