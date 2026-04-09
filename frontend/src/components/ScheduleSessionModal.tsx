import { useState } from 'react';
import { createRecording } from '../api/processRecordingsApi';
import type { ProcessRecordingDto } from '../types/processRecording';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SessionType = 'Individual' | 'Group';
type EmotionalState = 'Calm' | 'Anxious' | 'Sad' | 'Angry' | 'Withdrawn' | 'Hopeful' | 'Distressed';

interface FormDraft {
  sessionDate: string;
  socialWorker: string;
  sessionType: SessionType;
  sessionDurationMinutes: string;
  emotionalStateObserved: EmotionalState;
  emotionalStateEnd: EmotionalState;
  sessionNarrative: string;
  interventionsApplied: string;
  followUpActions: string;
  progressNoted: string;
  concernsFlagged: boolean;
  referralMade: boolean;
  notesRestricted: boolean;
}

export interface ScheduleSessionModalProps {
  residentId: number;
  /** Displayed in the modal header — typically the case control number */
  caseId: string;
  /** Pre-fills the social worker field when available */
  assignedSocialWorker?: string;
  onClose: () => void;
  /** Called with the raw API response after a successful save */
  onSaved?: (saved: ProcessRecordingDto) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SOCIAL_WORKERS = ['Ana Reyes', 'Ben Cruz', 'Celia Santos', 'Donna Lim'];
const EMOTIONAL_STATES: EmotionalState[] = ['Calm', 'Anxious', 'Sad', 'Angry', 'Withdrawn', 'Hopeful', 'Distressed'];

const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
  text-stone-900 placeholder:text-stone-400 hover:border-stone-400
  focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScheduleSessionModal({
  residentId, caseId, assignedSocialWorker, onClose, onSaved,
}: ScheduleSessionModalProps) {
  const [form, setForm] = useState<FormDraft>({
    sessionDate: new Date().toISOString().substring(0, 10),
    socialWorker: assignedSocialWorker || SOCIAL_WORKERS[0],
    sessionType: 'Individual',
    sessionDurationMinutes: '',
    emotionalStateObserved: 'Anxious',
    emotionalStateEnd: 'Calm',
    sessionNarrative: '',
    interventionsApplied: '',
    followUpActions: '',
    progressNoted: '',
    concernsFlagged: false,
    referralMade: false,
    notesRestricted: false,
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    createRecording({
      residentId,
      sessionDate: form.sessionDate,
      socialWorker: form.socialWorker,
      sessionType: form.sessionType,
      sessionDurationMinutes: form.sessionDurationMinutes ? Number(form.sessionDurationMinutes) : undefined,
      emotionalStateObserved: form.emotionalStateObserved,
      emotionalStateEnd: form.emotionalStateEnd,
      sessionNarrative: form.sessionNarrative,
      interventionsApplied: form.interventionsApplied,
      followUpActions: form.followUpActions,
      progressNoted: form.progressNoted,
      concernsFlagged: form.concernsFlagged ? 'True' : 'False',
      referralMade: form.referralMade ? 'True' : 'False',
      notesRestricted: form.notesRestricted ? 'True' : 'False',
    }).then(saved => {
      onSaved?.(saved);
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
      onClick={onClose} aria-modal="true" role="dialog" aria-labelledby="schedule-title"
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
            <div>
              <h2 id="schedule-title" className="text-lg font-semibold text-stone-900">New Session Record</h2>
              <p className="text-xs text-stone-400 mt-0.5">{caseId}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close"
              className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500">
              <XIcon />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Row 1: Date + Social Worker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sm-date" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Session Date</label>
                <input id="sm-date" type="date" value={form.sessionDate}
                  onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))}
                  className={inputCls} />
              </div>
              <div>
                <label htmlFor="sm-sw" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Social Worker</label>
                <select id="sm-sw" value={form.socialWorker}
                  onChange={e => setForm(f => ({ ...f, socialWorker: e.target.value }))}
                  className={inputCls}>
                  {SOCIAL_WORKERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Type + Duration + Emotional States */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="sm-type" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Session Type</label>
                <select id="sm-type" value={form.sessionType}
                  onChange={e => setForm(f => ({ ...f, sessionType: e.target.value as SessionType }))}
                  className={inputCls}>
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                </select>
              </div>
              <div>
                <label htmlFor="sm-duration" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Duration (min)</label>
                <input id="sm-duration" type="number" min="1" max="480" value={form.sessionDurationMinutes}
                  onChange={e => setForm(f => ({ ...f, sessionDurationMinutes: e.target.value }))}
                  className={inputCls} placeholder="e.g. 60" />
              </div>
              <div />
              <div>
                <label htmlFor="sm-estart" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">State at Start</label>
                <select id="sm-estart" value={form.emotionalStateObserved}
                  onChange={e => setForm(f => ({ ...f, emotionalStateObserved: e.target.value as EmotionalState }))}
                  className={inputCls}>
                  {EMOTIONAL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sm-eend" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">State at End</label>
                <select id="sm-eend" value={form.emotionalStateEnd}
                  onChange={e => setForm(f => ({ ...f, emotionalStateEnd: e.target.value as EmotionalState }))}
                  className={inputCls}>
                  {EMOTIONAL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Narrative */}
            <div>
              <label htmlFor="sm-narrative" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Session Narrative <span className="text-rose-500">*</span>
              </label>
              <textarea id="sm-narrative" rows={5} required value={form.sessionNarrative}
                onChange={e => setForm(f => ({ ...f, sessionNarrative: e.target.value }))}
                className={inputCls} placeholder="Describe what occurred during the session…" />
            </div>

            {/* Interventions */}
            <div>
              <label htmlFor="sm-interventions" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Interventions Applied</label>
              <input id="sm-interventions" type="text" value={form.interventionsApplied}
                onChange={e => setForm(f => ({ ...f, interventionsApplied: e.target.value }))}
                className={inputCls} placeholder="e.g. Cognitive grounding, narrative therapy…" />
            </div>

            {/* Follow-up */}
            <div>
              <label htmlFor="sm-followup" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Follow-Up Actions</label>
              <textarea id="sm-followup" rows={3} value={form.followUpActions}
                onChange={e => setForm(f => ({ ...f, followUpActions: e.target.value }))}
                className={inputCls} placeholder="Actions to be taken before the next session…" />
            </div>

            {/* Progress */}
            <div>
              <label htmlFor="sm-progress" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">Progress Noted</label>
              <input id="sm-progress" type="text" value={form.progressNoted}
                onChange={e => setForm(f => ({ ...f, progressNoted: e.target.value }))}
                className={inputCls} placeholder="Any observable progress this session…" />
            </div>

            {/* Flags */}
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-rose-200 bg-rose-50">
                <input type="checkbox" checked={form.concernsFlagged}
                  onChange={e => setForm(f => ({ ...f, concernsFlagged: e.target.checked }))}
                  className="h-4 w-4 rounded border-stone-300 text-rose-600 focus:ring-rose-500 focus:ring-offset-0" />
                <span className="text-sm font-medium text-rose-800">Flag a concern requiring follow-up attention</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-stone-200 bg-stone-50">
                <input type="checkbox" checked={form.referralMade}
                  onChange={e => setForm(f => ({ ...f, referralMade: e.target.checked }))}
                  className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 focus:ring-haven-teal-500 focus:ring-offset-0" />
                <span className="text-sm font-medium text-stone-700">Referral made this session</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-stone-200 bg-stone-50">
                <input type="checkbox" checked={form.notesRestricted}
                  onChange={e => setForm(f => ({ ...f, notesRestricted: e.target.checked }))}
                  className="h-4 w-4 rounded border-stone-300 text-haven-teal-600 focus:ring-haven-teal-500 focus:ring-offset-0" />
                <span className="text-sm font-medium text-stone-700">Restrict notes (sensitive content)</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
              Cancel
            </button>
            <button type="submit"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
