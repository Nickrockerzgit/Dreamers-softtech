import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight, User, Briefcase, Loader2 } from "lucide-react";

interface QuoteConfirmModalProps {
  isOpen: boolean;
  onClose: () => Promise<void>;
  onConfirm: () => Promise<void>;
  data: {
    name: string;
    email: string;
    project: string;
    company?: string;
  };
}

const QuoteConfirmModal: React.FC<QuoteConfirmModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (action: 'confirm' | 'dismiss') => {
    setIsProcessing(true);
    try {
        if (action === 'confirm') {
            await onConfirm();
        } else {
            await onClose();
        }
    } catch (error) {
        console.error("Action failed:", error);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0c1117]/90 backdrop-blur-xl transition-opacity duration-500"
        onClick={() => !isProcessing && handleAction('dismiss')}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#12181f] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C89A3D]/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative p-10 md:p-12 text-center">
          {/* Close */}
          {!isProcessing && (
            <button 
                onClick={() => handleAction('dismiss')}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
          )}

          {/* Icon Header */}
          <div className="w-20 h-20 bg-[#C89A3D]/10 rounded-3xl border border-[#C89A3D]/20 flex items-center justify-center mx-auto mb-8 relative">
             {isProcessing ? (
                <Loader2 className="w-10 h-10 text-[#C89A3D] animate-spin" />
             ) : (
                <>
                    <div className="absolute inset-0 bg-[#C89A3D] rounded-3xl blur-md opacity-20 animate-pulse" />
                    <CheckCircle2 className="w-10 h-10 text-[#C89A3D] relative z-10" />
                </>
             )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            {isProcessing ? "Processing..." : <>Ready to <span className="text-[#C89A3D]">Proceed?</span></>}
          </h2>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            {isProcessing 
                ? "Securing your proposal details, please wait a moment."
                : <>Hello <span className="text-white font-bold">{data.name}</span>! We have prepared everything for your <span className="text-white font-bold">{data.project}</span> project. Click below to finalize your request.</>
            }
          </p>

          {/* Summary Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 text-left space-y-4 opacity-80">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Client Name</p>
                    <p className="text-sm font-semibold text-white">{data.name}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Project Type</p>
                    <p className="text-sm font-semibold text-white">{data.project}</p>
                </div>
             </div>
          </div>

          {/* Action */}
          <button
            onClick={() => handleAction('confirm')}
            disabled={isProcessing}
            className="w-full py-5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-bold rounded-2xl text-base transition-all shadow-lg shadow-[#C89A3D]/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Finalizing..." : "Confirm & Continue"}
            {!isProcessing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
          </button>
          
          {!isProcessing && (
            <p className="mt-6 text-[11px] text-slate-500 font-medium">
                Not {data.name}? <button onClick={() => handleAction('dismiss')} className="text-[#C89A3D] hover:underline">Dismiss this proposal</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmModal;
