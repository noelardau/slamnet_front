import { create } from 'zustand';
import { noteService, Note, CreateNoteData, UpdateNoteData } from '../services/noteService';

interface NoteStore {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  hydrateNotes: (performanceId: number) => Promise<void>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  createBulkNotes: (performanceId: number, notes: { valeur: number; retenu?: boolean }[]) => Promise<Note[]>;
  updateNote: (id: number, data: UpdateNoteData) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  refreshNotes: (performanceId: number) => Promise<void>;
  clearNotes: () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  hydrateNotes: async (performanceId: number) => {
    try {
      set({ isLoading: true, error: null });
      const notes = await noteService.getPerformanceNotes(performanceId);
      set({ notes, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des notes';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createNote: async (data: CreateNoteData) => {
    try {
      set({ isLoading: true, error: null });
      const newNote = await noteService.createNote(data);
      set((state) => ({
        notes: [...state.notes, newNote],
        isLoading: false,
      }));
      return newNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la note';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createBulkNotes: async (performanceId: number, notes: { valeur: number; retenu?: boolean }[]) => {
    try {
      set({ isLoading: true, error: null });
      const newNotes = await noteService.createBulkNotes(performanceId, notes);
      set((state) => ({
        notes: newNotes,
        isLoading: false,
      }));
      return newNotes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création des notes';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateNote: async (id: number, data: UpdateNoteData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedNote = await noteService.updateNote(id, data);
      set((state) => ({
        notes: state.notes.map((n) => (n.idNote === id ? updatedNote : n)),
        isLoading: false,
      }));
      return updatedNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la note';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteNote: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await noteService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.idNote !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la note';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshNotes: async (performanceId: number) => {
    await get().hydrateNotes(performanceId);
  },

  clearNotes: () => {
    set({ notes: [] });
  },
}));