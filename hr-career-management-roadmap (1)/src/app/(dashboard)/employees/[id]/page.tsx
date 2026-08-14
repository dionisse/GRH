"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Edit,
  FileText,
  TrendingUp,
  GraduationCap,
  Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";

interface Employee {
  id: string;
  employeeNumber: string;
  status: string;
  contractType: string;
  hireDate: string;
  currentSalary: string;
  phone: string | null;
  address: string | null;
  birthDate: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  department: {
    id: string;
    name: string;
  } | null;
  position: {
    id: string;
    title: string;
  } | null;
  careerHistory: Array<{
    id: string;
    positionId: string | null;
    salary: string;
    startDate: string;
    endDate: string | null;
    reason: string | null;
  }>;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${params.id}`);
        const data = await response.json();
        setEmployee(data.employee);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout title="Chargement...">
        <div className="flex items-center justify-center py-12">
          <span className="spinner w-8 h-8 text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout title="Employé non trouvé">
        <Card className="text-center py-12">
          <p className="text-slate-500">Employé non trouvé</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.back()}>
            Retour
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "career", label: "Carrière" },
    { id: "skills", label: "Compétences" },
    { id: "documents", label: "Documents" },
    { id: "evaluations", label: "Évaluations" },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (salary: string | null) => {
    if (!salary) return "Non défini";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(parseFloat(salary));
  };

  return (
    <DashboardLayout title={`${employee.user.firstName} ${employee.user.lastName}`}>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft size={20} />
          Retour aux employés
        </button>

        {/* Employee Header */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar
              name={`${employee.user.firstName} ${employee.user.lastName}`}
              src={employee.user.avatar}
              size="xl"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {employee.user.firstName} {employee.user.lastName}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400">
                    {employee.position?.title || "Poste non défini"} • {employee.department?.name || "Département non défini"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {employee.employeeNumber}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Badge variant={employee.status === "active" ? "success" : "warning"}>
                    {employee.status === "active" ? "Actif" : employee.status}
                  </Badge>
                  <Button variant="secondary" icon={<Edit size={18} />}>
                    Modifier
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">{employee.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">{employee.phone || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Depuis {formatDate(employee.hireDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">{formatSalary(employee.currentSalary)}/an</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-500">Date de naissance</span>
                  <p className="font-medium">{formatDate(employee.birthDate)}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Adresse</span>
                  <p className="font-medium">{employee.address || "Non renseignée"}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Type de contrat</span>
                  <p className="font-medium">{employee.contractType.toUpperCase()}</p>
                </div>
              </div>
            </Card>

            {/* Congés */}
            <Card>
              <CardHeader>
                <CardTitle>Solde de congés</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Congés payés</span>
                    <span className="text-sm font-medium">20/25 jours</span>
                  </div>
                  <Progress value={80} color="blue" showValue={false} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">RTT</span>
                    <span className="text-sm font-medium">8/12 jours</span>
                  </div>
                  <Progress value={67} color="green" showValue={false} />
                </div>
              </div>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" icon={<Calendar size={18} />}>
                  Demander un congé
                </Button>
                <Button variant="secondary" className="w-full justify-start" icon={<Target size={18} />}>
                  Voir les objectifs
                </Button>
                <Button variant="secondary" className="w-full justify-start" icon={<GraduationCap size={18} />}>
                  Inscrire à une formation
                </Button>
                <Button variant="secondary" className="w-full justify-start" icon={<FileText size={18} />}>
                  Ajouter un document
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "career" && (
          <Card>
            <CardHeader>
              <CardTitle>Historique de carrière</CardTitle>
              <CardDescription>Évolution au sein de l'entreprise</CardDescription>
            </CardHeader>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-6 pl-10">
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-800" />
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{employee.position?.title || "Poste actuel"}</h4>
                      <Badge variant="success">Actuel</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{employee.department?.name}</p>
                    <p className="text-sm text-slate-500">Depuis {formatDate(employee.hireDate)}</p>
                    <p className="text-sm font-medium mt-2">{formatSalary(employee.currentSalary)}/an</p>
                  </div>
                </div>
                {/* Historique factice */}
                <div className="relative">
                  <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-slate-400 border-4 border-white dark:border-slate-800" />
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <h4 className="font-semibold">Développeur Junior</h4>
                    <p className="text-sm text-slate-500">Technologie</p>
                    <p className="text-sm text-slate-500">Jan 2022 - Juin 2023</p>
                    <p className="text-sm font-medium mt-2">38 000 €/an</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "skills" && (
          <Card>
            <CardHeader>
              <CardTitle>Compétences</CardTitle>
              <CardDescription>Matrice des compétences de l'employé</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "JavaScript", level: 85, category: "Développement" },
                { name: "React", level: 80, category: "Développement" },
                { name: "Node.js", level: 70, category: "Développement" },
                { name: "SQL", level: 75, category: "Base de données" },
                { name: "Communication", level: 90, category: "Soft Skills" },
                { name: "Gestion de projet", level: 65, category: "Management" },
              ].map((skill) => (
                <div key={skill.name} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant="gray">{skill.category}</Badge>
                  </div>
                  <Progress value={skill.level} color="blue" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Documents administratifs de l'employé</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {[
                { name: "Contrat de travail CDI", type: "Contrat", date: "15/01/2023" },
                { name: "Pièce d'identité", type: "Identité", date: "10/01/2023" },
                { name: "RIB", type: "Bancaire", date: "10/01/2023" },
                { name: "Diplôme Master Informatique", type: "Diplôme", date: "01/09/2021" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="text-slate-400" size={20} />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-slate-500">Ajouté le {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="gray">{doc.type}</Badge>
                    <Button variant="ghost" size="sm">Voir</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "evaluations" && (
          <Card>
            <CardHeader>
              <CardTitle>Évaluations</CardTitle>
              <CardDescription>Historique des évaluations de performance</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {[
                { period: "2024 - Annuel", status: "En cours", rating: null, date: "Prévu le 15/12/2024" },
                { period: "2023 - Annuel", status: "Complété", rating: 4.2, date: "Complété le 20/12/2023" },
                { period: "2023 - Mi-année", status: "Complété", rating: 4.0, date: "Complété le 15/06/2023" },
              ].map((evaluation) => (
                <div key={evaluation.period} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      evaluation.rating ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {evaluation.rating ? (
                        <span className="font-bold">{evaluation.rating}</span>
                      ) : (
                        <Target size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{evaluation.period}</p>
                      <p className="text-sm text-slate-500">{evaluation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={evaluation.status === "Complété" ? "success" : "primary"}>
                      {evaluation.status}
                    </Badge>
                    <Button variant="ghost" size="sm">Voir</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
