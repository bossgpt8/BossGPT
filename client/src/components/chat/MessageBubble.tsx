import { useState, useEffect, useRef } from "react";
import { Copy, Check, Volume2, ChevronLeft, ChevronRight, RotateCcw, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { Message } from "@shared/schema";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import bossaiRobot from "@assets/bossai-robot.png";

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  userName?: string;
  userAvatar?: string;
  onSpeak?: (text: string) => void;
  onRegenerate?: () => void;
  onEdit?: (id: string, content: string) => void;
  branchCount?: number;
  currentBranch?: number;
  onBranchChange?: (index: number) => void;
}

const AVATAR_COLORS: { [key: string]: string } = {
  "avatar-1": "bg-blue-500",
  "avatar-2": "bg-purple-500",
  "avatar-3": "bg-green-500",
  "avatar-4": "bg-orange-500",
  "avatar-5": "bg-pink-500",
  "avatar-6": "bg-cyan-500",
};

export function MessageBubble({
  message,
  isUser,
  userName = "User",
  userAvatar = "avatar-1",
  onSpeak,
  onRegenerate,
  onEdit,
  branchCount = 1,
  currentBranch = 0,
  onBranchChange,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const renderMarkdown = async () => {
      if (isUser) {
        setRenderedContent(DOMPurify.sanitize(message.content));
        return;
      }

      marked.setOptions({
        highlight: (code, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        },
      });

      const html = await marked(message.content);
      setRenderedContent(DOMPurify.sanitize(html));
    };

    renderMarkdown();
  }, [message.content, isUser]);

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre");
      codeBlocks.forEach((block) => {
        if (!block.querySelector(".copy-btn")) {
          const btn = document.createElement("button");
          btn.className = "copy-btn";
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
          btn.onclick = () => {
            const code = block.querySelector("code")?.textContent || "";
            navigator.clipboard.writeText(code);
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
            setTimeout(() => {
              btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
            }, 2000);
          };
          block.style.position = "relative";
          block.appendChild(btn);
        }
      });
    }
  }, [renderedContent]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && onEdit) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSaveEdit();
    }
  };

  return (
    <div 
      className={`group mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300 flex ${isUser ? "justify-end" : "justify-start"}`}
      data-testid={`message-${message.id}`}
    >
      <div className={`flex items-end gap-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white overflow-hidden ${
            isUser 
              ? AVATAR_COLORS[userAvatar] || "bg-blue-500"
              : "bg-muted"
          }`}
        >
          {isUser ? (
            <span>{userName.charAt(0).toUpperCase()}</span>
          ) : (
            <img 
              src={bossaiRobot} 
              alt="BossAI" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div className={`rounded-2xl px-4 py-2 ${
            isUser 
              ? "bg-primary text-primary-foreground rounded-br-none" 
              : "bg-muted text-foreground rounded-bl-none"
          }`}>
            {message.images && message.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Attached ${i + 1}`}
                    className="max-w-[150px] max-h-[150px] rounded-lg object-cover cursor-pointer"
                    onClick={() => window.open(img, "_blank")}
                    data-testid={`image-attachment-${i}`}
                  />
                ))}
              </div>
            )}
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] text-sm"
                  data-testid="textarea-edit-message"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    data-testid="button-cancel-edit"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={!editContent.trim() || editContent === message.content}
                    data-testid="button-save-edit"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                </div>
                <p className="text-xs opacity-70">
                  Press Ctrl+Enter to save, Escape to cancel
                </p>
              </div>
            ) : (
              <div 
                ref={contentRef}
                className={`text-sm leading-relaxed ${isUser ? "text-primary-foreground" : "text-foreground"} ${!isUser ? "prose prose-sm max-w-none prose-invert prose-p:my-1 prose-p:m-0 prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-3 prose-code:bg-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic prose-img:rounded-lg prose-img:max-w-full prose-h1:text-base prose-h1:font-bold prose-h2:text-sm prose-h2:font-bold prose-h3:text-sm prose-h3:font-bold" : ""}`}
                dangerouslySetInnerHTML={{ __html: isUser ? message.content : renderedContent }}
                data-testid="text-message-content"
              />
            )}
          </div>
          
          <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse mr-1" : "ml-1"}`}>
            {isUser && onEdit && !isEditing && (
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6"
                onClick={handleStartEdit}
                data-testid="button-edit-message"
              >
                <Pencil className="w-3 h-3" />
              </Button>
            )}
            
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6"
              onClick={handleCopy}
              data-testid="button-copy-message"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
            
            {!isUser && onSpeak && (
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6"
                onClick={() => onSpeak(message.content)}
                data-testid="button-speak-message"
              >
                <Volume2 className="w-3 h-3" />
              </Button>
            )}
            
            {!isUser && onRegenerate && (
              <Button
                size="icon"
                variant="ghost"
                className="w-6 h-6"
                onClick={onRegenerate}
                data-testid="button-regenerate"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
