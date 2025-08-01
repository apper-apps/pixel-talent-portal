import { candidateService } from '@/services/api/candidateService';
import { clientService } from '@/services/api/clientService';

class AssignmentService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAssignments() {
    await this.delay(300);
    
    // Get all candidates with current assignments
    const candidates = await candidateService.getAll();
    const clients = await clientService.getAll();
    
    // Filter candidates that have current assignments
    const assignedCandidates = candidates.filter(candidate => 
      candidate.currentAssignment && candidate.currentAssignment.status === 'active'
    );
    
    // Join with client data
    const assignments = assignedCandidates.map(candidate => {
      const client = clients.find(c => c.Id === candidate.currentAssignment.clientId);
      return {
        Id: candidate.currentAssignment.Id,
        candidateId: candidate.Id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        clientId: candidate.currentAssignment.clientId,
        clientCompany: client ? client.company : 'Unknown Client',
        clientContactPerson: client ? client.contactPerson : 'Unknown Contact',
        assignedAt: candidate.currentAssignment.assignedAt,
        assignedBy: candidate.currentAssignment.assignedBy,
        status: candidate.currentAssignment.status,
        interviewStatus: candidate.interviewStatus || 'pending',
        lastContact: candidate.lastContact,
        candidateSkills: candidate.skills,
        candidateExperience: candidate.experience
      };
    });
    
    return assignments.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
  }

  async updateInterviewStatus(candidateId, interviewStatus) {
    await this.delay(250);
    return candidateService.updateInterviewStatus(candidateId, interviewStatus);
  }

  async unassignCandidate(candidateId, reason = 'Unassigned from assignments page') {
    await this.delay(300);
    return candidateService.unassignFromClient(candidateId, reason, 'Current User');
  }
}

export const assignmentService = new AssignmentService();