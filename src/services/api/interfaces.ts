import { ChatRequest, ChatResponse, Session } from "@/types/chat";
import { Message } from "@/interfaces/interfaces";

/**
 * Interface for the Chat API service
 */
export interface IChatService {
  sendMessage(request: ChatRequest): Promise<ChatResponse>;
}

/**
 * Interface for the Chat Session service
 */
export interface IChatSessionService {
  createSession(title: string): Promise<Session>;
  getAllSessions(): Promise<Session[]>;
  getSessionById(id: string): Promise<Session>;
  updateSession(
    id: string,
    title?: string,
    archived?: boolean
  ): Promise<Session>;
  deleteSession(id: string): Promise<void>;
}

/**
 * Chat message role type
 */
export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

/**
 * Interface for message response from API
 */
export interface MessageResponse {
  id: string;
  chatSessionId: string;
  content: string;
  role: MessageRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for message deletion response
 */
export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Interface for the Chat Message service
 */
export interface IChatMessageService {
  createMessage(
    chatSessionId: string,
    content: string,
    role: MessageRole
  ): Promise<MessageResponse>;
  getMessages(chatSessionId?: string): Promise<MessageResponse[]>;
  getMessageById(id: string): Promise<MessageResponse>;
  updateMessage(id: string, content: string): Promise<MessageResponse>;
  deleteMessage(id: string): Promise<DeleteMessageResponse>;
  deleteAllSessionMessages(chatSessionId: string): Promise<void>;
  mapToAppMessage(message: MessageResponse): Message;
}
