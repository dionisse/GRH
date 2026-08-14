"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Target,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Shield,
  Smartphone,
  Wifi,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
  }, []);

  const features = [
    {
      icon: Users,
      title: "Gestion des Employés",
      description: "Profils complets, contrats OHADA, CNSS et documents administratifs centralisés.",
    },
    {
      icon: TrendingUp,
      title: "Suivi de Carrière",
      description: "Catégories professionnelles, promotions, évolution salariale selon les conventions.",
    },
    {
      icon: Target,
      title: "Paie conforme OHADA",
      description: "Bulletins de paie, calcul CNSS, ITS et déclarations sociales automatisées.",
    },
    {
      icon: Calendar,
      title: "Congés légaux",
      description: "24 jours/an, maternité 14 semaines, événements familiaux selon le Code du Travail.",
    },
    {
      icon: GraduationCap,
      title: "Formations",
      description: "Catalogue de formations, certifications et développement des compétences.",
    },
    {
      icon: Briefcase,
      title: "Recrutement",
      description: "Publication d'offres, gestion des candidatures et onboarding structuré.",
    },
  ];

  const pwaFeatures = [
    { icon: Smartphone, text: "Fonctionne sur tous les appareils" },
    { icon: Wifi, text: "Mode hors ligne disponible" },
    { icon: Globe, text: "Accessible depuis n'importe où" },
    { icon: Shield, text: "Données sécurisées" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                RH
              </div>
              <span className="text-xl font-bold text-white">RH360</span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  isOnline ? "bg-green-900/50 text-green-400" : "bg-amber-900/50 text-amber-400"
                }`}
              >
                {isOnline ? <Wifi size={14} /> : <Wifi size={14} />}
                {isOnline ? "En ligne" : "Hors ligne"}
              </div>
              <Link href="/login">
                <Button variant="ghost" className="text-white">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Démarrer</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full text-blue-400 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Application PWA - Fonctionne hors ligne
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Gérez vos RH selon
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {" "}les normes OHADA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            RH360 est une solution SaaS conforme au droit du travail béninois et aux normes OHADA.
            Gestion des employés, paie, CNSS, ITS et déclarations sociales.
            Accessible sur tous vos appareils, même hors connexion.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">🇧🇯</span>
            <span className="text-slate-400">Conçu pour le Bénin et la zone OHADA</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
                <ChevronRight size={20} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PWA Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pwaFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
              >
                <feature.icon className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Toutes les fonctionnalités RH en un seul endroit
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              De l'embauche à la retraite, suivez chaque étape de la carrière de vos employés.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tarification simple et transparente
            </h2>
            <p className="text-lg text-slate-400">
              Choisissez le plan adapté à la taille de votre entreprise.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
              <p className="text-slate-400 mb-4">Pour les petites équipes</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Gratuit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu'à 10 employés", "Gestion des congés", "Profils employés", "Support email"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <Check size={18} className="text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full">
                Commencer
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl border border-blue-500 transform scale-105">
              <div className="inline-block px-3 py-1 bg-blue-400/20 rounded-full text-blue-200 text-xs mb-4">
                Populaire
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-blue-200 mb-4">Pour les PME</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">25 000</span>
                <span className="text-blue-200"> FCFA/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu'à 100 employés", "Toutes les fonctionnalités", "Évaluations & objectifs", "Recrutement", "Support prioritaire"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white">
                    <Check size={18} className="text-blue-200" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Essai gratuit 14 jours
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-4">Pour les grandes entreprises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Sur devis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Employés illimités", "API & intégrations", "SSO & SAML", "Formation sur site", "Support dédié 24/7"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-300">
                    <Check size={18} className="text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre gestion RH ?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Rejoignez des milliers d'entreprises qui font confiance à RH360 pour gérer leurs talents.
          </p>
          <Link href="/register">
            <Button size="lg">
              Créer mon compte gratuit
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                RH
              </div>
              <span className="text-xl font-bold text-white">RH360</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 RH360. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
