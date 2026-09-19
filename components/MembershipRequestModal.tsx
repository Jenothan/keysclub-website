"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/axios';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface MembershipRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MembershipRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: MembershipRequestModalProps) {
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }
      if (file) {
        formData.append('payment_proof', file);
      }

      const res = await api.post('/membership-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || 'Membership request submitted successfully!');
      setNotes('');
      setFile(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit membership request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-slate-900 border border-yellow-400/40 flex items-center justify-center font-black shrink-0 shadow-sm">
              <ShieldIcon className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-[#0f172a] tracking-tight">
                Apply for Badminton Court Membership
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs font-medium mt-0.5">
                Unlock exclusive Peak Hour slot bookings (3 PM - 8 PM) & priority member privileges.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Member Benefits Box */}
          <div className="bg-yellow-50/80 border border-yellow-200 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] block">
              ✨ Member Privileges Include:
            </span>
            <ul className="space-y-1 text-slate-700 font-semibold list-disc list-inside">
              <li>Book high-demand **Peak Hour Slots** (3 PM to 8 PM)</li>
              <li>Priority slot selection and member-only court access</li>
              <li>Direct Admin verification and membership status badge</li>
            </ul>
          </div>

          {/* Payment Proof File Upload (Optional) */}
          <div>
            <label className="block text-xs font-black text-[#0f172a] uppercase tracking-wider mb-2">
              Payment Proof / Receipt <span className="text-slate-400 font-bold lowercase">(optional - PDF or Image)</span>
            </label>

            {!file ? (
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-yellow-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-yellow-50/30 transition-all text-center">
                <CloudUploadIcon className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload payment proof</span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">PNG, JPG, JPEG or PDF (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-yellow-50 border border-yellow-300 rounded-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AttachFileIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-slate-900 truncate block">
                      {file.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 hover:bg-yellow-200/50 rounded-xl text-yellow-900 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Notes Field (Optional) */}
          <div>
            <label className="block text-xs font-black text-[#0f172a] uppercase tracking-wider mb-1.5">
              Request Notes / Reference <span className="text-slate-400 font-bold lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter payment reference number, transaction ID, or message for Admin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:border-yellow-500 rounded-2xl text-slate-800 font-medium focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-xs rounded-xl border border-yellow-500 shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" /> Submit Request
                </>
              )}
            </button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
