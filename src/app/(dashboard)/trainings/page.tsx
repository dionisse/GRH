"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  GraduationCap,
  Clock,
  DollarSign,
  Users,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface Training {
  id: string;
  title: string;
  description: string | null;
  provider: string | null;
  duration: number | null;
  cost: string | null;
  category: string | null;
  isExternal: boolean;
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setOrganizationId(user.organizationId);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const fetchTrainings = async () => {
      try {
        const response = await fetch(`/api/trainings?organizationId=${organizationId}`);
        const data = await response.json();
        setTrainings(data.trainings || []);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [organizationId]);

  const filteredTrainings = trainings.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (hours: number | null) => {
    if (!hours) return "Non défini";
    if (hours < 8) return `${hours}h`;
    return `${Math.floor(hours / 8)} jour${hours >= 16 ? "s" : ""}`;
  };

  const formatCost = (cost: string | null) => {
    if (!cost) return "Gratuit";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(cost));
  };

  return (
    <DashboardLayout title="Formations">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <GraduationCap size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Formations</p>
              <p className="text-2xl font-bold">{trainings.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Participants ce mois</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Budget utilisé</p>
              <p className="text-2xl font-bold">12 500€</p>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Catalogue de formations
            </h2>
            <p className="text-slate-500">
              Gérez les formations disponibles pour vos employés
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Nouvelle formation
          </Button>
        </div>

        {/* Search */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une formation..."
                icon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: "", label: "Toutes les catégories" },
                { value: "dev", label: "Développement" },
                { value: "management", label: "Management" },
                { value: "security", label: "Sécurité" },
              ]}
            />
          </div>
        </Card>

        {/* Trainings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner w-8 h-8 text-blue-600" />
          </div>
        ) : filteredTrainings.length === 0 ? (
          <Card className="text-center py-12">
            <GraduationCap size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucune formation disponible</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              Créer une formation
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainings.map((training) => (
              <Card
                key={training.id}
                className="hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  {training.isExternal && (
                    <Badge variant="primary">
                      <ExternalLink size={12} className="mr-1" />
                      Externe
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {training.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {training.description || "Aucune description"}
                </p>

                {training.category && (
                  <Badge variant="gray" className="mb-4">
                    {training.category}
                  </Badge>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Clock size={14} />
                    {formatDuration(training.duration)}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                    <DollarSign size={14} />
                    {formatCost(training.cost)}
                  </div>
                </div>

                {training.provider && (
                  <p className="text-xs text-slate-400 mt-2">
                    Par {training.provider}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Add Training Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvelle formation"
          size="lg"
        >
          <form className="space-y-4">
            <Input label="Titre" placeholder="ex: React Avancé" required />
            <Textarea
              label="Description"
              placeholder="Description de la formation..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Fournisseur" placeholder="ex: Formation Pro" />
              <Select
                label="Catégorie"
                options={[
                  { value: "", label: "Sélectionner..." },
                  { value: "Développement", label: "Développement" },
                  { value: "Management", label: "Management" },
                  { value: "Sécurité", label: "Sécurité" },
                  { value: "Communication", label: "Communication" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Durée (heures)"
                type="number"
                placeholder="16"
              />
              <Input
                label="Coût (€)"
                type="number"
                placeholder="1500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
