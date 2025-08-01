import communicationsData from "@/services/mockData/communications.json";

class CommunicationService {
  constructor() {
    this.data = [...communicationsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Communication not found");
    }
    return { ...item };
  }

  async getByEntity(entityType, entityId) {
    await this.delay(250);
    return this.data.filter(comm => 
      comm.entityType === entityType && comm.entityId === parseInt(entityId)
    );
  }

  async getByEntityAndRelated(entityType, entityId, relatedEntityType = null, relatedEntityId = null) {
    await this.delay(250);
    return this.data.filter(comm => 
      comm.entityType === entityType && 
      comm.entityId === parseInt(entityId) &&
      (relatedEntityType ? comm.relatedEntityType === relatedEntityType : true) &&
      (relatedEntityId ? comm.relatedEntityId === parseInt(relatedEntityId) : true)
    );
  }

  async create(communication) {
    await this.delay(400);
    const newId = Math.max(...this.data.map(item => item.Id), 0) + 1;
    const newCommunication = {
      ...communication,
      Id: newId,
      timestamp: new Date().toISOString(),
      createdBy: communication.createdBy || "Current User",
      priority: communication.priority || "normal",
      status: communication.status || "completed"
    };
    this.data.push(newCommunication);
    return { ...newCommunication };
  }

  async update(id, updates) {
    await this.delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async logCommunication(entityType, entityId, communicationData) {
    await this.delay(400);
    return await this.create({
      entityType,
      entityId: parseInt(entityId),
      ...communicationData
    });
  }

  async getCommunicationHistory(entityType, entityId) {
    await this.delay(250);
    const communications = await this.getByEntity(entityType, entityId);
    return communications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const communicationService = new CommunicationService();