import React, { useState } from 'react';
import Gauge from './Gauge';
import { 
  TrendingDown, 
  TrendingUp, 
  ChevronDown, 
  X
} from 'lucide-react';

export default function DashboardPreview({ onOpenConsult }) {
  const [card1Toggle, setCard1Toggle] = useState('active');
  const [card3Toggle, setCard3Toggle] = useState('desk');
  const [targetMonth, setTargetMonth] = useState('10');
  const [targetYear, setTargetYear] = useState('100');
  const [formSaved, setFormSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setFormSaved(true);
    setTimeout(() => setFormSaved(false), 2500);
  };

  return (
    <div className="w-full px-3 sm:px-4">
      {/* Wrapper Tray */}
      <div className="bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto shadow-sm border border-neutral-300/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* ======================================================== */}
          {/* CARD 1 — CASES RESOLVED & TARGET GAUGE */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-xs border border-neutral-200/80">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between text-[13px] mb-3">
                <span className="font-semibold text-[#0B2A5B]">Cases Resolved</span>
                <span className="text-neutral-500 font-medium">This Month</span>
              </div>

              {/* Big Number & Change Pill */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[28px] font-semibold text-[#0B2A5B] leading-none tracking-tight">
                  6,896
                </span>
                <span className="bg-blue-50 text-[#123E8A] border border-[#168CFF]/20 rounded-full px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3 text-[#168CFF]" />
                  -3,382 (33%)
                </span>
              </div>

              {/* Small caption */}
              <p className="text-[11px] text-neutral-400 mb-4">
                Compared to yesterday
              </p>

              {/* Centered label */}
              <div className="text-center text-[12px] font-medium text-neutral-600 mb-1">
                Month Target achieved
              </div>

              {/* Gauge Component at 92% */}
              <div className="my-1">
                <Gauge 
                  value={92} 
                  color="#168CFF" 
                  showLabels={true} 
                  min="389K" 
                  max="425K" 
                />
              </div>
            </div>

            {/* Toggle Pill at Bottom */}
            <div className="bg-neutral-100 rounded-full p-1 flex items-center mt-4">
              <button
                type="button"
                onClick={() => setCard1Toggle('active')}
                className={`flex-1 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  card1Toggle === 'active'
                    ? 'bg-white text-[#0B2A5B] shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Harassment Shield
              </button>
              <button
                type="button"
                onClick={() => setCard1Toggle('inactive')}
                className={`flex-1 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  card1Toggle === 'inactive'
                    ? 'bg-white text-[#0B2A5B] shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Loan Settlement
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2 — LEGAL DISPUTE SETTINGS FORM */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-xs border border-neutral-200/80">
            {/* Dropdown 1 */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-700 mb-1">
                Show figures for
              </label>
              <button
                type="button"
                onClick={() => onOpenConsult?.('Dispute Assessment Figures')}
                className="w-full flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 text-[12.5px] text-neutral-800 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <span>This month</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#168CFF]" />
              </button>
            </div>

            {/* Dropdown 2 */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-700 mb-1">
                Compare period by
              </label>
              <button
                type="button"
                onClick={() => onOpenConsult?.('Period Comparison')}
                className="w-full flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 text-[12.5px] text-neutral-800 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <span className="truncate">Month-to-date (MTD)</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#168CFF] shrink-0 ml-1" />
              </button>
            </div>

            {/* Input 1 */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-700 mb-1">
                Set targets (This month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                  #
                </span>
                <input
                  type="text"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-1.5 text-[12.5px] text-neutral-800 focus:outline-none focus:border-[#168CFF] transition-colors"
                />
              </div>
            </div>

            {/* Input 2 */}
            <div>
              <label className="block text-[12px] font-medium text-neutral-700 mb-1">
                Set targets (This year)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                  #
                </span>
                <input
                  type="text"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-1.5 text-[12.5px] text-neutral-800 focus:outline-none focus:border-[#168CFF] transition-colors"
                />
              </div>
            </div>

            {/* Footer with Save, Cancel, X */}
            <div className="flex items-center gap-3 pt-2 mt-auto">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[12px] font-semibold rounded-lg px-5 py-2 transition-colors cursor-pointer shadow-xs"
              >
                {formSaved ? 'Saved!' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetMonth('10');
                  setTargetYear('100');
                }}
                className="text-[12px] text-neutral-500 hover:text-neutral-800 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onOpenConsult?.('Dismiss Assessment')}
                className="ml-auto p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 3 — ADVOCATE ASSIGNMENTS & ACTIONS */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-xs border border-neutral-200/80">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between text-[13px] mb-3">
                <span className="font-semibold text-[#0B2A5B]">Advocate Actions</span>
                <span className="text-neutral-500 font-medium">today</span>
              </div>

              {/* Big Number & Neutral Pill */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[28px] font-semibold text-[#0B2A5B] leading-none tracking-tight">
                  0
                </span>
                <span className="bg-blue-50 text-[#123E8A] border border-[#168CFF]/20 rounded-full px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-[#168CFF]" />
                  0
                </span>
              </div>

              {/* Small caption */}
              <p className="text-[11px] text-neutral-400 mb-4">
                Compared to yesterday
              </p>

              {/* Gauge Component at 68% (no end labels) */}
              <div className="my-2">
                <Gauge 
                  value={68} 
                  color="#9ca3af" 
                  showLabels={false} 
                />
              </div>
            </div>

            {/* Toggle Pill at Bottom */}
            <div className="bg-neutral-100 rounded-full p-1 flex items-center mt-4">
              <button
                type="button"
                onClick={() => setCard3Toggle('desk')}
                className={`flex-1 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  card3Toggle === 'desk'
                    ? 'bg-white text-[#0B2A5B] shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Advocate Desk
              </button>
              <button
                type="button"
                onClick={() => setCard3Toggle('actions')}
                className={`flex-1 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  card3Toggle === 'actions'
                    ? 'bg-white text-[#0B2A5B] shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Legal Notices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
