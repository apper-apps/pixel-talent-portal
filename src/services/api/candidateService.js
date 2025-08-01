import candidatesData from "@/services/mockData/candidates.json";

class CandidateService {
  constructor() {
    this.data = [...candidatesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.data];
  }

  async getById(id) {
    await this.delay(200);
    const item = this.data.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error("Candidate not found");
    }
    return { ...item };
  }

async create(candidate) {
    await this.delay(400);
    const newId = Math.max(...this.data.map(item => item.Id)) + 1;
    const newCandidate = {
      ...candidate,
      Id: newId,
      lastContact: new Date().toISOString(),
      interviewStatus: 'Pending Interview'
    };
    this.data.push(newCandidate);
    return { ...newCandidate };
  }

async update(id, updates) {
    await this.delay(350);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    this.data[index] = { 
      ...this.data[index], 
      ...updates,
      lastContact: new Date().toISOString()
    };
    return { ...this.data[index] };
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

  // Assignment management methods
  async assignToClient(candidateId, clientId, assignedBy = "Current User") {
    await this.delay(400);
    const candidate = await this.getById(candidateId);
    
    if (candidate.status !== 'available') {
      throw new Error("Only available candidates can be assigned to clients");
    }

    const assignment = {
      Id: Date.now(), // Simple ID generation
      clientId: parseInt(clientId),
      assignedAt: new Date().toISOString(),
      assignedBy,
      status: 'active'
    };

    const historyEntry = {
      Id: Date.now() + 1,
      clientId: parseInt(clientId),
      assignedAt: new Date().toISOString(),
      assignedBy,
      status: 'assigned',
      endedAt: null,
      endReason: null
    };

const updates = {
      currentAssignment: assignment,
      assignmentHistory: [...(candidate.assignmentHistory || []), historyEntry],
      status: 'assigned',
      interviewStatus: candidate.interviewStatus || 'Pending Interview'
    };
    return await this.update(candidateId, updates);
  }

  async unassignFromClient(candidateId, reason = "Unassigned", unassignedBy = "Current User") {
    await this.delay(400);
    const candidate = await this.getById(candidateId);
    
    if (!candidate.currentAssignment) {
      throw new Error("Candidate is not currently assigned");
    }

    // Update assignment history
    const updatedHistory = candidate.assignmentHistory.map(entry => 
      entry.status === 'assigned' && !entry.endedAt
        ? {
            ...entry,
            endedAt: new Date().toISOString(),
            endReason: reason,
            status: 'completed'
          }
        : entry
    );

    const updates = {
      currentAssignment: null,
      assignmentHistory: updatedHistory,
      status: 'available'
    };

    return await this.update(candidateId, updates);
  }

  async getAssignmentHistory(candidateId) {
    await this.delay(200);
    const candidate = await this.getById(candidateId);
    return candidate.assignmentHistory || [];
  }

  async getAssignedCandidates(clientId) {
    await this.delay(300);
    return this.data.filter(candidate => 
      candidate.currentAssignment && 
      candidate.currentAssignment.clientId === parseInt(clientId)
    );
  }
  async delete(id) {
    await this.delay(250);
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
}

async updateInterviewStatus(candidateId, interviewStatus) {
    await this.delay(300);
    const candidate = await this.getById(candidateId);
    
    const updates = {
      interviewStatus,
      lastContact: new Date().toISOString()
    };

    // Log the status change as communication
    await this.logCommunication(candidateId, {
      communicationType: 'Internal Note',
      subject: `Interview status updated to ${interviewStatus}`,
      content: `Interview status changed from "${candidate.interviewStatus || 'Pending Interview'}" to "${interviewStatus}"`,
      priority: 'normal'
    });

    return this.update(candidateId, updates);
  }

async getHiredCandidates() {
    await this.delay(300);
    return this.data.filter(candidate => candidate.status === 'hired');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const candidateService = new CandidateService();