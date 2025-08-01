class NotesService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'note';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getByApplicationId(applicationId) {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "applicationId" } },
          { field: { Name: "author" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          {
            FieldName: "applicationId",
            Operator: "EqualTo",
            Values: [parseInt(applicationId)]
          }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
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
        console.error("Error fetching notes by application ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching notes by application ID:", error.message);
      }
      throw error;
    }
  }

  async create(note) {
    await this.delay(500);
    try {
      const params = {
        records: [
          {
            Name: note.content?.substring(0, 50) + "..." || "Note",
            applicationId: parseInt(note.applicationId),
            author: note.author || "Current User",
            content: note.content,
            type: note.type || "Note",
            createdAt: new Date().toISOString()
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
          console.error(`Failed to create note records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create note");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error("Error creating note:", error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    await this.delay(400);
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
          console.error(`Failed to update note records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update note");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
      } else {
        console.error("Error updating note:", error.message);
      }
      throw error;
    }
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
          console.error(`Failed to delete note records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete note");
        }
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error("Error deleting note:", error.message);
      }
      throw error;
    }
  }
}

export const notesService = new NotesService();