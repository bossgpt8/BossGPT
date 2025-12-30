export function TypingIndicator() {
  return (
    <div className="mb-4 animate-in fade-in duration-300 flex justify-start">
      <div className="rounded-2xl px-4 py-2 bg-muted">
        <div className="flex gap-1.5" data-testid="typing-indicator">
          <span 
            className="w-2 h-2 bg-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
          />
          <span 
            className="w-2 h-2 bg-foreground rounded-full animate-bounce"
            style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
          />
          <span 
            className="w-2 h-2 bg-foreground rounded-full animate-bounce"
            style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
