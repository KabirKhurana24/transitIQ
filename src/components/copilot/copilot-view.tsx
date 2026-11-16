'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Send,
  Sparkles,
  Truck,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  content: string;
  supportingShipments?: string[];
  dataPoints?: Record<string, any>;
  suggestedFollowups?: string[];
  timestamp: string;
}

export function CopilotView({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'copilot',
      content: `Hello! I am your **TransitIQ Operations Copilot**. I have live telematics access to all **70 active consignments**, **12 contracted road carriers**, and freight reconciliation ledgers across your Indian corridors.\n\nAsk me about delayed shipments, carrier reliability, transport expenditures, or missing documentation.`,
      supportingShipments: [],
      suggestedFollowups: [
        'Which shipments are at risk today?',
        'Where are we spending the most on transportation?',
        'Which carriers are performing poorly?',
        'Find shipments with missing proof of delivery.',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      // Query the controlled, grounded TMS repository
      const response = tmsRepository.answerCopilotQuery(q);

      const copilotMsg: Message = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        content: response.answer,
        supportingShipments: response.supportingShipmentIds,
        dataPoints: response.dataPoints,
        suggestedFollowups: response.suggestedFollowups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
      setIsThinking(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Operations Copilot
            </h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Database Grounded
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Contextual decision intelligence assistant with controlled access to live transportation tables.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
          <Database className="h-3.5 w-3.5 text-blue-600" />
          <span>Restricted Query Scope: Apex Distribution India</span>
        </div>
      </div>

      {/* Suggested Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-blue-600" />
          <span>Quick queries:</span>
        </span>
        {[
          'Which shipments are at risk today?',
          'Where are we spending the most on transportation?',
          'Which carriers are performing poorly?',
          'Find shipments with missing proof of delivery.',
          'Why is shipment TMS-1039 delayed?',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full px-3 py-1 text-slate-700 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Card */}
      <Card className="min-h-[500px] flex flex-col justify-between shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'copilot' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 mt-0.5 shadow-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 shadow-2xs space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Content formatted with basic markdown bolding */}
                <div className="leading-relaxed whitespace-pre-wrap">
                  {msg.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-2 last:mb-0">
                      {paragraph.split('**').map((chunk, i) =>
                        i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
                      )}
                    </p>
                  ))}
                </div>

                {/* Grounded Citations & Clickable Supporting Shipments */}
                {msg.supportingShipments && msg.supportingShipments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-slate-500">Grounded Records:</span>
                    {msg.supportingShipments.map((shipmentNumber) => (
                      <Link
                        key={shipmentNumber}
                        href={`/shipments`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-semibold border border-blue-200 transition-colors"
                      >
                        <Truck className="h-3 w-3" />
                        <span>{shipmentNumber}</span>
                        <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Suggested drill-downs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowups.map((followup) => (
                        <button
                          key={followup}
                          onClick={() => handleSend(followup)}
                          className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded-md px-2 py-0.5 transition-colors cursor-pointer"
                        >
                          → {followup}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-right opacity-60 font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0 mt-0.5 font-bold text-xs">
                  ME
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                <span>Scanning transportation database records...</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 w-full"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about live shipments, bottlenecks, carrier quotes, or freight variances..."
              className="bg-white text-xs sm:text-sm h-10 shadow-2xs"
            />
            <Button
              type="submit"
              disabled={isThinking || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 shrink-0 shadow-xs"
            >
              <Send className="h-4 w-4 mr-1.5" />
              <span>Ask</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
