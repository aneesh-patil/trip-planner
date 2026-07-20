import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () =>
    supabase?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });

  const signInWithTwitter = () =>
    supabase?.auth.signInWithOAuth({ provider: "twitter", options: { redirectTo: window.location.origin } });

  // LINE is supported as a custom OIDC provider in Supabase
  const signInWithLine = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase?.auth.signInWithOAuth({ provider: "line" as any, options: { redirectTo: window.location.origin } });

  const signInWithEmail = (email: string, password: string) =>
    supabase?.auth.signInWithPassword({ email, password });

  const signUpWithEmail = (email: string, password: string) =>
    supabase?.auth.signUp({ email, password });

  const signOut = () => supabase?.auth.signOut();

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithTwitter,
    signInWithLine,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
