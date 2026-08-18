import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Sparkles, Clock, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';

interface FutureFeaturePlaceholderProps {
  title: string;
  phaseLabel: string;
  description: string;
  featuresList: string[];
}

export const FutureFeaturePlaceholder: React.FC<FutureFeaturePlaceholderProps> = ({
  title,
  phaseLabel,
  description,
  featuresList,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-200 shadow-xs">
        <Clock className="w-8 h-8 stroke-[2.5]" />
      </div>

      <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-widest rounded-full border border-blue-200 mb-2">
        {phaseLabel}
      </span>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>

      <p className="text-xs text-slate-600 max-w-md mt-2 leading-relaxed">
        {description}
      </p>

      {/* Feature Preview Cards */}
      <div className="mt-6 p-5 bg-white border border-slate-200 rounded-2xl w-full text-left shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" /> Upcoming Feature Highlights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          {featuresList.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate('/app/dashboard')} variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
