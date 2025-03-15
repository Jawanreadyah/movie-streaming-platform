import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';

export function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 relative">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        <Button
          variant="ghost"
          className="absolute left-8 top-0 text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mt-16 space-y-8">
          <h1 className="text-6xl font-bold text-white">Coming Soon</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            We're working hard to bring you this exciting new feature. Stay tuned for updates!
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/10 rounded-lg" />
                <div className="h-24 bg-white/10 rounded-lg" />
                <div className="h-8 bg-white/10 rounded-lg w-2/3 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}