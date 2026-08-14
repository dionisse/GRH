"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Calendar, Clock, CircleCheck as CheckCircle, Circle as XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { OHADA_CONFIG } from "@/lib/ohada-config";

interface LeaveRequest {
  id: string;
  type: string;
  familyEvent: string | null;
  startDate: string;
  endDate: string;
  days: string;
  reason: string | null;
  status: string;
  medicalCertificate: boolean;
  createdAt: string;
  employee: {
    id: string;
    matricule: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string | null;
    };
  };
}

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setOrganizationId(user.organizationId);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const fetchLeaves = async () => {
      try {
        const response = await fetch(`/api/leaves?organizationId=${organizationId}`);
        const data = await response.json();
        setLeaves(data.leaves || []);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [organizationId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">En attente</Badge>;
      case "approved":
        return <Badge variant="success">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="danger">Refusé</Badge>;
      case "cancelled":
        return <Badge variant="gray">Annulé</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string, familyEvent?: string | null) => {
    const types: Record<string, { label: string; variant: "primary" | "success" | "warning" | "danger" | "gray" }> = {
      annual: { label: "Congé annuel", variant: "primary" },
      sick: { label: "Maladie", variant: "danger" },
      maternity: { label: "Maternité", variant: "success" },
      paternity: { label: "Paternité", variant: "success" },
      family_event: { label: "Événement familial", variant: "warning" },
      unpaid: { label: "Sans solde", variant: "gray" },
      recovery: { label: "Récupération", variant: "primary" },
      other: { label: "Autre", variant: "gray" },
    };

    if (type === "family_event" && familyEvent) {
      const event = OHADA_CONFIG.leaves.familyEvents.find(e => e.event === familyEvent);
      return <Badge variant="warning">{event?.label || familyEvent}</Badge>;
    }

    const config = types[type] || { label: type, variant: "gray" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-BJ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const approvedCount = leaves.filter((l) => l.status === "approved").length;

  const filteredLeaves = filterStatus
    ? leaves.filter((l) => l.status === filterStatus)
    : leaves;

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: "approved" } : l)));
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason: "Refusé par RH" }),
      });
      setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: "rejected" } : l)));
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  return (
    <DashboardLayout title="Gestion des congés">
      <div className="space-y-6">
        {/* Rappel légal */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900">
                Droits aux congés - Code du Travail Béninois
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {OHADA_CONFIG.leaves.annual.daysPerYear} jours ouvrables de congés payés par an 
                ({OHADA_CONFIG.leaves.annual.daysPerMonth} jours par mois travaillé). 
                Maternité : {OHADA_CONFIG.leaves.maternity.total} semaines. 
                Paternité : {OHADA_CONFIG.leaves.paternity.days} jours.
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">En attente</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Approuvés ce mois</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total demandes</p>
              <p className="text-2xl font-bold">{leaves.length}</p>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Demandes de congés
            </h2>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Nouvelle demande
          </Button>
        </div>

        {/* Filters */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Rechercher..." icon={<Search size={18} />} />
            </div>
            <Select
              options={[
                { value: "", label: "Tous les statuts" },
                { value: "pending", label: "En attente" },
                { value: "approved", label: "Approuvé" },
                { value: "rejected", label: "Refusé" },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        </Card>

        {/* Leave Requests List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner w-8 h-8 text-blue-600" />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucune demande de congé</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => (
              <Card key={leave.id} className="hover:border-blue-500/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar
                      name={`${leave.employee.user.firstName} ${leave.employee.user.lastName}`}
                      src={leave.employee.user.avatar}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900">
                        {leave.employee.user.lastName} {leave.employee.user.firstName}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">{leave.employee.matricule}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {getTypeBadge(leave.type, leave.familyEvent)}
                        <span className="text-sm text-slate-500">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          ({leave.days} jour{parseFloat(leave.days) > 1 ? "s" : ""})
                        </span>
                      </div>
                      {leave.reason && (
                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {leave.reason}
                        </p>
                      )}
                      {leave.type === "sick" && leave.medicalCertificate && (
                        <Badge variant="success" className="mt-1">Certificat médical fourni</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(leave.status)}
                    {leave.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          icon={<CheckCircle size={16} />}
                          onClick={() => handleApprove(leave.id)}
                        >
                          Approuver
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<XCircle size={16} />}
                          onClick={() => handleReject(leave.id)}
                        >
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Leave Modal - Adapté au Code du Travail Béninois */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvelle demande de congé"
          size="lg"
        >
          <form className="space-y-4">
            <Select
              label="Type de congé"
              options={[
                { value: "annual", label: `Congé annuel (${OHADA_CONFIG.leaves.annual.daysPerYear} jours/an)` },
                { value: "sick", label: "Congé maladie" },
                { value: "maternity", label: `Maternité (${OHADA_CONFIG.leaves.maternity.total} semaines)` },
                { value: "paternity", label: `Paternité (${OHADA_CONFIG.leaves.paternity.days} jours)` },
                { value: "family_event", label: "Événement familial" },
                { value: "recovery", label: "Récupération" },
                { value: "unpaid", label: "Congé sans solde" },
                { value: "other", label: "Autre" },
              ]}
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
            />

            {selectedLeaveType === "family_event" && (
              <Select
                label="Type d'événement"
                options={[
                  { value: "", label: "Sélectionner l'événement..." },
                  ...OHADA_CONFIG.leaves.familyEvents.map(e => ({
                    value: e.event,
                    label: `${e.label} (${e.days} jour${e.days > 1 ? "s" : ""})`
                  }))
                ]}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de début" type="date" required />
              <Input label="Date de fin" type="date" required />
            </div>

            {selectedLeaveType === "sick" && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="medical" className="rounded" />
                <label htmlFor="medical" className="text-sm text-slate-600">
                  Certificat médical fourni (obligatoire au-delà de {OHADA_CONFIG.leaves.sickLeave.waitingPeriod} jours)
                </label>
              </div>
            )}

            <Textarea label="Motif (optionnel)" placeholder="Raison de la demande..." />

            {/* Rappel des droits */}
            {selectedLeaveType === "annual" && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <strong>Rappel :</strong> Droit à {OHADA_CONFIG.leaves.annual.daysPerYear} jours ouvrables/an. 
                Bonus d'ancienneté après {OHADA_CONFIG.leaves.annual.seniorityBonus[0].years} ans.
              </div>
            )}

            {selectedLeaveType === "maternity" && (
              <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                <strong>Congé maternité :</strong> {OHADA_CONFIG.leaves.maternity.prenatal} semaines avant 
                et {OHADA_CONFIG.leaves.maternity.postnatal} semaines après l'accouchement. 
                Pris en charge par la CNSS.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button type="submit">Soumettre la demande</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
