import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, X } from "lucide-react";

interface CSVIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchIngest: (csvText: string) => void;
}

export const CSVIngestModal: React.FC<CSVIngestModalProps> = ({
  isOpen,
  onClose,
  onBatchIngest,
}) => {
  const [csvContent, setCsvContent] = useState(
    `sender,amount,merchant,paymentMethod,location\nRahul Verma,25000,Amazon India,UPI,Mumbai India\nAnanya Sen,-1200,Flipkart,Credit Card,Delhi India\nSiddharth Rao,450000,Crypto Overseas,RTGS,Lagos Nigeria\nDeepak Joshi,1250,Swiggy,UPI,Bengaluru India`
  );

  if (!isOpen) return null;

  const handleImport = () => {
    onBatchIngest(csvContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-xl text-slate-800 text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Batch CSV Ingestion Tool</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-600">
          Upload or paste raw CSV financial transactions. The Data Quality Validation Engine will automatically filter valid transactions and send malformed rows to the Dead Letter Queue.
        </p>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">CSV Content (Header: sender, amount, merchant, paymentMethod, location)</label>
          <textarea
            rows={7}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1 text-[11px]">
          <div className="font-semibold text-slate-900">Validation Engine Rules Applied:</div>
          <div>• Amount &gt; 0 check (Negative amounts will be rejected to DLQ)</div>
          <div>• Payment Channel schema validation (UPI, Credit Card, RTGS, SWIFT, NEFT)</div>
          <div>• High Amount threshold &gt; ₹2,00,000 auto-assigned to Fraud Engine</div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition shadow-xs"
          >
            Publish Batch to Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
