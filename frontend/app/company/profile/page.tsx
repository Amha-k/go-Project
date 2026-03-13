'use client';

import { useContext, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CompanyProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to view your profile</p>
        <Button onClick={() => router.push('/company/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Manage your company information</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="company@example.com"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{formData.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
