class CandidateService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'candidate';
    this.lookupFields = ['currentAssignment'];
  }

  async getAll() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
          { field: { Name: "experience" } },
          { field: { Name: "status" } },
          { field: { Name: "lastContact" } },
          { field: { Name: "currentAssignment" } },
          { field: { Name: "assignmentHistory" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "position" } },
          { field: { Name: "clientId" } },
          { field: { Name: "interviewStatus" } }
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
        console.error("Error fetching candidates:", error?.response?.data?.message);
      } else {
        console.error("Error fetching candidates:", error.message);
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
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
          { field: { Name: "experience" } },
          { field: { Name: "status" } },
          { field: { Name: "lastContact" } },
          { field: { Name: "currentAssignment" } },
          { field: { Name: "assignmentHistory" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "position" } },
          { field: { Name: "clientId" } },
          { field: { Name: "interviewStatus" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Candidate not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching candidate by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching candidate by ID:", error.message);
      }
      throw error;
    }
  }

  async create(candidate) {
    await this.delay(400);
    try {
      const params = {
        records: [
          {
            Name: candidate.Name,
            email: candidate.email,
            skills: Array.isArray(candidate.skills) ? candidate.skills.join(',') : candidate.skills,
            experience: candidate.experience,
            status: candidate.status || "available",
            lastContact: new Date().toISOString(),
            interviewStatus: candidate.interviewStatus || "Pending Interview",
            assignmentHistory: candidate.assignmentHistory || ""
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
          console.error(`Failed to create candidate records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create candidate");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating candidate:", error?.response?.data?.message);
      } else {
        console.error("Error creating candidate:", error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    await this.delay(350);
    try {
      const updateData = { ...updates };
      
      // Handle lookup fields - send only ID
      this.lookupFields.forEach(fieldName => {
        if (updateData[fieldName] !== undefined && updateData[fieldName] !== null) {
          updateData[fieldName] = updateData[fieldName]?.Id || updateData[fieldName];
        }
      });

      // Handle skills array to comma-separated string
      if (updateData.skills && Array.isArray(updateData.skills)) {
        updateData.skills = updateData.skills.join(',');
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            lastContact: new Date().toISOString(),
            ...updateData
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
          console.error(`Failed to update candidate records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update candidate");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating candidate:", error?.response?.data?.message);
      } else {
        console.error("Error updating candidate:", error.message);
      }
      throw error;
    }
  }

  async logCommunication(candidateId, communicationData) {
    await this.delay(400);
    const { communicationService } = await import('./communicationService');
    return await communicationService.create({
      entityType: 'candidate',
      entityId: parseInt(candidateId),
      ...communicationData
    });
  }

  async getCommunications(candidateId) {
    await this.delay(300);
    const { communicationService } = await import('./communicationService');
    return await communicationService.getByEntity('candidate', parseInt(candidateId));
  }

  async assignToClient(candidateId, clientId, assignedBy = "Current User") {
    await this.delay(400);
    try {
      // First, create a candidate assignment record
      const { ApperClient } = window.ApperSDK;
      const assignmentClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const assignmentParams = {
        records: [
          {
            Name: `Assignment ${candidateId}-${clientId}`,
            clientId: parseInt(clientId),
            assignedAt: new Date().toISOString(),
            assignedBy,
            status: "active"
          }
        ]
      };

      const assignmentResponse = await assignmentClient.createRecord('candidate_assignment', assignmentParams);
      
      if (!assignmentResponse.success) {
        console.error(assignmentResponse.message);
        throw new Error(assignmentResponse.message);
      }

      const assignmentId = assignmentResponse.results[0].data.Id;

      // Update candidate with assignment
      const updates = {
        currentAssignment: assignmentId,
        status: 'assigned'
      };

      return await this.update(candidateId, updates);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error assigning candidate to client:", error?.response?.data?.message);
      } else {
        console.error("Error assigning candidate to client:", error.message);
      }
      throw error;
    }
  }

  async unassignFromClient(candidateId, reason = "Unassigned", unassignedBy = "Current User") {
    await this.delay(400);
    try {
      const updates = {
        currentAssignment: null,
        status: 'available'
      };

      return await this.update(candidateId, updates);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error unassigning candidate from client:", error?.response?.data?.message);
      } else {
        console.error("Error unassigning candidate from client:", error.message);
      }
      throw error;
    }
  }

  async getAssignmentHistory(candidateId) {
    await this.delay(200);
    try {
      const candidate = await this.getById(candidateId);
      return candidate.assignmentHistory || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignment history:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignment history:", error.message);
      }
      throw error;
    }
  }

  async getAssignedCandidates(clientId) {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
          { field: { Name: "experience" } },
          { field: { Name: "status" } },
          { field: { Name: "lastContact" } },
          { field: { Name: "currentAssignment" } },
          { field: { Name: "interviewStatus" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["assigned"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Filter candidates assigned to this client (would need better implementation with proper assignment table)
      return (response.data || []).filter(candidate => 
        candidate.currentAssignment && 
        candidate.currentAssignment.clientId === parseInt(clientId)
      );
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assigned candidates:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assigned candidates:", error.message);
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
          console.error(`Failed to delete candidate records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete candidate");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting candidate:", error?.response?.data?.message);
      } else {
        console.error("Error deleting candidate:", error.message);
      }
      throw error;
    }
  }

  async updateInterviewStatus(candidateId, interviewStatus) {
    await this.delay(300);
    try {
      const candidate = await this.getById(candidateId);
      
      const updates = {
        interviewStatus
      };

      // Log the status change as communication
      await this.logCommunication(candidateId, {
        communicationType: 'Internal Note',
        subject: `Interview status updated to ${interviewStatus}`,
        content: `Interview status changed from "${candidate.interviewStatus || 'Pending Interview'}" to "${interviewStatus}"`,
        priority: 'normal'
      });

      return this.update(candidateId, updates);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating interview status:", error?.response?.data?.message);
      } else {
        console.error("Error updating interview status:", error.message);
      }
      throw error;
    }
  }

  async getHiredCandidates() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
          { field: { Name: "experience" } },
          { field: { Name: "status" } },
          { field: { Name: "hireDate" } },
          { field: { Name: "position" } },
          { field: { Name: "clientId" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["hired"]
          }
        ],
        orderBy: [
          {
            fieldName: "hireDate",
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
        console.error("Error fetching hired candidates:", error?.response?.data?.message);
      } else {
        console.error("Error fetching hired candidates:", error.message);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const candidateService = new CandidateService();