import { Message } from "@/interfaces/interfaces";
import { API_ENDPOINTS } from "./constants";
import { apiClient } from "./apiClient";
import {
  IChatMessageService,
  MessageResponse,
  DeleteMessageResponse,
  MessageRole,
} from "./interfaces";

/**
 * Implementation of the Chat Message Service
 */
export class ChatMessageService implements IChatMessageService {
  private static instance: ChatMessageService;

  private constructor() {}

  /**
   * Get singleton instance of ChatMessageService
   */
  public static getInstance(): ChatMessageService {
    if (!ChatMessageService.instance) {
      ChatMessageService.instance = new ChatMessageService();
    }
    return ChatMessageService.instance;
  }

  /**
   * Create a new chat message
   */
  public async createMessage(
    chatSessionId: string,
    content: string,
    role: MessageRole
  ): Promise<MessageResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT_MESSAGES, {
        chatSessionId,
        content,
        role,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating chat message:", error);
      throw error;
    }
  }

  /**
   * Fetch all messages, optionally filtered by session ID
   */
  public async getMessages(chatSessionId?: string): Promise<MessageResponse[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT_MESSAGES, {
        params: chatSessionId ? { chatSessionId } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  }

  /**
   * Fetch a single message by ID
   */
  public async getMessageById(id: string): Promise<MessageResponse> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CHAT_MESSAGES}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat message with ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing message
   */
  public async updateMessage(
    id: string,
    content: string
  ): Promise<MessageResponse> {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CHAT_MESSAGES}/${id}`,
        {
          content,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating chat message with ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  public async deleteMessage(id: string): Promise<DeleteMessageResponse> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CHAT_MESSAGES}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting chat message with ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete all messages for a session
   */
  public async deleteAllSessionMessages(chatSessionId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_ENDPOINTS.CHAT_MESSAGES}/session/${chatSessionId}`
      );
    } catch (error) {
      console.error(
        `Error deleting messages for session ID: ${chatSessionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Convert API response to application Message format
   */
  public mapToAppMessage(message: MessageResponse): Message {
    return {
      id: message.id,
      content: message.content,
      role: message.role.toLowerCase() as "user" | "assistant" | "system",
    };
  }
}

// Export a default instance
export const chatMessageService = ChatMessageService.getInstance();

/**
 * Legacy functions for backward compatibility
 * @deprecated Use chatMessageService methods instead
 */
export async function createChatMessage(params: {
  chatSessionId: string;
  content: string;
  role: MessageRole;
}): Promise<MessageResponse> {
  return chatMessageService.createMessage(
    params.chatSessionId,
    params.content,
    params.role
  );
}

export async function getChatMessages(
  chatSessionId?: string
): Promise<MessageResponse[]> {
  return chatMessageService.getMessages(chatSessionId);
}

export async function getChatMessageById(id: string): Promise<MessageResponse> {
  return chatMessageService.getMessageById(id);
}

export async function updateChatMessage(
  id: string,
  params: { content: string }
): Promise<MessageResponse> {
  return chatMessageService.updateMessage(id, params.content);
}

export async function deleteChatMessage(
  id: string
): Promise<DeleteMessageResponse> {
  return chatMessageService.deleteMessage(id);
}

export async function deleteAllSessionMessages(
  chatSessionId: string
): Promise<void> {
  return chatMessageService.deleteAllSessionMessages(chatSessionId);
}

/**
 * Export the mapToAppMessage function for backward compatibility
 * @deprecated Use chatMessageService.mapToAppMessage instead
 */
export function mapToAppMessage(message: MessageResponse): Message {
  return chatMessageService.mapToAppMessage(message);
}
