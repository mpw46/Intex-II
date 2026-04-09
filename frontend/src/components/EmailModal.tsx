import { useState, useEffect } from 'react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientLabel: string;
  recipientEmail?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export default function EmailModal({
  isOpen,
  onClose,
  recipientLabel,
  recipientEmail,
  defaultSubject = '',
  defaultBody = '',
}: EmailModalProps) {
  const [step, setStep] = useState<'compose' | 'confirm'>('compose');
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  // Reset to compose state whenever the modal opens fresh
  useEffect(() => {
    if (isOpen) {
      setStep('compose');
      setSubject(defaultSubject);
      setBody(defaultBody);
    }
  }, [isOpen, defaultSubject, defaultBody]);

  if (!isOpen) return null;

  const inputCls = `w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm
    text-stone-900 placeholder:text-stone-400 hover:border-stone-400
    focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center p-0 sm:p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="email-modal-title"
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
          <div>
            <h2 id="email-modal-title" className="text-lg font-semibold text-stone-900">
              {step === 'compose' ? 'Compose Email' : 'Confirm & Send'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">To: {recipientLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'compose' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="em-subject" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  id="em-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. An update from Haven"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="em-body" className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="em-body"
                  rows={8}
                  required
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your message here…"
                  className={inputCls}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 space-y-2.5">
                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-16 shrink-0 pt-0.5">To</span>
                  <div>
                    <p className="text-sm text-stone-900 font-medium">{recipientLabel}</p>
                    {recipientEmail && (
                      <p className="text-xs text-stone-500 mt-0.5">{recipientEmail}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-16 shrink-0 pt-0.5">Subject</span>
                  <p className="text-sm text-stone-900">{subject}</p>
                </div>
              </div>

              {/* Message preview */}
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Message Preview</p>
                <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {body}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex justify-between items-center shrink-0">
          {step === 'compose' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                  text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!subject.trim() || !body.trim()}
                onClick={() => setStep('confirm')}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                Review →
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('compose')}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-stone-700
                  text-sm font-medium rounded-lg border border-stone-300 transition-colors hover:bg-stone-50
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                ← Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-haven-teal-600 text-white
                  text-sm font-semibold rounded-lg transition-colors hover:bg-haven-teal-700
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
              >
                Send Email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
