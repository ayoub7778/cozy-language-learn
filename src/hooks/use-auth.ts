/**
 * Auth hook — gestion de l'état d'authentification Supabase
 * ----------------------------------------------------------------
 * Fournit l'état utilisateur (session, profil) et les helpers
 * de connexion / déconnexion via Supabase Auth.
 * Le listener `onAuthStateChange` est branché dans __root.tsx
 * pour invalider le routeur et le cache React Query à chaque
 * changement d'état (login, logout, token refresh).
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    // Lecture initiale de la session (hydratation côté client)
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState({
        user: data.session?.user ?? null,
        isAuthenticated: !!data.session?.user,
        isLoading: false,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { ...state, signOut };
}
