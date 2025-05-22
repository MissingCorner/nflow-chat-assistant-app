import { ChatRequest, ChatResponse } from "@/types/chat";
import { API_ENDPOINTS } from "./constants";
import { apiClient } from "./apiClient";
import { IChatService } from "./interfaces";

/**
 * Implementation of the Chat Service
 */
export class ChatService implements IChatService {
  private static instance: ChatService;

  private constructor() {}

  /**
   * Get singleton instance of ChatService
   */
  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Send a message to the chat API
   */
  public async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT, request);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

// Export a default instance
export const chatService = ChatService.getInstance();
