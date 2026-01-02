import { Zap, Code, Sparkles, BookOpen, Lightbulb, Brush } from "lucide-react";
import { Card } from "@/components/ui/card";
import bossaiRobot from "@assets/bossai-robot.png";

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

const suggestions = [
  {
    icon: BookOpen,
    title: "Explain a concept",
    description: "Get clear explanations on any topic",
    prompt: "Explain the concept of quantum computing in simple terms",
  },
  {
    icon: Code,
    title: "Code help",
    description: "Debug, learn, or build projects",
    prompt: "Show me how to use the fetch API in JavaScript",
  },
  {
    icon: Sparkles,
    title: "Get creative",
    description: "Generate stories, ideas, and content",
    prompt: "Write a short story about a robot who discovers music",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    description: "Explore new possibilities together",
    prompt: "Give me some unique business ideas for a college student",
  },
  {
    icon: Zap,
    title: "Problem solver",
    description: "Work through challenges step-by-step",
    prompt: "Help me plan a budget for my first apartment",
  },
  {
    icon: Brush,
    title: "Image generation",
    description: "Create visuals from descriptions",
    prompt: "Generate an image of a futuristic workspace with lots of plants",
  },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-full p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
              <img 
                src={bossaiRobot} 
                alt="BossAI" 
                className="w-full h-full object-cover"
                data-testid="img-bossai-robot"
              />
            </div>
          </div>
          
          <h1 
            className="text-3xl md:text-4xl font-bold text-center mb-2"
            data-testid="text-welcome-title"
          >
            Good afternoon, Boss
          </h1>
          
          <p className="text-center text-muted-foreground text-sm md:text-base px-4">
            I'm here to help — whether you're learning, creating, or solving.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion) => (
            <Card
              key={suggestion.title}
              className="group p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
              onClick={() => onSuggestionClick(suggestion.prompt)}
              data-testid={`card-suggestion-${suggestion.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <suggestion.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground text-sm">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
