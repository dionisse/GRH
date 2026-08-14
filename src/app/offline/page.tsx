"use client";

import { WifiOff, RefreshCw, Hop as Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-amber-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="text-center max-w-md relative">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100">
          <WifiOff size={48} className="text-amber-500" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Vous êtes hors ligne
        </h1>

        <p className="text-slate-600 mb-8">
          Pas de connexion Internet détectée. Certaines fonctionnalités peuvent être limitées,
          mais vous pouvez continuer à utiliser l'application. Vos modifications seront
          synchronisées à la reconnexion.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => window.location.reload()}
            icon={<RefreshCw size={18} />}
            className="w-full"
          >
            Réessayer
          </Button>

          <Link href="/dashboard">
            <Button variant="secondary" icon={<Home size={18} />} className="w-full">
              Retour au tableau de bord
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">Mode hors ligne</h3>
          <ul className="text-sm text-slate-600 text-left space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Consultez les données mises en cache
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Créez des demandes de congés
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Modifiez vos informations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Synchronisation automatique à la reconnexion
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
