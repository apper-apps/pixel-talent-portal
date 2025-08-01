class CommunicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'communication';
  }

  async getAll() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "relatedEntityType" } },
          { field: { Name: "relatedEntityId" } },
          { field: { Name: "communicationType" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
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
        console.error("Error fetching communications:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communications:", error.message);
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
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "relatedEntityType" } },
          { field: { Name: "relatedEntityId" } },
          { field: { Name: "communicationType" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Communication not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communication by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communication by ID:", error.message);
      }
      throw error;
    }
  }

  async getByEntity(entityType, entityId) {
    await this.delay(250);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "relatedEntityType" } },
          { field: { Name: "relatedEntityId" } },
          { field: { Name: "communicationType" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            FieldName: "entityType",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entityId",
            Operator: "EqualTo",
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
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
        console.error("Error fetching communications by entity:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communications by entity:", error.message);
      }
      throw error;
    }
  }

  async getByEntityAndRelated(entityType, entityId, relatedEntityType = null, relatedEntityId = null) {
    await this.delay(250);
    try {
      const where = [
        {
          FieldName: "entityType",
          Operator: "EqualTo",
          Values: [entityType]
        },
        {
          FieldName: "entityId",
          Operator: "EqualTo",
          Values: [parseInt(entityId)]
        }
      ];

      if (relatedEntityType) {
        where.push({
          FieldName: "relatedEntityType",
          Operator: "EqualTo",
          Values: [relatedEntityType]
        });
      }

      if (relatedEntityId) {
        where.push({
          FieldName: "relatedEntityId",
          Operator: "EqualTo",
          Values: [parseInt(relatedEntityId)]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "relatedEntityType" } },
          { field: { Name: "relatedEntityId" } },
          { field: { Name: "communicationType" } },
          { field: { Name: "subject" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } }
        ],
        where,
        orderBy: [
          {
            fieldName: "timestamp",
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
        console.error("Error fetching communications by entity and related:", error?.response?.data?.message);
      } else {
        console.error("Error fetching communications by entity and related:", error.message);
      }
      throw error;
    }
  }

  async create(communication) {
    await this.delay(400);
    try {
      const params = {
        records: [
          {
            Name: communication.subject || "Communication",
            entityType: communication.entityType,
            entityId: parseInt(communication.entityId),
            relatedEntityType: communication.relatedEntityType || null,
            relatedEntityId: communication.relatedEntityId ? parseInt(communication.relatedEntityId) : null,
            communicationType: communication.communicationType,
            subject: communication.subject,
            content: communication.content,
            timestamp: new Date().toISOString(),
            priority: communication.priority || "normal",
            status: communication.status || "completed"
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
          console.error(`Failed to create communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create communication");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating communication:", error?.response?.data?.message);
      } else {
        console.error("Error creating communication:", error.message);
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
          console.error(`Failed to update communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update communication");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating communication:", error?.response?.data?.message);
      } else {
        console.error("Error updating communication:", error.message);
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
          console.error(`Failed to delete communication records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete communication");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting communication:", error?.response?.data?.message);
      } else {
        console.error("Error deleting communication:", error.message);
      }
      throw error;
    }
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
    return await this.getByEntity(entityType, entityId);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const communicationService = new CommunicationService();