import React, { useState } from 'react';
import { initialDocumentChecklist } from '../../data/collegeDashboardData';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

/**
 * DocumentUploadChecklist Component
 * Statutory checklist with client-side file selection, format/size validation,
 * and clear prototype simulation notices.
 */
const DocumentUploadChecklist = () => {
  const [documents, setDocuments] = useState(initialDocumentChecklist);
  const [uploadError, setUploadError] = useState(null);
  const [activeUploadId, setActiveUploadId] = useState(null);

  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (docId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Invalid file format for "${file.name}". Supported formats: PDF, PNG, JPG.`);
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File "${file.name}" exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    // Format human-readable size
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Simulate upload
    setActiveUploadId(docId);
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              status: 'Uploaded',
              fileName: file.name,
              fileSize: sizeStr,
              uploadedDate: 'Just now',
            };
          }
          return doc;
        })
      );
      setActiveUploadId(null);
    }, 600);
  };

  const handleRemoveFile = (docId) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: 'Pending Upload',
            fileName: null,
            fileSize: null,
            uploadedDate: null,
          };
        }
        return doc;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 text-amber-950 text-xs">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-200 px-2 py-0.5 rounded text-amber-950 inline-block mb-1">
              PROTOTYPE FILE SIMULATION
            </span>
            <p className="leading-relaxed">
              Files selected in this checklist are processed strictly inside your local browser memory for prototype demonstration.
              <strong> No documents are uploaded to external cloud servers, and no actual document authentication or legal clearance occurs.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {uploadError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Document Checklist Items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#102D52]">
              Mandatory Regulatory Document Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Statutory records mandated under AICTE Approval Process Handbook (APH) 2026-27.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Supported: PDF, PNG, JPG (Max 10MB)
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => {
            const isUploaded = doc.status === 'Uploaded';
            const isUploading = activeUploadId === doc.id;

            return (
              <div
                key={doc.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Category, Document Name, Handbook Norm */}
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {doc.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] font-mono font-semibold text-blue-800">
                      {doc.handbookNorm}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#102D52]">
                    {doc.name}
                  </h3>

                  {isUploaded && doc.fileName && (
                    <div className="flex items-center space-x-2 text-xs text-slate-600 pt-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono text-[11px] font-semibold text-slate-800 truncate max-w-xs">
                        {doc.fileName}
                      </span>
                      <span className="text-[10px] text-slate-400">({doc.fileSize})</span>
                      <span className="text-[10px] text-slate-400">· Uploaded {doc.uploadedDate}</span>
                    </div>
                  )}
                </div>

                {/* Right: Upload Actions & Status */}
                <div className="flex items-center space-x-3 shrink-0">
                  {isUploading ? (
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
                      <div className="w-3.5 h-3.5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                      <span>Simulating Ingestion...</span>
                    </div>
                  ) : isUploaded ? (
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Uploaded</span>
                      </span>

                      {/* Replace / Remove button */}
                      <label className="cursor-pointer px-2.5 py-1 text-xs font-bold rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-700">
                        <span>Replace</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileChange(doc.id, e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(doc.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {doc.status === 'Renewal Required' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Renewal Due
                        </span>
                      )}

                      <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Select File</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileChange(doc.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadChecklist;
