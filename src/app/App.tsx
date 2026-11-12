import React from "react";
import { useAuth } from "../store/authContext";
import { AuthScreen } from "../components/features/auth/AuthScreen";
import { VyseChatMain } from "../components/chat/VyseChatMain";
import { PortalFieldCollection } from "../components/ui/portal-field";
import { VyseLogo } from "../components/ui/VyseLogo";

export function App() {
  const { user, loading } = useAuth();

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden">
      {/* Minimal Monochrome Field Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <PortalFieldCollection
          speed={0.5}
          size={0.8}
          length={0.8}
          density={0.8}
          opacity={0.5}
          hue={0}
          saturation={0}
          brightness={0.8}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center space-y-4 select-none">
            <VyseLogo size={44} showText={false} />
            <div className="w-4 h-4 border border-[var(--text-primary)] border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-[11px] font-mono font-semibold tracking-[0.16em] text-[var(--text-primary)] uppercase">
                VYSE // AI CHATBOT
              </p>
              <p className="text-xs text-[var(--text-tertiary)] font-mono">
                Synchronizing verified campus knowledge & student session...
              </p>
            </div>
          </div>
        ) : !user ? (
          <AuthScreen />
        ) : (
          <VyseChatMain />
        )}
      </div>
    </div>
  );
}