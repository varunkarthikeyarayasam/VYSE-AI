import React, { useState, useEffect } from "react";
import { Plus, CheckCircle2, Clock, AlertTriangle, XCircle, FileText, Upload, Calendar, ShieldCheck } from "lucide-react";
import { Button, Card, Badge, Modal } from "../../ui";
import { getEvents } from "../../../lib/api/events";
import { checkOdEligibility, prepareOdRequest, confirmOdRequest, getStudentOdRequests, uploadOdDocument } from "../../../lib/api/od";
import { useAuth } from "../../../store/authContext";
import type { CampusEvent, OdRequest, OdEligibilityResult } from "../../../types/database";

export function OdManager() {
  const { student, user } = useAuth();
  const [requests, setRequests] = useState<OdRequest[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedEventId, setSelectedEventId] = useState("");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<OdEligibilityResult | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [student, user]);

  async function loadData() {
    setLoading(true);
    try {
      const studentId = student?.id || user?.id;
      const [eventsData, requestsData] = await Promise.all([
        getEvents(),
        studentId ? getStudentOdRequests(studentId) : Promise.resolve([]),
      ]);
      setEvents(eventsData);
      setRequests(requestsData);
    } catch (err) {
      console.error("Error loading OD data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectEvent(eventId: string) {
    setSelectedEventId(eventId);
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setReason(`Participation in ${ev.title}`);
      setFromDate(ev.event_date);
      setToDate(ev.event_date);

      // Trigger deterministic pre-submission eligibility check
      const studentId = student?.id || user?.id;
      if (studentId) {
        setCheckingEligibility(true);
        try {
          const res = await checkOdEligibility(studentId, ev.id);
          setEligibility(res);
        } catch (err) {
          console.error("Eligibility check error:", err);
        } finally {
          setCheckingEligibility(false);
        }
      }
    } else {
      setEligibility(null);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const studentId = student?.id || user?.id;
    if (!file || !studentId) return;

    setUploadingFile(true);
    try {
      const signedUrl = await uploadOdDocument(file, studentId);
      setUploadedUrl(signedUrl);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const studentId = student?.id || user?.id;
    if (!studentId || !selectedEventId || !eligibility?.eligible) return;

    setSubmitting(true);
    try {
      // Step 1: PREPARE
      const prepared = await prepareOdRequest({
        studentId,
        eventId: selectedEventId,
        reason,
        fromDate,
        toDate,
        documentUrl: uploadedUrl || undefined,
      });

      if (!prepared.eligible) {
        alert("Eligibility check failed. Submission aborted.");
        return;
      }

      // Step 2: CONFIRM & EXECUTE
      await confirmOdRequest(prepared.draft_token);

      setIsModalOpen(false);
      resetForm();
      await loadData();
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSelectedEventId("");
    setReason("");
    setFromDate("");
    setToDate("");
    setUploadedUrl(null);
    setEligibility(null);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
      case "submitted":
        return <Badge variant="info"><Clock className="w-3 h-3" /> Submitted</Badge>;
      case "under_review":
        return <Badge variant="warning"><Clock className="w-3 h-3" /> Under Review</Badge>;
      case "rejected":
        return <Badge variant="danger"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">On-Duty (OD) Leave Management</h2>
          <p className="text-xs text-slate-400">
            Automated eligibility verification with deterministic policy checks
          </p>
        </div>
        <Button variant="glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Request OD Leave
        </Button>
      </div>

      {/* Requests Timeline / List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="text-center py-10 text-slate-400 text-sm">
            Loading OD requests...
          </Card>
        ) : requests.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-sm space-y-3">
            <p>You have no active or historical OD requests.</p>
            <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(true)}>
              Submit your first OD Request
            </Button>
          </Card>
        ) : (
          requests.map((od) => (
            <Card key={od.id} className="hover:border-[#354060] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100 text-base">
                      {od.event?.title || od.reason}
                    </h3>
                    {getStatusBadge(od.status)}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span>📅 {od.from_date} to {od.to_date}</span>
                    <span>•</span>
                    <span>Reason: {od.reason}</span>
                  </p>
                  {od.rejection_reason && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg mt-2">
                      Reason for Rejection: {od.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">
                    Submitted: {od.submitted_at ? new Date(od.submitted_at).toLocaleDateString() : "—"}
                  </span>
                  {od.document_url && (
                    <a
                      href={od.document_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 mt-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Attached Proof
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Request OD Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Submit New OD Request"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Campus Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => handleSelectEvent(e.target.value)}
              required
              className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose an upcoming event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.event_date}) {ev.od_available ? "• OD Eligible" : "• No OD"}
                </option>
              ))}
            </select>
          </div>

          {/* Live Deterministic Pre-Check Banner */}
          {checkingEligibility && (
            <div className="bg-[#141926] p-3 rounded-xl border border-indigo-500/30 text-xs text-indigo-400 flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              Verifying attendance threshold and semester OD allowances...
            </div>
          )}

          {eligibility && !checkingEligibility && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                eligibility.eligible
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {eligibility.eligible ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Eligible for OD ({eligibility.attendance_percent}% Attendance)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Ineligible for OD
                  </>
                )}
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                {eligibility.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purpose / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Private Document Upload to Storage */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Proof Document (Optional: Ticket / Acceptance Letter)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-[#1A2030] hover:bg-[#222A40] text-slate-300 text-xs px-3.5 py-2 rounded-lg border border-[#2B3550] flex items-center gap-2 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploadingFile ? "Uploading..." : "Attach File"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
              </label>
              {uploadedUrl && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File secured
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#212738]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              loading={submitting}
              disabled={!eligibility?.eligible || submitting}
            >
              Confirm & Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}