"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Target, Calendar, Star, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";

export default function EvaluationsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for evaluations
  const evaluations = [
    {
      id: "1",
      employee: { name: "Marie Dupont", position: "Développeur Full Stack", avatar: null },
      period: "2024 - Annuel",
      status: "in_progress",
      rating: null,
      scheduledDate: "2024-12-15",
      objectives: 5,
      completedObjectives: 3,
    },
    {
      id: "2",
      employee: { name: "Pierre Martin", position: "Tech Lead", avatar: null },
      period: "2024 - Annuel",
      status: "completed",
      rating: 4.5,
      scheduledDate: "2024-12-10",
      objectives: 6,
      completedObjectives: 5,
    },
    {
      id: "3",
      employee: { name: "Sophie Bernard", position: "Marketing Manager", avatar: null },
      period: "2024 - Annuel",
      status: "draft",
      rating: null,
      scheduledDate: "2024-12-20",
      objectives: 4,
      completedObjectives: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="gray">Brouillon</Badge>;
      case "in_progress":
        return <Badge variant="warning">En cours</Badge>;
      case "completed":
        return <Badge variant="success">Complété</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title="Évaluations">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold">{evaluations.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">En cours</p>
              <p className="text-2xl font-bold">
                {evaluations.filter((e) => e.status === "in_progress").length}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Note moyenne</p>
              <p className="text-2xl font-bold">4.2</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Objectifs atteints</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Évaluations de performance
            </h2>
            <p className="text-slate-500">
              Gérez les entretiens et objectifs de vos employés
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Nouvelle évaluation
          </Button>
        </div>

        {/* Search */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un employé..."
                icon={<Search size={18} />}
              />
            </div>
            <Select
              options={[
                { value: "", label: "Tous les statuts" },
                { value: "draft", label: "Brouillon" },
                { value: "in_progress", label: "En cours" },
                { value: "completed", label: "Complété" },
              ]}
            />
            <Select
              options={[
                { value: "", label: "Toutes les périodes" },
                { value: "2024-annual", label: "2024 - Annuel" },
                { value: "2024-h1", label: "2024 - S1" },
                { value: "2023-annual", label: "2023 - Annuel" },
              ]}
            />
          </div>
        </Card>

        {/* Evaluations List */}
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <Card
              key={evaluation.id}
              className="hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar name={evaluation.employee.name} size="lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {evaluation.employee.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {evaluation.employee.position}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary">{evaluation.period}</Badge>
                      {getStatusBadge(evaluation.status)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Rating */}
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Note</p>
                    {evaluation.rating ? (
                      <div className="flex items-center gap-1">
                        <Star size={18} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold text-lg">{evaluation.rating}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>

                  {/* Objectives Progress */}
                  <div className="w-40">
                    <p className="text-sm text-slate-500 mb-1">Objectifs</p>
                    <Progress
                      value={(evaluation.completedObjectives / evaluation.objectives) * 100}
                      color={
                        evaluation.completedObjectives / evaluation.objectives >= 0.8
                          ? "green"
                          : evaluation.completedObjectives / evaluation.objectives >= 0.5
                          ? "amber"
                          : "red"
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {evaluation.completedObjectives}/{evaluation.objectives} complétés
                    </p>
                  </div>

                  {/* Actions */}
                  <Button variant="secondary" size="sm">
                    {evaluation.status === "completed" ? "Voir" : "Continuer"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Objectives Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Objectifs en cours</CardTitle>
            <CardDescription>Suivi des objectifs de l'équipe</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {[
              { title: "Augmenter les ventes de 20%", owner: "Équipe Marketing", progress: 65, deadline: "31/12/2024" },
              { title: "Réduire le temps de réponse client", owner: "Support", progress: 80, deadline: "30/11/2024" },
              { title: "Lancer la nouvelle plateforme", owner: "Équipe Tech", progress: 45, deadline: "15/01/2025" },
            ].map((objective, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">
                    {objective.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {objective.owner} • Échéance: {objective.deadline}
                  </p>
                </div>
                <div className="w-32">
                  <Progress
                    value={objective.progress}
                    color={objective.progress >= 70 ? "green" : "blue"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Evaluation Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvelle évaluation"
          size="lg"
        >
          <form className="space-y-4">
            <Select
              label="Employé"
              options={[
                { value: "", label: "Sélectionner un employé..." },
                { value: "1", label: "Marie Dupont" },
                { value: "2", label: "Pierre Martin" },
                { value: "3", label: "Sophie Bernard" },
              ]}
            />
            <Select
              label="Période"
              options={[
                { value: "2024-annual", label: "2024 - Entretien annuel" },
                { value: "2024-h2", label: "2024 - Semestre 2" },
                { value: "2024-q4", label: "2024 - Trimestre 4" },
              ]}
            />
            <Input
              label="Date prévue"
              type="date"
            />
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
