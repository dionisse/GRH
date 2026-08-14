"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowRight,
  Star,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Gestion des Employés",
      description: "Profils complets, contrats OHADA, CNSS et documents administratifs centralisés.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Suivi de Carrière",
      description: "Catégories professionnelles, promotions, évolution salariale selon les conventions.",
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      icon: Target,
      title: "Paie conforme OHADA",
      description: "Bulletins de paie, calcul CNSS, ITS et déclarations sociales automatisés.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Calendar,
      title: "Congés légaux",
      description: "24 jours/an, maternité 14 semaines, événements familiaux selon le Code du Travail.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: GraduationCap,
      title: "Formations",
      description: "Catalogue de formations, certifications et développement des compétences.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: Briefcase,
      title: "Recrutement",
      description: "Publication d'offres, gestion des candidatures et onboarding structuré.",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const pwaFeatures = [
    { icon: Smartphone, text: "Fonctionne sur tous les appareils" },
    { icon: Wifi, text: "Mode hors ligne disponible" },
    { icon: Globe, text: "Accessible depuis n'importe où" },
    { icon: Shield, text: "Données sécurisées" },
  ];

  const stats = [
    { value: "2 500+", label: "Entreprises" },
    { value: "85 000+", label: "Employés gérés" },
    { value: "99,9%", label: "Disponibilité" },
    { value: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Koffi Adjovi",
      role: "DRH, Société Béninoise de Distribution",
      content: "RH360 a transformé notre gestion RH. La conformité OHADA est enfin simple à gérer au quotidien.",
      avatar: "KA",
    },
    {
      name: "Mariam Touré",
      role: "Responsable Paie, Groupe Atlantique",
      content: "Les bulletins de paie et déclarations CNSS sont automatisés. Un gain de temps considérable chaque mois.",
      avatar: "MT",
    },
    {
      name: "Patrick Hounsa",
      role: "Gérant, PME Cotonou",
      content: "Interface intuitive, support réactif. Nos managers gèrent les congés et évaluations en toute autonomie.",
      avatar: "PH",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20">
                RH
              </div>
              <span className="text-xl font-bold text-slate-900">RH360</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {isOnline ? <Wifi size={14} /> : <Wifi size={14} />}
                {isOnline ? "En ligne" : "Hors ligne"}
              </div>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Démarrer
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-blue-100/40 via-cyan-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Application PWA - Fonctionne hors ligne
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
              Gérez vos RH selon
              <span className="gradient-text"> les normes OHADA</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              RH360 est une solution SaaS conforme au droit du travail béninois et aux normes OHADA.
              Gestion des employés, paie, CNSS, ITS et déclarations sociales.
              Accessible sur tous vos appareils, même hors connexion.
            </p>
            <div className="flex items-center justify-center gap-2 mb-10 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <span className="text-2xl">🇧🇯</span>
              <span className="text-slate-500 font-medium">Conçu pour le Bénin et la zone OHADA</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
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

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PWA Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pwaFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              <Zap size={14} />
              Fonctionnalités
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Toutes les fonctionnalités RH en un seul endroit
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              De l'embauche à la retraite, suivez chaque étape de la carrière de vos employés.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-slate-600 text-sm font-medium mb-4 border border-slate-200">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              Témoignages
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Des entreprises béninoises et africaines modernisent leur RH avec RH360.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              Tarification
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Tarification simple et transparente
            </h2>
            <p className="text-lg text-slate-600">
              Choisissez le plan adapté à la taille de votre entreprise.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Pour les petites équipes</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Gratuit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu'à 10 employés", "Gestion des congés", "Profils employés", "Support email"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-600 text-sm">
                    <Check size={18} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full">
                  Commencer
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-blue-600 text-xs font-semibold rounded-full shadow-sm">
                Populaire
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
              <p className="text-blue-100 text-sm mb-6">Pour les PME</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">25 000</span>
                <span className="text-blue-100 text-sm"> FCFA/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Jusqu'à 100 employés", "Toutes les fonctionnalités", "Évaluations & objectifs", "Recrutement", "Support prioritaire"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-white text-sm">
                    <Check size={18} className="text-blue-200 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50 border-white">
                  Essai gratuit 14 jours
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">Pour les grandes entreprises</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Sur devis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Employés illimités", "API & intégrations", "SSO & SAML", "Formation sur site", "Support dédié 24/7"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-600 text-sm">
                    <Check size={18} className="text-emerald-500 flex-shrink-0" />
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl px-8 py-16 text-center shadow-2xl shadow-blue-600/20">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Prêt à moderniser votre gestion RH ?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'entreprises qui font confiance à RH360 pour gérer leurs talents.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-white shadow-lg">
                  Créer mon compte gratuit
                  <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                RH
              </div>
              <span className="text-xl font-bold text-slate-900">RH360</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 RH360. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                Mentions légales
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                Confidentialité
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
