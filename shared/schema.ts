import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// User model
export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Message type for chat
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  images: z.array(z.string()).optional(),
  timestamp: z.number(),
  parentId: z.string().nullable().optional(),
  branchIndex: z.number().optional(),
});

export type Message = z.infer<typeof messageSchema>;

// Conversation model
export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 128 }),
  title: text("title").notNull().default("New Chat"),
  messages: jsonb("messages").$type<Message[]>().default([]),
  model: text("model").default("amazon/nova-2-lite-v1:free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// AI Models configuration
export const AI_MODELS = {
  vision: [
    { id: "google/gemma-3-12b-it:free", name: "Gemma-12b", description: "Vision capable" },
    { id: "qwen/qwen2.5-vl-7b-instruct:free", name: "Qwen-VL", description: "Vision capable" },
  ],
  text: [
    { id: "meta-llama/llama-3.1-405b-instruct:free", name: "Llama-405B", description: "Best quality" },
    { id: "qwen/qwen3-4b:free", name: "Qwen3-4B", description: "Fast & efficient" },
    { id: "google/gemma-3-12b-it:free", name: "Gemma-12b", description: "Balanced" },
    { id: "google/gemma-3-4b-it:free", name: "Gemma-4b", description: "Lightweight" },
  ],
  image: [
    { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1-schnell", description: "Best quality" },
    { id: "stabilityai/stable-diffusion-3-medium", name: "SD3-Medium", description: "High-quality" },
    { id: "kandinsky-community/kandinsky-3", name: "Kandinsky-3", description: "Unique style" },
    { id: "Tongyi-MAI/Z-Image-Turbo", name: "Z-Image-Turbo", description: "Fast/Free" },
  ],
  code: [
    { id: "qwen/qwen3-coder:free", name: "Qwen Coder", description: "Code generation" },
  ],
} as const;

// Chat request/response types
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  model: z.string(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const imageGenerationRequestSchema = z.object({
  prompt: z.string().min(1),
  modelId: z.string(),
});

export type ImageGenerationRequest = z.infer<typeof imageGenerationRequestSchema>;

// Smart commands
export const SMART_COMMANDS = [
  { patterns: ["turn on flashlight", "torch on", "flashlight on"], action: "flashlightOn" },
  { patterns: ["turn off flashlight", "torch off", "flashlight off"], action: "flashlightOff" },
  { patterns: ["open whatsapp"], action: "openWhatsApp" },
  { patterns: ["open youtube"], action: "openYouTube" },
  { patterns: ["open gmail", "open email"], action: "openGmail" },
  { patterns: ["open instagram"], action: "openInstagram" },
  { patterns: ["open twitter", "open x"], action: "openTwitter" },
  { patterns: ["search google for"], action: "googleSearch" },
  { patterns: ["search youtube for"], action: "youtubeSearch" },
  { patterns: ["what time is it", "current time"], action: "tellTime" },
  { patterns: ["what date is it", "current date"], action: "tellDate" },
  { patterns: ["stop reading", "stop speaking"], action: "stopSpeaking" },
  { patterns: ["who are you", "introduce yourself"], action: "introduce" },
  { patterns: ["tell me a joke"], action: "tellJoke" },
] as const;
