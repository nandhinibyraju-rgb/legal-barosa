import fs from 'fs';

const CASE_SUMMARIES = {
  1: { timeline: '5 Months', exposure: '₹4.2 Cr', satisfaction: 'Very Satisfied', resolution: 'OTS Settlement (58%)' },
  2: { timeline: '9 Weeks', exposure: 'Not disclosed', satisfaction: 'Very Satisfied', resolution: 'SARFAESI Stay / Relief' },
  3: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'ARC Settlement (64%)' },
  4: { timeline: '11 Months', exposure: '₹3.1 Cr', satisfaction: 'Satisfied', resolution: 'DRT Settlement (52%)' },
  5: { timeline: '6 Months', exposure: '₹14 Cr', satisfaction: 'Highly Satisfied', resolution: 'Restructuring (Standard Preserved)' },
  6: { timeline: '10 Months', exposure: '₹38 Cr', satisfaction: 'Very Satisfied', resolution: 'Consortium OTS (63%)' },
  7: { timeline: 'Not disclosed', exposure: '₹2.6 Cr', satisfaction: 'Very Satisfied', resolution: 'Guarantor Settlement' },
  8: { timeline: '7 Months', exposure: '₹22 Cr', satisfaction: 'Satisfied', resolution: 'Promoter Buyout & Settlement' },
  9: { timeline: '4 Months', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'ARC Settlement (64%)' },
  10: { timeline: '9 Weeks', exposure: 'Not disclosed', satisfaction: 'Very Satisfied', resolution: 'SARFAESI Status Quo' },
  11: { timeline: '5 Months', exposure: '₹4.2 Cr', satisfaction: 'Very Satisfied', resolution: 'Manufacturing OTS (58%)' },
  12: { timeline: '11 Months', exposure: '₹3.1 Cr', satisfaction: 'Satisfied', resolution: 'DRT Settlement (52%)' },
  13: { timeline: '6 Months', exposure: '₹14 Cr', satisfaction: 'Satisfied', resolution: 'Loan Restructuring' },
  14: { timeline: '10 Months', exposure: '₹38 Cr', satisfaction: 'Very Satisfied', resolution: 'Multi-Lender OTS (63%)' },
  15: { timeline: '4 Months', exposure: 'Not disclosed', satisfaction: 'Very Satisfied', resolution: 'Guarantor Relief & Closure' },
  16: { timeline: '7 Months', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Mezzanine Funding & Buyout' },
  17: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Credit Settlement Support' },
  18: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Restructuring & Repayment Plan' },
  19: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Harassment Defense & Notice Strategy' },
  20: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Legal Notice Review & Guidance' },
  21: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'OTS Proposal Preparation' },
  22: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Settlement with Credit Closure' },
  23: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Moratorium / Repayment Relief' },
  24: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'NBFC Take-Out Coordination' },
  25: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Asset-Backed Settlement' },
  26: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Very Satisfied', resolution: 'Legal Notice Defense & Advisory' },
  27: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'DRT Process Advisory' },
  28: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Family Debt Restructuring' },
  29: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Multi-Lender Coordinated Settlement' },
  30: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Business Debt Restructuring' },
  31: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Credit Rehabilitation' },
  32: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Recovery Defense Roadmap' },
  33: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'OTS Negotiation & Structuring' },
  34: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Settlement & Closure Docs' },
  35: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Distressed Debt Funding' },
  36: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'SARFAESI Property Defense' },
  37: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Business Loan Settlement' },
  38: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Arbitration & Legal Defense' },
  39: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Satisfied', resolution: 'Large Exposure Restructuring' },
  40: { timeline: 'Not disclosed', exposure: 'Not disclosed', satisfaction: 'Very Satisfied', resolution: 'Comprehensive Debt Resolution' }
};

const src = fs.readFileSync('src/data/reviewsData.js', 'utf8');

// Parse reviewsData.js to inject caseSummary directly into each review
const updated = src.replace(/(\s+id:\s*(\d+),[\s\S]*?reviewText:\s*['"`][\s\S]*?['"`],?)(\s*\},?)/g, (match, prefix, idStr, suffix) => {
  const id = Number(idStr);
  const cs = CASE_SUMMARIES[id];
  if (!cs) return match;
  
  const caseSummaryBlock = `\n    caseSummary: {\n      timeline: '${cs.timeline}',\n      exposure: '${cs.exposure}',\n      satisfaction: '${cs.satisfaction}',\n      resolution: '${cs.resolution}',\n    },`;
  return `${prefix}${caseSummaryBlock}${suffix}`;
});

fs.writeFileSync('src/data/reviewsData.js', updated, 'utf8');
console.log('Successfully updated src/data/reviewsData.js with structured caseSummary for all reviews!');
