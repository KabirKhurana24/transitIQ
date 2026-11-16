'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
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
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Reset Password</h2>
        <p className="mt-2 text-sm text-slate-400">
          Recover your enterprise TransitIQ access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-800 bg-slate-900 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Password Recovery</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your verified work email address to receive password reset instructions.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <p className="font-semibold">Reset Link Sent</p>
                <p className="text-xs text-emerald-300/80">
                  If an account exists for {email}, a password reset link has been dispatched to your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                >
                  {loading ? 'Sending Request...' : 'Send Reset Link'}
                </Button>
              </form>
            )}
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
