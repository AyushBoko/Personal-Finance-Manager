import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wallet2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      toast.success('Registration successful!');
      navigate('/avatar-setup');
    } catch (error) {
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-8">
      <div className="w-full max-w-5xl grid grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Start your financial journey today</h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who trust our platform to manage their finances effectively and achieve their financial goals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">Get started in minutes with our simple onboarding</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">Secure Platform</h3>
              <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <Wallet2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-12 text-lg">
                Sign up
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}