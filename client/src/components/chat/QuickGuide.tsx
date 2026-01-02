import { HelpCircle, BookOpen, MessageSquare, Image as ImageIcon, Sparkles, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function QuickGuide() {
  const guides = [
    {
      icon: MessageSquare,
      title: "Contextual Intelligence",
      description: "Engage in sophisticated dialogue. Use Shift+Enter for professional formatting and multi-line precision."
    },
    {
      icon: ImageIcon,
      title: "Visual Analysis",
      description: "Bridge the gap between vision and text. Upload complex diagrams or imagery for instant, high-fidelity insights."
    },
    {
      icon: Sparkles,
      title: "Creative Synthesis",
      description: "Transform abstract concepts into stunning visual reality. Leverage our specialized image generation suite."
    },
    {
      icon: BookOpen,
      title: "Advanced Research",
      description: "Unlock deep-domain expertise. Toggle research modes for comprehensive technical analysis and data-driven reports."
    },
    {
      icon: Settings,
      title: "Engine Calibration",
      description: "Fine-tune Zeno's cognitive parameters. Customize personality, instructions, and visual identity for a bespoke AI experience."
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full h-9 rounded-md">
          <HelpCircle className="w-4 h-4" />
          Quick Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Quick Start Guide</DialogTitle>
          <DialogDescription>
            Learn how to get the most out of Zeno.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 py-4">
            {guides.map((guide, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">{guide.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
