"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Calendar,
  Target,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Clock,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Stats";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  activeEvaluations: number;
  totalTrainings: number;
  openPositions: number;
  newCandidates: number;
  onLeave: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setOrganizationId(user.organizationId);
    } else {
      // No login — the API will fall back to the first organization
      setOrganizationId("");
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/dashboard/stats?organizationId=${organizationId}`);
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [organizationId]);

  const recentActivities = [
    { id: 1, user: "Marie Dupont", action: "a demandé un congé", time: "Il y a 5 min", type: "leave" },
    { id: 2, user: "Pierre Martin", action: "a complété sa formation React", time: "Il y a 1h", type: "training" },
    { id: 3, user: "Sophie Bernard", action: "a mis à jour son profil", time: "Il y a 2h", type: "profile" },
    { id: 4, user: "Jean Petit", action: "a soumis son évaluation", time: "Il y a 3h", type: "evaluation" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Entretien annuel - Marie Dupont", date: "25 Jan", type: "evaluation" },
    { id: 2, title: "Formation Leadership", date: "28 Jan", type: "training" },
    { id: 3, title: "Onboarding - Nouveau Dev", date: "1 Fév", type: "onboarding" },
  ];

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Employés actifs"
            value={stats?.totalEmployees || 0}
            icon={<Users size={24} />}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Départements"
            value={stats?.totalDepartments || 0}
            icon={<Building2 size={24} />}
            color="purple"
          />
          <StatCard
            title="Congés en attente"
            value={stats?.pendingLeaves || 0}
            icon={<Calendar size={24} />}
            color="amber"
          />
          <StatCard
            title="Postes ouverts"
            value={stats?.openPositions || 0}
            icon={<Briefcase size={24} />}
            color="green"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Évaluations en cours"
            value={stats?.activeEvaluations || 0}
            icon={<Target size={24} />}
            color="blue"
          />
          <StatCard
            title="Formations disponibles"
            value={stats?.totalTrainings || 0}
            icon={<GraduationCap size={24} />}
            color="green"
          />
          <StatCard
            title="Nouveaux candidats"
            value={stats?.newCandidates || 0}
            icon={<UserCheck size={24} />}
            color="purple"
          />
          <StatCard
            title="En congé aujourd'hui"
            value={stats?.onLeave || 0}
            icon={<Clock size={24} />}
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Les dernières actions dans l'entreprise</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={activity.user} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-slate-500">{activity.action}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.type === "leave"
                        ? "warning"
                        : activity.type === "training"
                        ? "success"
                        : "gray"
                    }
                  >
                    {activity.type === "leave"
                      ? "Congé"
                      : activity.type === "training"
                      ? "Formation"
                      : activity.type === "evaluation"
                      ? "Évaluation"
                      : "Profil"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Cette semaine</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-blue-100">
                    <span className="text-xs text-blue-600 font-medium">
                      {event.date.split(" ")[1]}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {event.date.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {event.title}
                    </p>
                    <Badge variant="primary" className="mt-1">
                      {event.type === "evaluation"
                        ? "Entretien"
                        : event.type === "training"
                        ? "Formation"
                        : "Onboarding"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des congés</CardTitle>
              <CardDescription>Solde moyen des employés</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-slate-600 font-medium">Congés payés</span>
                  <span className="text-sm font-semibold text-slate-900">18/25 jours restants</span>
                </div>
                <Progress value={72} color="blue" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-slate-600 font-medium">RTT</span>
                  <span className="text-sm font-semibold text-slate-900">8/12 jours restants</span>
                </div>
                <Progress value={67} color="green" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-slate-600 font-medium">Maladie utilisés</span>
                  <span className="text-sm font-semibold text-slate-900">3 jours</span>
                </div>
                <Progress value={25} color="amber" />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Accès direct aux fonctionnalités</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-sm transition-all border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Ajouter employé</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-sm transition-all border border-slate-100">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Valider congés</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-sm transition-all border border-slate-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Briefcase size={20} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Publier offre</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-sm transition-all border border-slate-100">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Target size={20} className="text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Lancer évaluation</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
