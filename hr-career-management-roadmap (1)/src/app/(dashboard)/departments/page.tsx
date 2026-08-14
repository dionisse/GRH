"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Building2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";

interface Department {
  id: string;
  name: string;
  description: string | null;
  manager: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setOrganizationId(user.organizationId);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const fetchDepartments = async () => {
      try {
        const response = await fetch(`/api/departments?organizationId=${organizationId}`);
        const data = await response.json();
        setDepartments(data.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [organizationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          ...formData,
        }),
      });
      const data = await response.json();
      setDepartments([...departments, { ...data.department, employeeCount: 0, manager: null }]);
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const totalEmployees = departments.reduce((acc, dept) => acc + dept.employeeCount, 0);

  return (
    <DashboardLayout title="Départements">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Départements</p>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Employés total</p>
              <p className="text-2xl font-bold">{totalEmployees}</p>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Structure organisationnelle
            </h2>
            <p className="text-slate-500">
              Gérez les départements et leur hiérarchie
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
            Nouveau département
          </Button>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="spinner w-8 h-8 text-blue-600" />
          </div>
        ) : departments.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">Aucun département créé</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              Créer le premier département
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <Card key={department.id} className="hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {department.name.charAt(0)}
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {department.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {department.description || "Aucune description"}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {department.employeeCount} employé{department.employeeCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  {department.manager && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={`${department.manager.firstName} ${department.manager.lastName}`}
                        size="sm"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {department.manager.firstName}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Org Chart Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Organigramme</CardTitle>
            <CardDescription>Vue hiérarchique de l'organisation</CardDescription>
          </CardHeader>
          <div className="flex flex-col items-center py-8">
            <div className="w-32 h-20 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold mb-4">
              Direction
            </div>
            <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600" />
            <div className="flex gap-8">
              {departments.slice(0, 4).map((dept, index) => (
                <div key={dept.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                  <div className="w-28 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-center px-2">
                    <span className="text-sm font-medium">{dept.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Add Department Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Nouveau département"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom du département"
              placeholder="ex: Ressources Humaines"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              placeholder="Description du département..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>
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
