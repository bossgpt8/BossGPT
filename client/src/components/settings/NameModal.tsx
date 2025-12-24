import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface NameModalProps {
  open: boolean;
  onClose: () => void;
  onSetName: (name: string) => void;
  currentName?: string;
}

export function NameModal({ open, onClose, onSetName, currentName = "User" }: NameModalProps) {
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSetName(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>What's your name?</DialogTitle>
          <DialogDescription>
            BossAI will use this name to personalize your conversations and make them feel more friendly and personal!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-base"
              data-testid="input-user-name"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose} data-testid="button-cancel-name">
              Skip for now
            </Button>
            <Button type="submit" disabled={!name.trim()} data-testid="button-save-name">
              Let's go!
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
