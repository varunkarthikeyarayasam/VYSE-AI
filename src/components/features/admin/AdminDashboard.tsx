import React, { useState, useEffect } from "react";
import { ShieldCheck, Check, X, Clock, FileText, User, AlertCircle } from "lucide-react";
import { Card, Badge, Button, Modal } from "../../ui";
import { getAdminOdRequests, reviewOdRequest } from "../../../lib/api/od";
import { useAuth } from "../../../store/authContext";
import type { OdRequest } from "../../../types/database";

export function AdminDashboard() {
  const { role } = useAuth();
  const [requests, setRequests] = useState<OdRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("submitted");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOdId, setSelectedOdId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await getAdminOdRequests(statusFilter === "all" ? undefined : statusFilter);
      setRequests(data);
    } catch (err) {
      console.error("Error loading admin OD requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(odId: string) {
    setProcessingId(odId);
    try {
      await reviewOdRequest(odId, "approved");
      await loadRequests();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOdId || !rejectionReason.trim()) return;

    setProcessingId(selectedOdId);
    try {
      await reviewOdRequest(selectedOdId, "rejected", rejectionReason);
      setRejectModalOpen(false);
      setSelectedOdId(null);
      setRejectionReason("");
      await loadRequests();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  }

  if (role !== "admin" && role !== "faculty") {
    return (
      <Card className="text-center py-16 space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Access Restricted</h3>
        <p className="text-xs text-slate-400">
          The Faculty & Administration Dashboard requires elevated administrative credentials.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">Faculty OD Review Queue</h2>
            <Badge variant="glow">FACULTY AUTHORIZED</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Review, audit, and authorize On-Duty leave applications submitted by students
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Queue:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#11141E] text-xs text-slate-200 border border-[#252E46] rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="submitted">Pending Review (Submitted)</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Submissions</option>
          </select>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="text-center py-10 text-slate-400 text-sm">
            Loading review queue...
          </Card>
        ) : requests.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-sm">
            No OD requests pending in this status queue.
          </Card>
        ) : (
          requests.map((od) => (
            <Card key={od.id} className="space-y-4 hover:border-[#354060] transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100 text-base">
                      {od.student?.name || "Student"}
                    </span>
                    <span className="text-xs font-mono text-indigo-400">
                      ({od.student?.roll_number})
                    </span>
                    <Badge
                      variant={
                        od.status === "approved"
                          ? "success"
                          : od.status === "rejected"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {od.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-slate-200 text-sm">
                    {od.event?.title || od.reason}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Requested Duration: 📅 {od.from_date} to {od.to_date}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reason: {od.reason}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {od.status === "submitted" ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        loading={processingId === od.id}
                        onClick={() => handleApprove(od.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setSelectedOdId(od.id);
                          setRejectModalOpen(true);
                        }}
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">
                      Decided: {od.status}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject OD Request"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Please provide an official institutional rationale for rejecting this OD request.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Reason for Rejection
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              required
              placeholder="e.g. Clashes with mandatory lab session / Prior academic advisory"
              className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#212738]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={!!processingId}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}