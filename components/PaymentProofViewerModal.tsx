"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface PaymentProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number | null;
  proofPath?: string | null;
  userName?: string;
}

export default function PaymentProofViewerModal({
  isOpen,
  onClose,
  requestId,
  proofPath,
  userName,
}: PaymentProofViewerModalProps) {
  if (!requestId) return null;

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const fileUrl = proofPath && proofPath.startsWith('http')
    ? proofPath
    : `${backendBaseUrl}/admin/membership-requests/${requestId}/proof`;

  const isImage = proofPath && (
    proofPath.endsWith('.jpg') || 
    proofPath.endsWith('.jpeg') || 
    proofPath.endsWith('.png') || 
    proofPath.includes('/image/upload/')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-black text-[#0f172a]">
              Payment Proof Receipt
            </DialogTitle>
            {userName && (
              <span className="text-xs font-bold text-slate-500 block mt-0.5">
                Uploaded by {userName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 pr-6">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Open in new tab"
            >
              <OpenInNewIcon className="w-4 h-4" /> Open Original
            </a>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 min-h-[350px]">
          {isImage ? (
            <img
              src={fileUrl}
              alt="Payment Proof"
              className="max-h-[450px] w-auto object-contain rounded-xl shadow-xs"
            />
          ) : (
            <iframe
              src={fileUrl}
              className="w-full h-[450px] rounded-xl border-0"
              title="Payment Proof Document"
            />
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
