import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
];

export default function AvatarSetup() {
  const navigate = useNavigate();
  const { updateAvatar, user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleContinue = () => {
    updateAvatar(selectedAvatar);
    toast.success('Avatar updated successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Choose your avatar</CardTitle>
          <CardDescription>
            Select an avatar to personalize your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedAvatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                }`}
              >
                <Avatar>
                  <AvatarImage src={avatar} />
                </Avatar>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full">
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}