/**
 * Collaboration Store
 * Zustand store for managing real-time collaboration state (presence, sessions, cursors, annotations)
 */

import { create } from 'zustand';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface RemoteCursor {
  user: User;
  position: CursorPosition;
  color: string;
}

export interface Annotation {
  id: string;
  user: User;
  content: string;
  position: { x: number; y: number };
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: string;
  name: string;
  domain: string;
  createdBy: User;
  createdAt: number;
  participants: User[];
}

export interface CollaborationState {
  // Presence
  activeUsers: Map<string, User>;
  userCursors: Map<string, RemoteCursor>;
  
  // Sessions
  currentSession: Session | null;
  sessions: Map<string, Session>;
  
  // Annotations
  annotations: Map<string, Annotation>;
  
  // Actions
  addActiveUser: (user: User) => void;
  removeActiveUser: (userId: string) => void;
  updateUserCursor: (userId: string, position: CursorPosition, user: User) => void;
  removeUserCursor: (userId: string) => void;
  
  setCurrentSession: (session: Session | null) => void;
  addSession: (session: Session) => void;
  removeSession: (sessionId: string) => void;
  updateSessionParticipants: (sessionId: string, participants: User[]) => void;
  
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (annotationId: string) => void;
  
  clearAll: () => void;
}

// Generate color for user cursor
function getUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8C471', '#82E0AA',
  ];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  activeUsers: new Map(),
  userCursors: new Map(),
  currentSession: null,
  sessions: new Map(),
  annotations: new Map(),

  addActiveUser: (user) =>
    set((state) => {
      const newUsers = new Map(state.activeUsers);
      newUsers.set(user.id, user);
      return { activeUsers: newUsers };
    }),

  removeActiveUser: (userId) =>
    set((state) => {
      const newUsers = new Map(state.activeUsers);
      newUsers.delete(userId);
      const newCursors = new Map(state.userCursors);
      newCursors.delete(userId);
      return { activeUsers: newUsers, userCursors: newCursors };
    }),

  updateUserCursor: (userId, position, user) =>
    set((state) => {
      const newCursors = new Map(state.userCursors);
      newCursors.set(userId, {
        user,
        position,
        color: getUserColor(userId),
      });
      return { userCursors: newCursors };
    }),

  removeUserCursor: (userId) =>
    set((state) => {
      const newCursors = new Map(state.userCursors);
      newCursors.delete(userId);
      return { userCursors: newCursors };
    }),

  setCurrentSession: (session) =>
    set({ currentSession: session }),

  addSession: (session) =>
    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.set(session.id, session);
      return { sessions: newSessions };
    }),

  removeSession: (sessionId) =>
    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.delete(sessionId);
      return { sessions: newSessions };
    }),

  updateSessionParticipants: (sessionId, participants) =>
    set((state) => {
      const newSessions = new Map(state.sessions);
      const session = newSessions.get(sessionId);
      if (session) {
        newSessions.set(sessionId, { ...session, participants });
      }
      if (state.currentSession?.id === sessionId) {
        return {
          sessions: newSessions,
          currentSession: { ...state.currentSession, participants },
        };
      }
      return { sessions: newSessions };
    }),

  addAnnotation: (annotation) =>
    set((state) => {
      const newAnnotations = new Map(state.annotations);
      newAnnotations.set(annotation.id, annotation);
      return { annotations: newAnnotations };
    }),

  updateAnnotation: (annotationId, updates) =>
    set((state) => {
      const newAnnotations = new Map(state.annotations);
      const annotation = newAnnotations.get(annotationId);
      if (annotation) {
        newAnnotations.set(annotationId, {
          ...annotation,
          ...updates,
          updatedAt: Date.now(),
        });
      }
      return { annotations: newAnnotations };
    }),

  removeAnnotation: (annotationId) =>
    set((state) => {
      const newAnnotations = new Map(state.annotations);
      newAnnotations.delete(annotationId);
      return { annotations: newAnnotations };
    }),

  clearAll: () =>
    set({
      activeUsers: new Map(),
      userCursors: new Map(),
      currentSession: null,
      sessions: new Map(),
      annotations: new Map(),
    }),
}));

