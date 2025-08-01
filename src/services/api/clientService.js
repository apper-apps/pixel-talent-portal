class ClientService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'client';
  }

  async getAll() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company" } },
          { field: { Name: "industry" } },
          { field: { Name: "contactPerson" } },
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "activePositions" } },
          { field: { Name: "lastContact" } }
        ],
        orderBy: [
          {
            fieldName: "lastContact",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error("Error fetching clients:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    await this.delay(200);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company" } },
          { field: { Name: "industry" } },
          { field: { Name: "contactPerson" } },
          { field: { Name: "email" } },
          { field: { Name: "status" } },
          { field: { Name: "activePositions" } },
          { field: { Name: "lastContact" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Client not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching client by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching client by ID:", error.message);
      }
      throw error;
    }
  }

  async create(client) {
    await this.delay(400);
    try {
      const params = {
        records: [
          {
            Name: client.company,
            company: client.company,
            industry: client.industry,
            contactPerson: client.contactPerson,
            email: client.email,
            status: client.status || "active",
            activePositions: client.activePositions || 0,
            lastContact: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create client records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create client");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error("Error creating client:", error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    await this.delay(350);
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            lastContact: new Date().toISOString(),
            ...updates
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update client records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update client");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error("Error updating client:", error.message);
      }
      throw error;
    }
  }

  async logCommunication(clientId, communicationData) {
    await this.delay(400);
    const { communicationService } = await import('./communicationService');
    return await communicationService.create({
      entityType: 'client',
      entityId: parseInt(clientId),
      ...communicationData
    });
  }

  async getCommunications(clientId) {
    await this.delay(300);
    const { communicationService } = await import('./communicationService');
    return await communicationService.getByEntity('client', parseInt(clientId));
  }

  async delete(id) {
    await this.delay(250);
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete client records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete client");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error("Error deleting client:", error.message);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const clientService = new ClientService();