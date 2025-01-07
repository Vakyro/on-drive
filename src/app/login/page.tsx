'use client';
import { login } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await login(formData);

    if (response.error) {
      setError(response.error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="flex justify-center mt-6">
          <Logo size={60} />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </div>
          </form>
          <div className="mt-4 text-right">
            <Link href="/admin/login" className="text-sm text-blue-500 hover:underline">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
