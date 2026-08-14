"use client";

import { useState } from "react";
import {
  DollarSign,
  FileText,
  Download,
  Calculator,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { 
  OHADA_CONFIG, 
  formatCFA, 
  calculateCNSS, 
  calculateITS, 
  calculateNetSalary,
  calculateSeniorityBonus
} from "@/lib/ohada-config";

export default function PayrollPage() {
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorData, setSimulatorData] = useState({
    baseSalary: OHADA_CONFIG.smig.monthly,
    transportAllowance: 25000,
    housingAllowance: 0,
    yearsOfService: 0,
  });

  // Mock payroll data
  const payrollPeriods = [
    { period: "2024-01", status: "paid", employees: 25, grossTotal: 8500000, netTotal: 6800000 },
    { period: "2024-02", status: "validated", employees: 25, grossTotal: 8650000, netTotal: 6920000 },
    { period: "2024-03", status: "draft", employees: 26, grossTotal: 8900000, netTotal: 7120000 },
  ];

  const currentPayroll = [
    { name: "DOSSOU Akouavi", matricule: "MAT00001", baseSalary: 220000, netSalary: 175600, status: "calculated" },
    { name: "AGBODJAN Koffi", matricule: "MAT00002", baseSalary: 380000, netSalary: 298400, status: "calculated" },
    { name: "HOUNGBO Afiwa", matricule: "MAT00003", baseSalary: 150000, netSalary: 122500, status: "calculated" },
    { name: "TOKPANOU Codjo", matricule: "MAT00004", baseSalary: 200000, netSalary: 161200, status: "calculated" },
    { name: "ASSOGBA Fifamè", matricule: "MAT00005", baseSalary: 280000, netSalary: 221200, status: "calculated" },
  ];

  // Calculate simulation
  const seniorityBonus = calculateSeniorityBonus(simulatorData.baseSalary, simulatorData.yearsOfService);
  const grossWithBonus = simulatorData.baseSalary + seniorityBonus;
  const simulation = calculateNetSalary(
    grossWithBonus,
    simulatorData.transportAllowance,
    simulatorData.housingAllowance
  );

  const totalGross = currentPayroll.reduce((acc, p) => acc + p.baseSalary, 0);
  const totalNet = currentPayroll.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <DashboardLayout title="Paie">
      <div className="space-y-6">
        {/* Rappel légal */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">
                Conformité OHADA - Bénin
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                SMIG : {formatCFA(OHADA_CONFIG.smig.monthly)}/mois • 
                Cotisations CNSS : {(OHADA_CONFIG.socialContributions.cnss.employee.total * 100).toFixed(1)}% salarié + 
                {(OHADA_CONFIG.socialContributions.cnss.employer.total * 100).toFixed(1)}% employeur • 
                Plafond CNSS : {formatCFA(OHADA_CONFIG.socialContributions.cnss.ceiling)}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Masse salariale</p>
              <p className="text-xl font-bold">{formatCFA(totalGross)}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Employés</p>
              <p className="text-xl font-bold">{currentPayroll.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total net</p>
              <p className="text-xl font-bold">{formatCFA(totalNet)}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Période</p>
              <p className="text-xl font-bold">Mars 2024</p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gestion de la paie
            </h2>
            <p className="text-slate-500">Bulletins de paie conformes OHADA / SYSCOHADA</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" icon={<Calculator size={18} />} onClick={() => setShowSimulator(true)}>
              Simulateur
            </Button>
            <Button variant="secondary" icon={<Download size={18} />}>
              Déclaration CNSS
            </Button>
            <Button icon={<FileText size={18} />}>
              Générer bulletins
            </Button>
          </div>
        </div>

        {/* Payroll History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des périodes de paie</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {payrollPeriods.map((period) => (
              <div
                key={period.period}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {new Date(period.period + "-01").toLocaleDateString("fr-BJ", { month: "long", year: "numeric" })}
                    </p>
                    <p className="text-sm text-slate-500">
                      {period.employees} employés • Brut: {formatCFA(period.grossTotal)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCFA(period.netTotal)}</p>
                    <p className="text-xs text-slate-400">Net à payer</p>
                  </div>
                  <Badge
                    variant={
                      period.status === "paid" ? "success" :
                      period.status === "validated" ? "primary" : "warning"
                    }
                  >
                    {period.status === "paid" ? "Payé" :
                     period.status === "validated" ? "Validé" : "Brouillon"}
                  </Badge>
                  <Button variant="secondary" size="sm">Voir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Current Period Payroll */}
        <Card>
          <CardHeader>
            <CardTitle>Paie en cours - Mars 2024</CardTitle>
            <CardDescription>Calculs basés sur les paramètres OHADA</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Employé</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">Salaire brut</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">CNSS</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">ITS</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">Net à payer</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500">Statut</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayroll.map((employee) => {
                  const cnss = calculateCNSS(employee.baseSalary);
                  const its = calculateITS(employee.baseSalary - cnss.employeeContribution);
                  
                  return (
                    <tr key={employee.matricule} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={employee.name} size="sm" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{employee.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{employee.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCFA(employee.baseSalary)}
                      </td>
                      <td className="text-right py-3 px-4 text-red-600">
                        -{formatCFA(cnss.employeeContribution)}
                      </td>
                      <td className="text-right py-3 px-4 text-red-600">
                        -{formatCFA(its)}
                      </td>
                      <td className="text-right py-3 px-4 font-bold text-green-600">
                        {formatCFA(employee.netSalary)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="success">Calculé</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Button variant="ghost" size="sm" icon={<FileText size={14} />}>
                          Bulletin
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold">Total</td>
                  <td className="text-right py-3 px-4 font-bold">{formatCFA(totalGross)}</td>
                  <td className="text-right py-3 px-4 font-bold text-red-600">
                    -{formatCFA(currentPayroll.reduce((acc, p) => acc + calculateCNSS(p.baseSalary).employeeContribution, 0))}
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-red-600">
                    -{formatCFA(currentPayroll.reduce((acc, p) => {
                      const cnss = calculateCNSS(p.baseSalary);
                      return acc + calculateITS(p.baseSalary - cnss.employeeContribution);
                    }, 0))}
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-green-600">
                    {formatCFA(totalNet)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* CNSS Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cotisations CNSS</CardTitle>
              <CardDescription>Déclaration mensuelle</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium">Part salariale ({(OHADA_CONFIG.socialContributions.cnss.employee.total * 100).toFixed(1)}%)</p>
                  <p className="text-sm text-slate-500">Retenue sur salaire</p>
                </div>
                <p className="font-bold">
                  {formatCFA(currentPayroll.reduce((acc, p) => acc + calculateCNSS(p.baseSalary).employeeContribution, 0))}
                </p>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium">Part patronale ({(OHADA_CONFIG.socialContributions.cnss.employer.total * 100).toFixed(1)}%)</p>
                  <p className="text-sm text-slate-500">Charge employeur</p>
                </div>
                <p className="font-bold">
                  {formatCFA(currentPayroll.reduce((acc, p) => acc + calculateCNSS(p.baseSalary).employerContribution, 0))}
                </p>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Total à verser à la CNSS</p>
                </div>
                <p className="font-bold text-blue-600">
                  {formatCFA(currentPayroll.reduce((acc, p) => acc + calculateCNSS(p.baseSalary).total, 0))}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impôts (ITS)</CardTitle>
              <CardDescription>Impôt sur Traitements et Salaires</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium">Total ITS retenu</p>
                  <p className="text-sm text-slate-500">À reverser à la DGI</p>
                </div>
                <p className="font-bold text-red-600">
                  {formatCFA(currentPayroll.reduce((acc, p) => {
                    const cnss = calculateCNSS(p.baseSalary);
                    return acc + calculateITS(p.baseSalary - cnss.employeeContribution);
                  }, 0))}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="font-medium mb-2">Barème ITS applicable</p>
                <div className="text-xs text-slate-500 space-y-1">
                  {OHADA_CONFIG.its.brackets.map((bracket, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {i === 0 ? "0" : formatCFA(bracket.min)} - {bracket.max === Infinity ? "+" : formatCFA(bracket.max)}
                      </span>
                      <span className="font-medium">{(bracket.rate * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Salary Simulator Modal */}
        <Modal
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
          title="Simulateur de salaire - Bénin"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salaire de base (FCFA)"
                type="number"
                value={simulatorData.baseSalary}
                onChange={(e) => setSimulatorData({ ...simulatorData, baseSalary: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Années d'ancienneté"
                type="number"
                value={simulatorData.yearsOfService}
                onChange={(e) => setSimulatorData({ ...simulatorData, yearsOfService: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Indemnité transport (FCFA)"
                type="number"
                value={simulatorData.transportAllowance}
                onChange={(e) => setSimulatorData({ ...simulatorData, transportAllowance: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Indemnité logement (FCFA)"
                type="number"
                value={simulatorData.housingAllowance}
                onChange={(e) => setSimulatorData({ ...simulatorData, housingAllowance: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Results */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Résultat de la simulation</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span>Salaire de base</span>
                  <span className="font-medium">{formatCFA(simulatorData.baseSalary)}</span>
                </div>
                {seniorityBonus > 0 && (
                  <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>Prime d'ancienneté ({simulatorData.yearsOfService} ans)</span>
                    <span className="font-medium text-green-600">+{formatCFA(seniorityBonus)}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span>Salaire brut</span>
                  <span className="font-bold">{formatCFA(simulation.grossSalary)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span>CNSS salarié (3.6%)</span>
                  <span className="font-medium text-red-600">-{formatCFA(simulation.cnssEmployee)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span>ITS</span>
                  <span className="font-medium text-red-600">-{formatCFA(simulation.its)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span>Indemnités (transport + logement)</span>
                  <span className="font-medium text-blue-600">+{formatCFA(simulatorData.transportAllowance + simulatorData.housingAllowance)}</span>
                </div>
                <div className="flex justify-between p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                  <span className="font-bold text-green-800 dark:text-green-200">Salaire net à payer</span>
                  <span className="font-bold text-xl text-green-600">{formatCFA(simulation.netSalary)}</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span>CNSS employeur (17.4%)</span>
                  <span className="font-medium text-purple-600">{formatCFA(simulation.cnssEmployer)}</span>
                </div>
                <div className="flex justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="font-medium">Coût total employeur</span>
                  <span className="font-bold text-amber-600">{formatCFA(simulation.totalCost)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setShowSimulator(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
