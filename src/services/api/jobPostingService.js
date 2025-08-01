class JobPostingService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'job_posting';
  }

  async getAll() {
    await this.delay(300);
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "status" } },
          { field: { Name: "applicationCount" } },
          { field: { Name: "createdAt" } }
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
        console.error("Error fetching job postings:", error?.response?.data?.message);
      } else {
        console.error("Error fetching job postings:", error.message);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "status" } },
          { field: { Name: "applicationCount" } },
          { field: { Name: "createdAt" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Job posting not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching job posting by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching job posting by ID:", error.message);
      }
      throw error;
    }
  }

  async create(jobPosting) {
    await this.delay(400);
    try {
      const params = {
        records: [
          {
            Name: jobPosting.title,
            title: jobPosting.title,
            description: jobPosting.description,
            requirements: jobPosting.requirements,
            status: jobPosting.status || "active",
            applicationCount: jobPosting.applicationCount || 0,
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
          console.error(`Failed to create job posting records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create job posting");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job posting:", error?.response?.data?.message);
      } else {
        console.error("Error creating job posting:", error.message);
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
          console.error(`Failed to update job posting records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to update job posting");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job posting:", error?.response?.data?.message);
      } else {
        console.error("Error updating job posting:", error.message);
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
          console.error(`Failed to delete job posting records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to delete job posting");
        }
        return response.results[0].data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting job posting:", error?.response?.data?.message);
      } else {
        console.error("Error deleting job posting:", error.message);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const jobPostingService = new JobPostingService();