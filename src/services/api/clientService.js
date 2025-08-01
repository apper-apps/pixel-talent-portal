import clientsData from "@/services/mockData/clients.json";

class ClientService {
  constructor() {
    this.data = [...clientsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Client not found");
    }
    return { ...item };
  }

  async create(client) {
    await this.delay(400);
    const newId = Math.max(...this.data.map(item => item.Id)) + 1;
    const newClient = {
      ...client,
      Id: newId,
      lastContact: new Date().toISOString()
    };
    this.data.push(newClient);
    return { ...newClient };
  }

  async update(id, updates) {
    await this.delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const clientService = new ClientService();