import { apiService } from './api';

export interface Note {
  idNote: number;
  idPerfo: number;
  valeur: number;
  retenu: boolean;
  performance?: {
    idPerfo: number;
    duree: string | null;
    noteFinale: number | null;
    etat: string | null;
    membre?: {
      idMembre: number;
      pseudoMembre: string;
    };
    guest?: {
      idGuest: number;
      pseudo: string;
    };
  };
}

export interface CreateNoteData {
  idPerfo: number;
  valeur: number;
  retenu?: boolean;
}

export interface UpdateNoteData {
  valeur?: number;
  retenu?: boolean;
}

class NoteService {
  async createNote(data: CreateNoteData): Promise<Note> {
    try {
      const note = await apiService.post<Note>(`/api/performances/${data.idPerfo}/notes`, data);
      return note;
    } catch (error) {
      console.error('Erreur lors de la création de la note:', error);
      throw error;
    }
  }

  async createBulkNotes(idPerfo: number, notes: { valeur: number; retenu?: boolean }[]): Promise<Note[]> {
    try {
      const result = await apiService.post<Note[]>(`/api/performances/${idPerfo}/notes/bulk`, { notes });
      return result;
    } catch (error) {
      console.error('Erreur lors de la création des notes en masse:', error);
      throw error;
    }
  }

  async getPerformanceNotes(idPerfo: number): Promise<Note[]> {
    try {
      const notes = await apiService.get<Note[]>(`/api/performances/${idPerfo}/notes`);
      return notes;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes de la performance:', error);
      throw error;
    }
  }

  async getNote(id: number): Promise<Note> {
    try {
      const note = await apiService.get<Note>(`/api/notes/${id}`);
      return note;
    } catch (error) {
      console.error('Erreur lors de la récupération de la note:', error);
      throw error;
    }
  }

  async updateNote(id: number, data: UpdateNoteData): Promise<Note> {
    try {
      const note = await apiService.put<Note>(`/api/notes/${id}`, data);
      return note;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      throw error;
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      await apiService.delete(`/api/notes/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      throw error;
    }
  }
}

export const noteService = new NoteService();