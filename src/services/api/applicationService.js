import applicationsData from "@/services/mockData/applications.json";

class ApplicationService {
  constructor() {
    this.data = [...applicationsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Application not found");
    }
    return { ...item };
  }

  async create(application) {
    await this.delay(400);
    const newId = Math.max(...this.data.map(item => item.Id)) + 1;
    const newApplication = {
      ...application,
      Id: newId,
      appliedDate: new Date().toISOString()
    };
    this.data.push(newApplication);
    return { ...newApplication };
  }

async update(id, updates) {
    await this.delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    
    // Track status changes with timestamp
    const currentItem = this.data[index];
    const updatedItem = { ...currentItem, ...updates };
    
    // If status is being updated, ensure statusHistory exists
    if (updates.status && updates.status !== currentItem.status) {
      if (!updatedItem.statusHistory) {
        updatedItem.statusHistory = [];
      }
    }
    
this.data[index] = updatedItem;
    return { ...this.data[index] };
  }

  async addNote(applicationId, note) {
    await this.delay(400);
    const { notesService } = await import('./notesService');
    return await notesService.create({
      applicationId: parseInt(applicationId),
      ...note
    });
  }

  async updateNote(noteId, updates) {
    await this.delay(400);
    const { notesService } = await import('./notesService');
    return await notesService.update(noteId, updates);
  }

  async deleteNote(noteId) {
    await this.delay(250);
    const { notesService } = await import('./notesService');
    return await notesService.delete(noteId);
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const applicationService = new ApplicationService();