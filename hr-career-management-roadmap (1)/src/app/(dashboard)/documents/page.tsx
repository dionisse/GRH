"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Folder,
  File,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function DocumentsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");

  const folders = [
    { id: "all", name: "Tous les documents", count: 45 },
    { id: "contracts", name: "Contrats", count: 12 },
    { id: "payslips", name: "Bulletins de paie", count: 24 },
    { id: "certificates", name: "Certificats", count: 5 },
    { id: "policies", name: "Politiques RH", count: 4 },
  ];

  const documents = [
    {
      id: "1",
      name: "Contrat CDI - Marie Dupont.pdf",
      type: "contract",
      size: "245 KB",
      employee: "Marie Dupont",
      uploadedAt: "15/01/2024",
      uploadedBy: "Admin RH",
    },
    {
      id: "2",
      name: "Bulletin de paie - Janvier 2024.pdf",
      type: "payslip",
      size: "128 KB",
      employee: "Pierre Martin",
      uploadedAt: "31/01/2024",
      uploadedBy: "Système",
    },
    {
      id: "3",
      name: "Certificat AWS - Sophie Bernard.pdf",
      type: "certificate",
      size: "512 KB",
      employee: "Sophie Bernard",
      uploadedAt: "20/01/2024",
      uploadedBy: "Sophie Bernard",
    },
    {
      id: "4",
      name: "Politique télétravail 2024.pdf",
      type: "policy",
      size: "1.2 MB",
      employee: null,
      uploadedAt: "01/01/2024",
      uploadedBy: "Admin RH",
    },
    {
      id: "5",
      name: "Règlement intérieur.pdf",
      type: "policy",
      size: "2.1 MB",
      employee: null,
      uploadedAt: "15/09/2023",
      uploadedBy: "Admin RH",
    },
  ];

  const getTypeIcon = (type: string) => {
    return <FileText size={20} className="text-blue-500" />;
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; variant: "primary" | "success" | "warning" | "danger" | "gray" }> = {
      contract: { label: "Contrat", variant: "primary" },
      payslip: { label: "Paie", variant: "success" },
      certificate: { label: "Certificat", variant: "warning" },
      policy: { label: "Politique", variant: "gray" },
    };
    const config = types[type] || { label: type, variant: "gray" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredDocuments =
    selectedFolder === "all"
      ? documents
      : documents.filter((doc) => {
          if (selectedFolder === "contracts") return doc.type === "contract";
          if (selectedFolder === "payslips") return doc.type === "payslip";
          if (selectedFolder === "certificates") return doc.type === "certificate";
          if (selectedFolder === "policies") return doc.type === "policy";
          return true;
        });

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gestion documentaire
            </h2>
            <p className="text-slate-500">
              Stockez et organisez tous vos documents RH
            </p>
          </div>
          <Button icon={<Upload size={18} />} onClick={() => setShowUploadModal(true)}>
            Importer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <h3 className="font-semibold mb-4 px-2">Dossiers</h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder
                        size={18}
                        className={
                          selectedFolder === folder.id
                            ? "text-blue-500"
                            : "text-slate-400"
                        }
                      />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{folder.count}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Storage Info */}
            <Card className="mt-4">
              <h3 className="font-semibold mb-3">Stockage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Utilisé</span>
                  <span>2.4 GB / 10 GB</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-blue-600 rounded-full" />
                </div>
              </div>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher un document..."
                    icon={<Search size={18} />}
                  />
                </div>
                <Select
                  options={[
                    { value: "recent", label: "Plus récent" },
                    { value: "name", label: "Nom A-Z" },
                    { value: "size", label: "Taille" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        {getTypeIcon(doc.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {doc.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeBadge(doc.type)}
                          <span className="text-xs text-slate-400">
                            {doc.size} • {doc.uploadedAt}
                          </span>
                          {doc.employee && (
                            <span className="text-xs text-slate-500">
                              • {doc.employee}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
                        Voir
                      </Button>
                      <Button variant="ghost" size="sm" icon={<Download size={16} />}>
                        Télécharger
                      </Button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Importer un document"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
              <Upload size={40} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-sm text-slate-400 mb-4">ou</p>
              <Button variant="secondary">Parcourir</Button>
              <p className="text-xs text-slate-400 mt-4">
                PDF, DOC, DOCX, XLS, XLSX • Max 10 MB
              </p>
            </div>
            <Select
              label="Type de document"
              options={[
                { value: "", label: "Sélectionner..." },
                { value: "contract", label: "Contrat" },
                { value: "payslip", label: "Bulletin de paie" },
                { value: "certificate", label: "Certificat" },
                { value: "policy", label: "Politique RH" },
                { value: "other", label: "Autre" },
              ]}
            />
            <Select
              label="Associer à un employé (optionnel)"
              options={[
                { value: "", label: "Document général" },
                { value: "1", label: "Marie Dupont" },
                { value: "2", label: "Pierre Martin" },
                { value: "3", label: "Sophie Bernard" },
              ]}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                Annuler
              </Button>
              <Button>Importer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
