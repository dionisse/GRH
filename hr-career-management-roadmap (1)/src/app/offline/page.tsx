"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <WifiOff size={48} className="text-amber-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Vous êtes hors ligne
        </h1>
        
        <p className="text-slate-300 mb-8">
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

        <div className="mt-12 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-white mb-2">Mode hors ligne</h3>
          <ul className="text-sm text-slate-400 text-left space-y-2">
            <li>✓ Consultez les données mises en cache</li>
            <li>✓ Créez des demandes de congés</li>
            <li>✓ Modifiez vos informations</li>
            <li>✓ Synchronisation automatique à la reconnexion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
