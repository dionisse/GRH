"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Input";
import { OHADA_CONFIG, formatCFA } from "@/lib/ohada-config";

interface Employee {
  id: string;
  matricule: string;
  status: string;
  contractType: string;
  professionalCategory: string | null;
  hireDate: string;
  baseSalary: string;
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
    category: string | null;
  } | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`/api/employees?organizationId=${organizationId}`);
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [organizationId]);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.user.firstName} ${emp.user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           emp.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
           emp.user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Actif</Badge>;
      case "on_leave":
        return <Badge variant="warning">En congé</Badge>;
      case "suspended":
        return <Badge variant="danger">Suspendu</Badge>;
      case "inactive":
        return <Badge variant="gray">Inactif</Badge>;
      case "terminated":
        return <Badge variant="danger">Parti</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getContractLabel = (type: string) => {
    const contract = OHADA_CONFIG.contractTypes.find(c => c.value === type);
    return contract?.label || type.toUpperCase();
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return null;
    const cat = OHADA_CONFIG.professionalCategories.find(c => c.code === category);
    return cat?.label || category;
  };

  return (
    <DashboardLayout title="Employés">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gestion des employés
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {employees.length} employé{employees.length > 1 ? "s" : ""} au total • Bénin 🇧🇯
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" icon={<Download size={18} />}>
              Exporter
            </Button>
            <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
              Nouvel employé
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, matricule..."
                icon={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select
                options={[
                  { value: "", label: "Tous les départements" },
                  { value: "tech", label: "Direction Technique" },
                  { value: "rh", label: "Direction RH" },
                  { value: "commercial", label: "Direction Commerciale" },
                ]}
              />
              <Select
                options={[
                  { value: "", label: "Tous les contrats" },
                  ...OHADA_CONFIG.contractTypes.map(c => ({ value: c.value, label: c.label.split(" - ")[0] }))
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Employee Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner w-8 h-8 text-blue-600" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Aucun employé trouvé
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Link key={employee.id} href={`/employees/${employee.id}`}>
                <Card className="hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <Avatar
                      name={`${employee.user.firstName} ${employee.user.lastName}`}
                      src={employee.user.avatar}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {employee.user.lastName} {employee.user.firstName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {employee.position?.title || "Poste non défini"}
                          </p>
                          <p className="text-xs text-blue-600 font-mono mt-1">
                            {employee.matricule}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <MoreVertical size={18} className="text-slate-400" />
                        </button>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Mail size={14} />
                          <span className="truncate">{employee.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin size={14} />
                          <span>{employee.department?.name || "Non assigné"}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {getStatusBadge(employee.status)}
                        <Badge variant="gray">{getContractLabel(employee.contractType).split(" - ")[0]}</Badge>
                        {employee.professionalCategory && (
                          <Badge variant="primary">{employee.professionalCategory}</Badge>
                        )}
                      </div>

                      {employee.baseSalary && (
                        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {formatCFA(parseFloat(employee.baseSalary))}/mois
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Add Employee Modal - Adapté OHADA */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouvel employé"
          size="xl"
        >
          <form className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Informations personnelles
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom de famille" placeholder="DOSSOU" required />
                <Input label="Prénom(s)" placeholder="Akouavi" required />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input label="Date de naissance" type="date" />
                <Input label="Lieu de naissance" placeholder="Cotonou" />
                <Select
                  label="Sexe"
                  options={[
                    { value: "M", label: "Masculin" },
                    { value: "F", label: "Féminin" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input label="N° CNI / CIP" placeholder="0123456789" />
                <Input label="N° CNSS" placeholder="1234567-A" />
              </div>
            </div>

            {/* Coordonnées */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Coordonnées
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Email" type="email" placeholder="prenom.nom@entreprise.bj" required />
                <Input label="Téléphone" placeholder="+229 XX XX XX XX" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input label="Ville" placeholder="Cotonou" />
                <Select
                  label="Département"
                  options={[
                    { value: "", label: "Sélectionner..." },
                    ...OHADA_CONFIG.departments.map(d => ({ value: d.code, label: d.name }))
                  ]}
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Informations professionnelles
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Direction / Département"
                  options={[
                    { value: "", label: "Sélectionner..." },
                    { value: "tech", label: "Direction Technique" },
                    { value: "rh", label: "Direction RH" },
                    { value: "commercial", label: "Direction Commerciale" },
                    { value: "daf", label: "Direction Administrative et Financière" },
                  ]}
                />
                <Select
                  label="Type de contrat"
                  options={[
                    { value: "", label: "Sélectionner..." },
                    ...OHADA_CONFIG.contractTypes.map(c => ({ value: c.value, label: c.label }))
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Select
                  label="Catégorie professionnelle"
                  options={[
                    { value: "", label: "Sélectionner..." },
                    ...OHADA_CONFIG.professionalCategories.map(c => ({ 
                      value: c.code, 
                      label: `${c.code} - ${c.label}` 
                    }))
                  ]}
                />
                <Input label="Date d'embauche" type="date" required />
              </div>
            </div>

            {/* Rémunération */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Rémunération (FCFA)
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  label="Salaire de base" 
                  type="number" 
                  placeholder={OHADA_CONFIG.smig.monthly.toString()}
                />
                <Input 
                  label="Indemnité transport" 
                  type="number" 
                  placeholder="25000"
                />
                <Input 
                  label="Indemnité logement" 
                  type="number" 
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                SMIG actuel : {formatCFA(OHADA_CONFIG.smig.monthly)}/mois
              </p>
            </div>

            {/* Informations bancaires */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                Informations bancaires
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Banque" placeholder="BOA Bénin, Ecobank..." />
                <Input label="Numéro de compte" placeholder="BJ..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button type="submit">Créer l'employé</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
