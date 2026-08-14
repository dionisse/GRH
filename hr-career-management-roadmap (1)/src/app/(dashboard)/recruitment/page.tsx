"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface JobPosting {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  contractType: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  status: string;
  publishedAt: string | null;
  closingDate: string | null;
  candidateCount: number;
}

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setOrganizationId(user.organizationId);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const fetchJobPostings = async () => {
      try {
        const response = await fetch(`/api/recruitment?organizationId=${organizationId}`);
        const data = await response.json();
        setJobPostings(data.jobPostings || []);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [organizationId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="success">Ouverte</Badge>;
      case "in_progress":
        return <Badge variant="warning">En cours</Badge>;
      case "closed":
        return <Badge variant="gray">Fermée</Badge>;
      case "on_hold":
        return <Badge variant="danger">En pause</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const formatSalary = (min: string | null, max: string | null) => {
    if (!min && !max) return "À négocier";
    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(parseFloat(min))} - ${formatter.format(parseFloat(max))}`;
    }
    return min ? `À partir de ${formatter.format(parseFloat(min))}` : `Jusqu'à ${formatter.format(parseFloat(max!))}`;
  };

  const openPositions = jobPostings.filter((j) => j.status === "open").length;
  const totalCandidates = jobPostings.reduce((acc, j) => acc + j.candidateCount, 0);

  // Mock candidates for pipeline
  const candidatesByStage = {
    new: 8,
    screening: 5,
    interview: 3,
    offer: 1,
    hired: 2,
  };

  return (
    <DashboardLayout title="Recrutement">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Postes ouverts</p>
              <p className="text-2xl font-bold">{openPositions}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Candidatures</p>
              <p className="text-2xl font-bold">{totalCandidates}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Entretiens prévus</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Recrutés ce mois</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </Card>
        </div>

        {/* Recruitment Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline de recrutement</CardTitle>
            <CardDescription>Vue d'ensemble des candidatures</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(candidatesByStage).map(([stage, count]) => (
              <div
                key={stage}
                className="text-center p-4 bg-slate-50 rounded-lg"
              >
                <p className="text-3xl font-bold text-slate-900">
                  {count}
                </p>
                <p className="text-sm text-slate-500 capitalize mt-1">
                  {stage === "new"
                    ? "Nouveau"
                    : stage === "screening"
                    ? "Présélection"
                    : stage === "interview"
                    ? "Entretien"
                    : stage === "offer"
                    ? "Offre"
                    : "Recruté"}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Offres d'emploi
            </h2>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Nouvelle offre
          </Button>
        </div>

        {/* Search */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une offre..."
                icon={<Search size={18} />}
              />
            </div>
            <Select
              options={[
                { value: "", label: "Tous les statuts" },
                { value: "open", label: "Ouverte" },
                { value: "in_progress", label: "En cours" },
                { value: "closed", label: "Fermée" },
              ]}
            />
          </div>
        </Card>

        {/* Job Postings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner w-8 h-8 text-blue-600" />
          </div>
        ) : jobPostings.length === 0 ? (
          <Card className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucune offre d'emploi publiée</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              Publier une offre
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobPostings.map((job) => (
              <Card
                key={job.id}
                className="hover:border-blue-500/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {job.location && (
                            <span className="flex items-center gap-1 text-sm text-slate-500">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                          )}
                          {job.contractType && (
                            <Badge variant="gray">{job.contractType.toUpperCase()}</Badge>
                          )}
                          {getStatusBadge(job.status)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {job.description || "Aucune description"}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm font-medium text-slate-700">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {job.candidateCount} candidature{job.candidateCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={<Eye size={16} />}>
                      Voir
                    </Button>
                    <Button variant="secondary" size="sm" icon={<ExternalLink size={16} />}>
                      Partager
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Job Posting Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvelle offre d'emploi"
          size="lg"
        >
          <form className="space-y-4">
            <Input label="Titre du poste" placeholder="ex: Développeur Full Stack" required />
            <Textarea
              label="Description"
              placeholder="Décrivez le poste, les missions..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Lieu" placeholder="Paris, France" />
              <Select
                label="Type de contrat"
                options={[
                  { value: "cdi", label: "CDI" },
                  { value: "cdd", label: "CDD" },
                  { value: "stage", label: "Stage" },
                  { value: "alternance", label: "Alternance" },
                  { value: "freelance", label: "Freelance" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salaire minimum"
                type="number"
                placeholder="40000"
              />
              <Input
                label="Salaire maximum"
                type="number"
                placeholder="60000"
              />
            </div>
            <Textarea
              label="Prérequis"
              placeholder="Compétences et expériences requises..."
            />
            <Input label="Date de clôture" type="date" />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Publier</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
