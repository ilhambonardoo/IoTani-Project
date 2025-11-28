"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../useAuth";
import type { ProfileData } from "@/types";

export function useProfile() {
  const { email } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/profile?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      
      if (res.ok && data.status && data.data) {
        let avatarUrl = data.data.avatarUrl || "";
        if (avatarUrl === "/icons/people.png") {
          avatarUrl = "";
        }

        const profileData: ProfileData = {
          ...data.data,
          avatarUrl: avatarUrl,
        };
        setProfile(profileData);
      } else {
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    isLoading, 
    error, 
    refetch: fetchProfile 
  };
}

