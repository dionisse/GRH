"use client";

import { useState } from "react";
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  DollarSign,
  ArrowUp,
  Search,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";

export default function CareersPage() {
  // Mock data for career progression
  const careerPaths = [
    {
      id: "1",
      employee: { name: "Marie Dupont", avatar: null },
      currentPosition: "Développeur Full Stack",
      targetPosition: "Tech Lead",
      progress: 65,
      skills: [
        { name: "Leadership", current: 60, required: 80 },
        { name: "Architecture", current: 70, required: 90 },
        { name: "Mentoring", current: 50, required: 75 },
      ],
      milestones: [
        { title: "Certification AWS", completed: true },
        { title: "Manager 2 juniors", completed: true },
        { title: "Projet architecture", completed: false },
        { title: "Formation leadership", completed: false },
      ],
    },
    {
      id: "2",
      employee: { name: "Pierre Martin", avatar: null },
      currentPosition: "Tech Lead",
      targetPosition: "CTO",
      progress: 40,
      skills: [
        { name: "Stratégie", current: 50, required: 90 },
        { name: "Management", current: 70, required: 85 },
        { name: "Vision produit", current: 55, required: 80 },
      ],
      milestones: [
        { title: "MBA ou équivalent", completed: false },
        { title: "Gérer équipe 10+", completed: true },
        { title: "Budget P&L", completed: false },
      ],
    },
  ];

  const promotions = [
    {
      id: "1",
      employee: "Sophie Bernard",
      from: "Marketing Associate",
      to: "Marketing Manager",
      date: "15/01/2024",
      increase: "+15%",
    },
    {
      id: "2",
      employee: "Jean Petit",
      from: "Comptable",
      to: "Responsable Comptable",
      date: "01/12/2023",
      increase: "+12%",
    },
  ];

  return (
    <DashboardLayout title="Suivi de carrière">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Plans de carrière</p>
              <p className="text-2xl font-bold">{careerPaths.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Promotions (année)</p>
              <p className="text-2xl font-bold">{promotions.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Objectifs atteints</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Augmentation moy.</p>
              <p className="text-2xl font-bold">+8%</p>
            </div>
          </Card>
        </div>

        {/* Career Paths */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Plans de développement individuel
            </h2>
            <Button icon={<TrendingUp size={18} />}>Nouveau plan</Button>
          </div>

          <div className="space-y-6">
            {careerPaths.map((path) => (
              <Card key={path.id}>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4">
                    <Avatar name={path.employee.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {path.employee.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">
                          {path.currentPosition}
                        </span>
                        <ArrowUp size={14} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {path.targetPosition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">Progression globale</span>
                      <span className="text-sm font-medium">{path.progress}%</span>
                    </div>
                    <Progress
                      value={path.progress}
                      color={path.progress >= 70 ? "green" : path.progress >= 40 ? "amber" : "red"}
                      showValue={false}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Skills */}
                  <div>
                    <h4 className="font-medium mb-3">Compétences à développer</h4>
                    <div className="space-y-3">
                      {path.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill.name}</span>
                            <span className="text-slate-500">
                              {skill.current}% / {skill.required}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress value={skill.current} showValue={false} size="sm" />
                            <div
                              className="absolute top-0 h-full w-0.5 bg-red-500"
                              style={{ left: `${skill.required}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="font-medium mb-3">Jalons</h4>
                    <div className="space-y-2">
                      {path.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-2 rounded-lg ${
                            milestone.completed
                              ? "bg-green-50"
                              : "bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              milestone.completed
                                ? "bg-green-500 text-white"
                                : "border-2 border-slate-300"
                            }`}
                          >
                            {milestone.completed && "✓"}
                          </div>
                          <span
                            className={
                              milestone.completed
                                ? "text-green-700"
                                : "text-slate-600"
                            }
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                  <Button variant="secondary" size="sm">
                    Voir le plan complet
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Promotions */}
        <Card>
          <CardHeader>
            <CardTitle>Promotions récentes</CardTitle>
            <CardDescription>Évolutions de carrière dans l'entreprise</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar name={promo.employee} size="md" />
                  <div>
                    <p className="font-medium">{promo.employee}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{promo.from}</span>
                      <ArrowUp size={14} className="text-green-500" />
                      <span className="text-green-600 font-medium">{promo.to}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="success">{promo.increase}</Badge>
                  <p className="text-xs text-slate-400 mt-1">{promo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
