import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CVBuilderForm from './cv-builder-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import type { GeneratedCV } from '@/types';

export default async function CVBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: candidate } = await supabase
    .from('candidate_profiles')
    .select('tier, generated_cv, cv_generated_at')
    .eq('user_id', user.id)
    .single();

  if (!candidate) redirect('/dashboard/candidate');

  if (candidate.tier !== 'premium') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="bg-neutral-900 border-neutral-800 max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <Lock className="w-12 h-12 text-[#9B7B3C] mx-auto" />
            <h2 className="text-2xl font-serif text-white">CV Builder</h2>
            <p className="text-neutral-400">
              Upgrade to Premium to unlock the CV Builder.
              Get a professionally structured CV that makes you stand out to employers.
            </p>
            <Link href="/dashboard/candidate/subscription">
              <Button className="bg-[#9B7B3C] text-black hover:bg-[#7B6535] font-medium">
                Upgrade to Premium - £50/3 months
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <CVBuilderForm
        existingCV={candidate.generated_cv as GeneratedCV | null}
        lastGenerated={candidate.cv_generated_at}
      />
    </div>
  );
}
