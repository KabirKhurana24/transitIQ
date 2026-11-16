'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { DEMO_USERS } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ops@apexdist.in');
  const [password, setPassword] = useState('TransitIQ@2026!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      // If real Supabase keys are configured, attempt real auth
      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If credentials fail in real DB, show message
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }
      }

      // Successful login redirect to Control Tower
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('TransitIQ@2026!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
          <Truck className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">TransitIQ TMS</h2>
        <p className="mt-2 text-sm text-slate-400">
          AI-First Transportation Management System for Indian Logistics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-white">Enterprise Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in with your organization email or select a verified demo account below.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="pl-9 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-md shadow-blue-600/20"
              >
                {loading ? 'Authenticating with Supabase...' : 'Sign In to Dashboard'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Demo Quick-Fill Accounts Grid */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span>Verified Demo Accounts (1-Click Fill)</span>
                </span>
                <span className="text-[11px] text-slate-500">Pass: TransitIQ@2026!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_USERS.map((u) => {
                  const isSelected = email === u.email;
                  return (
                    <button
                      key={u.role}
                      type="button"
                      onClick={() => selectDemoUser(u.email)}
                      className={`text-left p-2.5 rounded-lg border transition-all text-xs cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">{u.name}</span>
                        {isSelected && <UserCheck className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{u.title}</p>
                      <p className="text-[10px] text-blue-400 font-mono mt-1">{u.email}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>New carrier or enterprise partner?</span>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Create an account
            </Link>
          </CardFooter>
        </Card>

        {/* Security & Multi-tenant banner */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>PostgreSQL Row Level Security (RLS) Tenant Isolation Enabled</span>
        </div>
      </div>
    </div>
  );
}
