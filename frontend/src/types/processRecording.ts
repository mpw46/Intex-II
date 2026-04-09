export interface ProcessRecordingDto {
  recordingId: number | null;
  residentId: number | null;
  sessionDate: string | null;
  socialWorker: string | null;
  sessionType: string | null;
  sessionDurationMinutes: number | null;
  emotionalStateObserved: string | null;
  emotionalStateEnd: string | null;
  sessionNarrative: string | null;
  interventionsApplied: string | null;
  followUpActions: string | null;
  progressNoted: string | null;
  concernsFlagged: string | null;
  referralMade: string | null;
  notesRestricted: string | null;
}

export interface ProcessRecordingCreate {
  residentId?: number;
  sessionDate?: string;
  socialWorker?: string;
  sessionType?: string;
  sessionDurationMinutes?: number;
  emotionalStateObserved?: string;
  emotionalStateEnd?: string;
  sessionNarrative?: string;
  interventionsApplied?: string;
  followUpActions?: string;
  progressNoted?: string;
  concernsFlagged?: string;
  referralMade?: string;
  notesRestricted?: string;
}

export interface RecordingFilters {
  residentId?: number;
  socialWorker?: string;
  sessionType?: string;
}
