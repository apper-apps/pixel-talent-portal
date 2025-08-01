import notesData from '@/services/mockData/notes.json';

class NotesService {
  constructor() {
    this.data = [...notesData];
    this.nextId = Math.max(...this.data.map(item => item.Id)) + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getByApplicationId(applicationId) {
    await this.delay(300);
    return this.data
      .filter(note => note.applicationId === parseInt(applicationId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(note => ({ ...note }));
  }

  async create(note) {
    await this.delay(500);
    const newNote = {
      ...note,
      Id: this.nextId++,
      createdAt: new Date().toISOString(),
      author: "Current User" // In real app, this would come from auth context
    };
    this.data.push(newNote);
    return { ...newNote };
  }

  async update(id, updates) {
    await this.delay(400);
    const index = this.data.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      ...this.data[index],
      ...updates,
      Id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.data[index] = updatedNote;
    return { ...updatedNote };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(note => note.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const notesService = new NotesService();