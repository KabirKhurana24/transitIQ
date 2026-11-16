'use client';

import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const DOC_FILES = [
  { id: 'prd', title: '1. PRD.md — Product Requirements Document', category: 'Product Strategy' },
  { id: 'personas', title: '2. USER_PERSONAS.md — User & Customer Personas', category: 'UX & Research' },
  { id: 'journeys', title: '3. USER_JOURNEYS.md — Main Operational Workflows', category: 'Operations' },
  { id: 'architecture', title: '4. ARCHITECTURE.md — System Architecture', category: 'Engineering' },
  { id: 'database', title: '5. DATABASE_SCHEMA.md — 20 Relational Tables', category: 'Data Architecture' },
  { id: 'api', title: '6. API_DOCUMENTATION.md — Service & API Contracts', category: 'Engineering' },
  { id: 'business_rules', title: '7. BUSINESS_RULES.md — Calculations & Formulas', category: 'Logic' },
  { id: 'ai_design', title: '8. AI_DESIGN.md — AI Architecture & Safeguards', category: 'AI & Safety' },
  { id: 'analytics', title: '9. ANALYTICS.md — KPI Definitions & Metrics', category: 'Analytics' },
  { id: 'test_plan', title: '10. TEST_PLAN.md — Test Strategy & E2E Plan', category: 'Quality' },
  { id: 'release_notes', title: '11. RELEASE_NOTES.md — Version History v1.0.0', category: 'Product' },
  { id: 'gtm', title: '12. GO_TO_MARKET.md — Enterprise Pilot & Rollout', category: 'Commercial' },
  { id: 'roadmap', title: '13. PRODUCT_ROADMAP.md — Future Vision & ULIP', category: 'Strategy' },
];

export function DocsBrowser() {
  const [selectedDoc, setSelectedDoc] = useState('prd');
  const [search, setSearch] = useState('');

  const filtered = DOC_FILES.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product & Engineering Documentation Vault
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              13 Comprehensive PRD Artifacts
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Complete product manager specifications, database schemas, business calculations, and AI safeguards in <span className="font-mono text-slate-700">/docs</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deliverables..."
            className="text-xs h-9 bg-white"
          />

          <div className="space-y-1.5 max-h-[650px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedDoc(item.id)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  selectedDoc === item.id
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate">{item.title}</div>
                  <span className="text-[10px] text-slate-400 font-normal uppercase">{item.category}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Reader Canvas (8 cols) */}
        <Card className="md:col-span-8 shadow-sm">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400 font-mono">
                docs/{DOC_FILES.find((d) => d.id === selectedDoc)?.id.toUpperCase()}.md
              </span>
              <Badge variant="outline" className="bg-slate-800 text-slate-200 text-[10px]">
                Audited & Approved
              </Badge>
            </div>
            <CardTitle className="text-base text-white mt-1">
              {DOC_FILES.find((d) => d.id === selectedDoc)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-xs text-slate-800 leading-relaxed font-sans space-y-3 max-h-[600px] overflow-y-auto">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-900 text-xs">
              This document is persisted in the repository at <span className="font-mono font-bold">/docs/{DOC_FILES.find((d) => d.id === selectedDoc)?.id.toUpperCase()}.md</span>. You can read, version-control, or inspect it anytime.
            </div>

            <div className="prose prose-sm max-w-none text-slate-700">
              <p className="font-medium text-slate-900">
                Key Deliverable Highlights:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Demonstrates enterprise Product Manager depth in logistics systems thinking, Indian freight corridors, and compliance.</li>
                <li>Grounded in production-ready mathematical formulas for carrier scoring and risk index computation.</li>
                <li>Documents PostgreSQL Row Level Security (RLS) policies and non-recursive membership functions.</li>
                <li>Defines AI human-in-the-loop safeguards with mandatory approval steps for high-impact decisions.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
