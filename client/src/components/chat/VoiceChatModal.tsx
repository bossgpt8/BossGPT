import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";
import { useEffect, useState } from "react";

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export function VoiceChatModal({ isOpen, onClose, isRecording, onToggleRecording }: VoiceChatModalProps) {
  const { currentModel } = useChatStore();
  const [dots, setDots] = useState("...");

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 5 ? "." : prev + ".");
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const getModelLabel = (modelId: string) => {
    if (modelId.includes("qwen")) return "Qwen3 Omni";
    if (modelId.includes("llama")) return "Llama 3.3";
    if (modelId.includes("deepseek")) return "DeepSeek R1";
    return "Zeno AI";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white"
        >
          {/* Top Info (Optional, keeping it clean) */}
          <div className="absolute top-10 flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">Voice Mode</span>
          </div>

          {/* Glowing Orb */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: isRecording ? [1, 1.1, 1] : 1,
                opacity: isRecording ? [0.5, 0.8, 0.5] : 0.5,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-3xl absolute"
            />
            <motion.div
              animate={{
                scale: isRecording ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/80 via-pink-400/80 to-blue-400/80 shadow-[0_0_60px_rgba(168,85,247,0.4)] flex items-center justify-center overflow-hidden"
            >
               {/* Inner glow/texture */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
            </motion.div>
          </div>

          {/* Controls & Status */}
          <div className="absolute bottom-20 w-full max-w-md flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isRecording ? [4, 12, 4] : 4,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
              <h2 className="text-xl font-medium tracking-tight">
                {isRecording ? "I'm listening" : "Paused"}
              </h2>
              <p className="text-sm text-muted-foreground font-medium opacity-60 mt-4">
                {getModelLabel(currentModel)}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border-none no-default-hover-elevate"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border-none no-default-hover-elevate"
              >
                <Settings2 className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`w-14 h-14 rounded-full border-none transition-all no-default-hover-elevate ${
                  isRecording 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={onToggleRecording}
              >
                {isRecording ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
