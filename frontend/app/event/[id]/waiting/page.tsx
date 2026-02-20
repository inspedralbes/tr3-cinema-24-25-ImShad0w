"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, Users, ArrowRight, AlertCircle } from "lucide-react";
import { useSocket } from "../../../../hooks/useSocket";

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const {
    enterEvent,
    queuePosition,
    isConnected
  } = useSocket({
    onQueuePromoted: () => {
      router.push(`/event/${eventId}/reserve`);
    },
  });

  useEffect(() => {
    if (isConnected && eventId) {
      enterEvent(eventId);
    }
  }, [isConnected, eventId, enterEvent]);

  const handleGoBack = () => {
    router.push(`/event/${eventId}`);
  };

  const estimatedWaitMinutes = queuePosition > 5 ? (queuePosition - 5) * 2 : 0;

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#1c1c21] rounded-2xl border border-[#27272a] p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#f97316]/10 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-[#f97316]" />
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">Sala d&apos;espera</h1>
          <p className="text-[#71717a] mb-6">
            Hi ha massa persones intentant reservar seients ara mateix.
            <br />
            Has d&apos;esperar la teva torn.
          </p>

          <div className="bg-[#27272a] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-5 h-5 text-[#a1a1aa]" />
              <span className="text-[#a1a1aa]">La teva posició</span>
            </div>
            <div className="text-5xl font-bold text-[#f97316] mb-2">
              #{queuePosition}
            </div>
            <div className="text-[#71717a] text-sm">
              {queuePosition <= 5
                ? "Pròxim a entrar"
                : `Temps estimat: ~${estimatedWaitMinutes} minuts`}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#71717a] text-sm mb-6">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#22c55e]" : "bg-[#ef4444]"} animate-pulse`} />
            <span>{isConnected ? "Connectat a la cua" : "Connectant..."}</span>
          </div>

          <button
            onClick={handleGoBack}
            className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Tornar a l&apos;esdeveniment</span>
          </button>

          <div className="mt-4 p-3 bg-[#27272a] rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#71717a] mt-0.5 flex-shrink-0" />
            <p className="text-[#71717a] text-xs text-left">
              No tanquis aquesta pestanya. Quan sigui el teu torn, seràs redirigit automàticament a la pàgina de reserva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
