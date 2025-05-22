import { Session } from "@/types/chat";
import { API_ENDPOINTS } from "./constants";
import { apiClient } from "./apiClient";
import { IChatSessionService } from "./interfaces";

/**
 * Implementation of the Chat Session Service
 */
export class ChatSessionService implements IChatSessionService {
  private static instance: ChatSessionService;

  private constructor() {}

  /**
   * Get singleton instance of ChatSessionService
   */
  public static getInstance(): ChatSessionService {
    if (!ChatSessionService.instance) {
      ChatSessionService.instance = new ChatSessionService();
    }
    return ChatSessionService.instance;
  }

  /**
   * Create a new chat session
   */
  public async createSession(title: string): Promise<Session> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT_SESSIONS, {
        title,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }

  /**
   * Fetch all chat sessions
   */
  public async getAllSessions(): Promise<Session[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT_SESSIONS);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
  }

  /**
   * Fetch a single chat session by ID
   */
  public async getSessionById(id: string): Promise<Session> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CHAT_SESSIONS}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching chat session with ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing chat session
   */
  public async updateSession(
    id: string,
    title?: string,
    archived?: boolean
  ): Promise<Session> {
    const updateData: { title?: string; archived?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (archived !== undefined) updateData.archived = archived;

    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.CHAT_SESSIONS}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating chat session with ID: ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a chat session
   */
  public async deleteSession(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.CHAT_SESSIONS}/${id}`);
    } catch (error) {
      console.error(`Error deleting chat session with ID: ${id}:`, error);
      throw error;
    }
  }
}

// Export a default instance
export const chatSessionService = ChatSessionService.getInstance();

/**
 * Legacy functions for backward compatibility
 * @deprecated Use chatSessionService methods instead
 */
export async function createChatSession(params: {
  title: string;
}): Promise<Session> {
  return chatSessionService.createSession(params.title);
}

export async function getAllChatSessions(): Promise<Session[]> {
  return chatSessionService.getAllSessions();
}

export async function getChatSessionById(id: string): Promise<Session> {
  return chatSessionService.getSessionById(id);
}

export async function updateChatSession(
  id: string,
  params: { title?: string; archived?: boolean }
): Promise<Session> {
  return chatSessionService.updateSession(id, params.title, params.archived);
}

export async function deleteChatSession(id: string): Promise<void> {
  return chatSessionService.deleteSession(id);
}
