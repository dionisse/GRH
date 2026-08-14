"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Save,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");

  const tabs = [
    { id: "organization", label: "Organisation", icon: Building2 },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "integrations", label: "Intégrations", icon: Globe },
  ];

  return (
    <DashboardLayout title="Paramètres">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Paramètres
          </h2>
          <p className="text-slate-500">
            Gérez les paramètres de votre organisation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "organization" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'organisation</CardTitle>
                  <CardDescription>
                    Modifiez les informations de votre entreprise
                  </CardDescription>
                </CardHeader>
                <form className="space-y-4">
                  <Input
                    label="Nom de l'entreprise"
                    defaultValue="TechCorp France"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Secteur d'activité" defaultValue="Technologie" />
                    <Input label="Numéro SIRET" defaultValue="123 456 789 00012" />
                  </div>
                  <Textarea
                    label="Adresse"
                    defaultValue="123 Avenue des Champs-Élysées, 75008 Paris"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Téléphone" defaultValue="+33 1 23 45 67 89" />
                    <Input
                      label="Email de contact"
                      type="email"
                      defaultValue="contact@techcorp.fr"
                    />
                  </div>
                  <Input label="Site web" defaultValue="https://techcorp.fr" />
                  <div className="flex justify-end pt-4">
                    <Button icon={<Save size={18} />}>Enregistrer</Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les accès et les rôles des utilisateurs
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4">
                  {[
                    { name: "Admin RH", email: "admin@techcorp.fr", role: "Admin" },
                    { name: "Marie Dupont", email: "marie@techcorp.fr", role: "Manager" },
                    { name: "Pierre Martin", email: "pierre@techcorp.fr", role: "Employé" },
                  ].map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      <Select
                        options={[
                          { value: "admin", label: "Admin" },
                          { value: "manager", label: "Manager" },
                          { value: "employee", label: "Employé" },
                        ]}
                        defaultValue={user.role.toLowerCase()}
                      />
                    </div>
                  ))}
                  <Button variant="secondary" className="w-full">
                    Inviter un utilisateur
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Configurez quand et comment vous recevez des notifications
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4">
                  {[
                    {
                      title: "Demandes de congés",
                      description: "Recevoir une notification pour chaque nouvelle demande",
                    },
                    {
                      title: "Évaluations",
                      description: "Rappels pour les entretiens à venir",
                    },
                    {
                      title: "Nouveaux candidats",
                      description: "Notification lors d'une nouvelle candidature",
                    },
                    {
                      title: "Documents",
                      description: "Alerte pour les documents expirés ou manquants",
                    },
                  ].map((notif) => (
                    <div
                      key={notif.title}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-slate-500">{notif.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Changer le mot de passe</h4>
                    <div className="space-y-4 max-w-md">
                      <Input label="Mot de passe actuel" type="password" />
                      <Input label="Nouveau mot de passe" type="password" />
                      <Input label="Confirmer le mot de passe" type="password" />
                      <Button>Mettre à jour</Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">Authentification à deux facteurs</h4>
                    <p className="text-sm text-slate-500 mb-4">
                      Ajoutez une couche de sécurité supplémentaire à votre compte
                    </p>
                    <Button variant="secondary">Activer 2FA</Button>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">Sessions actives</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">Chrome sur MacOS</p>
                          <p className="text-sm text-slate-500">Paris, France • Actif maintenant</p>
                        </div>
                        <span className="text-xs text-green-600">Session actuelle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'application
                  </CardDescription>
                </CardHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Thème</h4>
                    <div className="flex gap-4">
                      {["Clair", "Sombre", "Système"].map((theme) => (
                        <button
                          key={theme}
                          className="flex-1 p-4 border rounded-lg hover:border-blue-500 transition-colors text-center"
                        >
                          <div
                            className={`w-12 h-8 mx-auto rounded mb-2 ${
                              theme === "Clair"
                                ? "bg-white border"
                                : theme === "Sombre"
                                ? "bg-slate-800"
                                : "bg-gradient-to-r from-white to-slate-800"
                            }`}
                          />
                          <span className="text-sm">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Langue</h4>
                    <Select
                      options={[
                        { value: "fr", label: "🇫🇷 Français" },
                        { value: "en", label: "🇬🇧 English" },
                        { value: "de", label: "🇩🇪 Deutsch" },
                        { value: "es", label: "🇪🇸 Español" },
                      ]}
                      defaultValue="fr"
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "integrations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Intégrations</CardTitle>
                  <CardDescription>
                    Connectez RH360 à vos outils préférés
                  </CardDescription>
                </CardHeader>
                <div className="space-y-4">
                  {[
                    { name: "Google Workspace", status: "connected", icon: "G" },
                    { name: "Microsoft 365", status: "available", icon: "M" },
                    { name: "Slack", status: "available", icon: "S" },
                    { name: "Calendrier", status: "connected", icon: "📅" },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold">
                          {integration.icon}
                        </div>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-slate-500">
                            {integration.status === "connected"
                              ? "Connecté"
                              : "Disponible"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={
                          integration.status === "connected" ? "danger" : "secondary"
                        }
                        size="sm"
                      >
                        {integration.status === "connected" ? "Déconnecter" : "Connecter"}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
