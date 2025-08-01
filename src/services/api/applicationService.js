class ApplicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'application';
  }

  async getAll() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "candidateName" } },
          { field: { Name: "candidateEmail" } },
          { field: { Name: "appliedPosition" } },
          { field: { Name: "appliedDate" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "appliedDate",
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
        console.error("Error fetching applications:", error?.response?.data?.message);
      } else {
        console.error("Error fetching applications:", error.message);
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
          { field: { Name: "candidateName" } },
          { field: { Name: "candidateEmail" } },
          { field: { Name: "appliedPosition" } },
          { field: { Name: "appliedDate" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Application not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching application by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching application by ID:", error.message);
      }
      throw error;
    }
  }

  async create(application) {
    await this.delay(400);
    try {
      const params = {
        records: [
          {
            Name: `${application.candidateName} - ${application.appliedPosition}`,
            candidateName: application.candidateName,
            candidateEmail: application.candidateEmail,
            appliedPosition: application.appliedPosition,
            appliedDate: new Date().toISOString(),
            status: application.status || "New"
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
          console.error(`Failed to create application records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create application");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error("Error creating application:", error.message);
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
          console.error(`Failed to update application records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update application");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
      } else {
        console.error("Error updating application:", error.message);
      }
      throw error;
    }
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

  async logCommunication(applicationId, communicationData) {
    await this.delay(400);
    const { communicationService } = await import('./communicationService');
    return await communicationService.create({
      entityType: 'application',
      entityId: parseInt(applicationId),
      ...communicationData
    });
  }

  async getCommunications(applicationId) {
    await this.delay(300);
    const { communicationService } = await import('./communicationService');
    return await communicationService.getByEntity('application', parseInt(applicationId));
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
          console.error(`Failed to delete application records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete application");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting application:", error?.response?.data?.message);
      } else {
        console.error("Error deleting application:", error.message);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const applicationService = new ApplicationService();