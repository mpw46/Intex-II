import { useState, useEffect } from 'react';
import { getResidents } from '../../api/residentsApi';
import { getSafehouses, buildSafehouseNameMap } from '../../api/safehousesApi';
import { getRecordings, deleteRecording } from '../../api/processRecordingsApi';
import { isTruthy } from '../../types/resident';
import PaginationBar from '../../components/PaginationBar';
import ScheduleSessionModal from '../../components/ScheduleSessionModal';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SessionType = 'Individual' | 'Group';
type EmotionalState = 'Calm' | 'Anxious' | 'Sad' | 'Angry' | 'Withdrawn' | 'Hopeful' | 'Distressed';

interface ProcessRecording {
  id: string;
  residentCaseId: string;
  sessionDate: string;
  socialWorker: string;
  sessionType: SessionType;
  sessionDurationMinutes: number | null;
  emotionalStateObserved: EmotionalState;
  emotionalStateEnd: EmotionalState;
  sessionNarrative: string;
  interventionsApplied: string;
  followUpActions: string;
  progressNoted: string;
  concernsFlagged: boolean;
  referralMade: boolean;
}

// Minimal resident shape for the search panel
interface ResidentSummary {
  residentId: number;
  caseId: string;
  safehouse: string;
  assignedSocialWorker: string;
  admissionDate: string;
}


// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOTIONAL_COLORS: Record<EmotionalState, string> = {
  Calm:       'bg-emerald-100 text-emerald-800 border-emerald-200',
  Hopeful:    'bg-haven-teal-100 text-haven-teal-800 border-haven-teal-200',
  Anxious:    'bg-amber-100 text-amber-800 border-amber-200',
  Sad:        'bg-sky-100 text-sky-800 border-sky-200',
  Withdrawn:  'bg-stone-100 text-stone-600 border-stone-200',
  Angry:      'bg-orange-100 text-orange-800 border-orange-200',
  Distressed: 'bg-rose-100 text-rose-800 border-rose-200',
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SearchIcon()  { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function PlusIcon()    { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function XIcon()       { return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function AlertIcon()   { return <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmotionBadge({ state }: { state: EmotionalState }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
      font-semibold uppercase tracking-wide border ${EMOTIONAL_COLORS[state]}`}>
      {state}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ProcessRecordingPage() {
  const [residents, setResidents] = useState<ResidentSummary[]>([]);
  const [recordings, setRecordings] = useState<ProcessRecording[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(true);
  const [loadingRecordings, setLoadingRecordings] = useState(false);

  const [residentSearch, setResidentSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState<ResidentSummary | null>(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 20;

  useEffect(() => {
    Promise.all([getResidents(), getSafehouses()])
      .then(([rawResidents, safehouses]) => {
        const shMap = buildSafehouseNameMap(safehouses);
        setResidents(rawResidents
          .filter(r => r.residentId != null)
          .map(r => ({
            residentId:           r.residentId!,
            caseId:               r.caseControlNo ?? `RES-${r.residentId}`,
            safehouse:            (r.safehouseId != null ? shMap.get(r.safehouseId) : undefined) ?? 'Unknown',
            assignedSocialWorker: r.assignedSocialWorker ?? '',
            admissionDate:        r.dateOfAdmission ?? '',
          }))
        );
      })
      .finally(() => setLoadingResidents(false));
  }, []);

  const [modal, setModal]           = useState<'add' | 'view' | 'delete' | null>(null);
  const [selectedRec, setSelectedRec] = useState<ProcessRecording | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const filteredResidents = residents.filter(r => {
    const q = residentSearch.toLowerCase();
    return q === '' || r.caseId.toLowerCase().includes(q) || r.safehouse.toLowerCase().includes(q) || r.assignedSocialWorker.toLowerCase().includes(q);
  });

  useEffect(() => { setPage(1); }, [residentSearch]);

  const paginatedResidents = filteredResidents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const residentRecordings = selectedResident
    ? [...recordings].sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
    : [];

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function selectResident(r: ResidentSummary) {
    setSelectedResident(r);
    setMobileShowDetail(true);
    setRecordings([]);
    setLoadingRecordings(true);
    getRecordings({ residentId: r.residentId })
      .then(raw => setRecordings(raw.map(rec => ({
        id: String(rec.recordingId ?? 0),
        residentCaseId: r.caseId,
        sessionDate: rec.sessionDate ?? '',
        socialWorker: rec.socialWorker ?? '',
        sessionType: (rec.sessionType as SessionType) ?? 'Individual',
        sessionDurationMinutes: rec.sessionDurationMinutes ?? null,
        emotionalStateObserved: (rec.emotionalStateObserved as EmotionalState) ?? 'Calm',
        emotionalStateEnd: (rec.emotionalStateEnd as EmotionalState) ?? 'Calm',
        sessionNarrative: rec.sessionNarrative ?? '',
        interventionsApplied: rec.interventionsApplied ?? '',
        followUpActions: rec.followUpActions ?? '',
        progressNoted: rec.progressNoted ?? '',
        concernsFlagged: isTruthy(rec.concernsFlagged),
        referralMade: isTruthy(rec.referralMade),
      }))))
      .finally(() => setLoadingRecordings(false));
  }

  function openAdd() { setModal('add'); }
  function openView(rec: ProcessRecording) { setSelectedRec(rec); setModal('view'); }
  function openDelete(rec: ProcessRecording) { setSelectedRec(rec); setModal('delete'); }

  function confirmDelete() {
    if (selectedRec) {
      deleteRecording(Number(selectedRec.id)).then(() => {
        setRecordings(p => p.filter(r => r.id !== selectedRec.id));
      });
    }
    setModal(null);
    setSelectedRec(null);
  }

  const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
    text-stone-900 placeholder:text-stone-400 hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (loadingResidents) return (
    <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
      Loading residents…
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

      {/* ------------------------------------------------------------------ */}
      {/* Left: Resident search                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className={`w-full lg:w-80 shrink-0 ${mobileShowDetail ? 'hidden lg:block' : ''}`}>
        <h2 className="text-base font-semibold text-stone-900 mb-4">Select Resident</h2>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"><SearchIcon /></span>
          <input type="search" placeholder="Search by case ID, safehouse…" value={residentSearch}
            onChange={e => setResidentSearch(e.target.value)}
            className={`${inputCls} pl-9`} />
        </div>

        <div className="space-y-2 lg:max-h-[70vh] overflow-y-auto pr-1">
          {paginatedResidents.map(r => (
            <button key={r.caseId} type="button"
              onClick={() => selectResident(r)}
              className={`w-full text-left bg-white rounded-xl border p-4
                transition-all duration-150 hover:shadow-md
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                ${selectedResident?.caseId === r.caseId
                  ? 'border-haven-teal-400 shadow-md'
                  : 'border-stone-200 shadow-sm hover:border-stone-300'}`}>
              <p className="text-sm font-semibold font-mono text-stone-900">{r.caseId}</p>
              <p className="text-xs text-stone-400 mt-0.5">{r.safehouse}</p>
              <p className="text-xs text-stone-500 mt-1">{r.assignedSocialWorker}</p>
            </button>
          ))}
        </div>
        <PaginationBar page={page} pageSize={PAGE_SIZE} total={filteredResidents.length} onChange={setPage} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right: Session history                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className={`flex-1 min-w-0 ${!mobileShowDetail ? 'hidden lg:block' : ''}`}>
        {/* Mobile back button */}
        {mobileShowDetail && (
          <button type="button" onClick={() => setMobileShowDetail(false)}
            className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-haven-teal-600
              mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
              focus-visible:ring-offset-2 rounded py-1">
            ← Back to Residents
          </button>
        )}
        {selectedResident ? (
          <>
            {/* Resident header */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mb-5
              flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-mono text-base font-bold text-stone-900">{selectedResident.caseId}</p>
                <p className="text-sm text-stone-500 mt-0.5">
                  {selectedResident.safehouse} · {selectedResident.assignedSocialWorker} · Admitted {selectedResident.admissionDate}
                </p>
                <p className="text-xs text-stone-400 mt-1">{residentRecordings.length} session{residentRecordings.length !== 1 ? 's' : ''} recorded</p>
              </div>
              <button type="button" onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2 shrink-0">
                <PlusIcon /> New Session
              </button>
            </div>

            {/* Session list */}
            {loadingRecordings ? (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-stone-400 text-sm">Loading sessions…</p>
              </div>
            ) : residentRecordings.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-stone-400 text-sm">No sessions recorded for this resident.</p>
                <button type="button" onClick={openAdd}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-haven-teal-600 text-white
                    text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                    focus-visible:ring-offset-2">
                  <PlusIcon /> Record First Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {residentRecordings.map(rec => (
                  <div key={rec.id}
                    className="bg-white rounded-xl border border-stone-200 shadow-sm p-5
                      hover:shadow-md hover:border-stone-300 transition-all duration-200">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">{rec.sessionDate}</span>
                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-sm text-stone-600">{rec.socialWorker}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]
                          font-semibold uppercase tracking-wide border
                          ${rec.sessionType === 'Individual' ? 'bg-sky-100 text-sky-800 border-sky-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}>
                          {rec.sessionType}
                        </span>
                        {rec.concernsFlagged && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px]
                            font-semibold uppercase tracking-wide border transition-none
                            bg-rose-100 text-rose-800 border-rose-200">
                            <AlertIcon /> Concern Flagged
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => openView(rec)}
                          className="text-sm font-medium text-haven-teal-600 hover:text-haven-teal-700
                            transition-colors focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-1 rounded">View</button>
                        <button type="button" onClick={() => openDelete(rec)}
                          className="text-sm font-medium text-rose-600 hover:text-rose-700
                            transition-colors focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-rose-500 focus-visible:ring-offset-1 rounded">Delete</button>
                      </div>
                    </div>

                    {/* Emotional state transition */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-stone-400">Start</span>
                      <EmotionBadge state={rec.emotionalStateObserved} />
                      <span className="text-stone-300">→</span>
                      <EmotionBadge state={rec.emotionalStateEnd} />
                      <span className="text-xs text-stone-400">End</span>
                    </div>

                    {/* Narrative preview */}
                    <p className="text-sm text-stone-700 leading-relaxed line-clamp-2">
                      {rec.sessionNarrative}
                    </p>

                    {rec.progressNoted && (
                      <p className="text-xs text-haven-teal-700 mt-2 border-l-2 border-haven-teal-300 pl-3">
                        {rec.progressNoted}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-stone-200 shadow-sm">
            <p className="text-sm text-stone-400">Select a resident on the left to view their session history.</p>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* MODAL: View recording                                               */}
      {/* ================================================================== */}
      {modal === 'view' && selectedRec && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setModal(null)} aria-modal="true" role="dialog" aria-labelledby="view-title">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
              <div>
                <h2 id="view-title" className="text-lg font-semibold text-stone-900">Session Record</h2>
                <p className="text-xs text-stone-400 mt-0.5">{selectedRec.residentCaseId} · {selectedRec.sessionDate}</p>
              </div>
              <button type="button" onClick={() => setModal(null)} aria-label="Close"
                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"><XIcon /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Social Worker', value: selectedRec.socialWorker },
                  { label: 'Session Type',  value: selectedRec.sessionType },
                  ...(selectedRec.sessionDurationMinutes != null
                    ? [{ label: 'Duration', value: `${selectedRec.sessionDurationMinutes} min` }]
                    : []),
                  ...(selectedRec.referralMade ? [{ label: 'Referral', value: 'Made this session' }] : []),
                ].map(r => (
                  <div key={r.label}>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">{r.label}</p>
                    <p className="text-sm text-stone-900">{r.value}</p>
                  </div>
                ))}
              </div>

              {/* Emotional transition */}
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Emotional State</p>
                <div className="flex items-center gap-2">
                  <EmotionBadge state={selectedRec.emotionalStateObserved} />
                  <span className="text-stone-400 text-sm">→</span>
                  <EmotionBadge state={selectedRec.emotionalStateEnd} />
                </div>
              </div>

              {selectedRec.concernsFlagged && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg transition-none">
                  <AlertIcon />
                  <p className="text-sm text-rose-800 font-medium">Concern was flagged in this session.</p>
                </div>
              )}

              {[
                { label: 'Session Narrative',      value: selectedRec.sessionNarrative },
                { label: 'Interventions Applied',  value: selectedRec.interventionsApplied },
                { label: 'Follow-Up Actions',      value: selectedRec.followUpActions },
                { label: 'Progress Noted',         value: selectedRec.progressNoted },
              ].map(row => row.value ? (
                <div key={row.label}>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{row.label}</p>
                  <p className="text-sm text-stone-700 leading-relaxed">{row.value}</p>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}

      {modal === 'add' && selectedResident && (
        <ScheduleSessionModal
          residentId={selectedResident.residentId}
          caseId={selectedResident.caseId}
          assignedSocialWorker={selectedResident.assignedSocialWorker}
          onClose={() => setModal(null)}
          onSaved={saved => {
            setRecordings(p => [{
              id: String(saved.recordingId ?? 0),
              residentCaseId: selectedResident.caseId,
              sessionDate: saved.sessionDate ?? '',
              socialWorker: saved.socialWorker ?? '',
              sessionType: (saved.sessionType as SessionType) ?? 'Individual',
              sessionDurationMinutes: saved.sessionDurationMinutes ?? null,
              emotionalStateObserved: (saved.emotionalStateObserved as EmotionalState) ?? 'Calm',
              emotionalStateEnd: (saved.emotionalStateEnd as EmotionalState) ?? 'Calm',
              sessionNarrative: saved.sessionNarrative ?? '',
              interventionsApplied: saved.interventionsApplied ?? '',
              followUpActions: saved.followUpActions ?? '',
              progressNoted: saved.progressNoted ?? '',
              concernsFlagged: isTruthy(saved.concernsFlagged),
              referralMade: isTruthy(saved.referralMade),
            }, ...p]);
          }}
        />
      )}

      {/* Delete confirmation */}
      {modal === 'delete' && selectedRec && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
          onClick={() => setModal(null)} aria-modal="true" role="dialog">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-stone-900 mb-2">Delete Session Record</h2>
              <p className="text-sm text-stone-600">Delete the session record from <strong>{selectedRec.sessionDate}</strong>? This cannot be undone.</p>
            </div>
            <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                  text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2">Cancel</button>
              <button type="button" onClick={confirmDelete}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-rose-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-rose-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-none">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
