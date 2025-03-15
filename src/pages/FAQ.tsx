import { DotPattern } from "@/components/ui/dot-pattern";
import { Faq } from "@/components/ui/faq";

export function FAQ() {
  return (
    <div className="min-h-screen pt-16 relative">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
      />
      <div className="relative z-10">
        <Faq />
      </div>
    </div>
  );
}