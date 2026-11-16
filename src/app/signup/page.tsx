'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, ArrowLeft, Mail, Lock, User, Building, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('Apex Distribution India');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operations_manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company: companyName,
              default_role: role,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Successful registration redirect
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
          <Truck className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create TransitIQ Account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Join your organization transportation control network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Sign Up</CardTitle>
            <CardDescription className="text-slate-400">
              Provision your enterprise TMS credentials.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="pl-9 bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="company" className="text-slate-300">Company / Logistics Provider</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="company"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-300">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="pl-9 bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="pl-9 bg-slate-950 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-slate-300">Operational Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-sm bg-slate-950 border border-slate-700 rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="operations_manager">Operations Manager</option>
                  <option value="dispatcher">Senior Dispatcher</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="carrier_user">Carrier Partner</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-2"
              >
                {loading ? 'Registering...' : 'Register Enterprise Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <Link href="/login" className="flex items-center gap-1 text-slate-400 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
