import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  FileSearch, 
  FileCheck2, 
  Clock, 
  CalendarClock, 
  Users, 
  Scale, 
  Gavel, 
  Percent, 
  Building2, 
  Headset, 
  Calculator, 
  Gauge, 
  TrendingUp, 
  Home, 
  FileSpreadsheet
} from 'lucide-react';

export const SERVICES_DATA = {
  'harassment-protection': {
    slug: 'harassment-protection',
    path: '/services/harassment-protection',
    title: 'Harassment Protection',
    tag: 'RBI Fair Practices Code',
    badgeText: 'Statutory Borrower Rights Protection',
    heading: 'What is Harassment Protection?',
    intro: "Recovery agents and lenders sometimes cross legal lines — repeated threatening calls, visits at odd hours, or contacting your family and employer. This is illegal under RBI's Fair Practices Code, and you don't have to face it alone.",
    problemCategory: 'Harassment',
    ctaTopic: 'Harassment Protection Consultation',
    graphicType: 'shield',
    graphicBadges: [
      { label: 'RBI Fair Practices Code Aligned', status: 'Enforced' },
      { label: 'Call Window Lock: 7am – 7pm Only', status: 'Compliant' },
      { label: 'Family & Employer Contact Shield', status: 'Active' },
      { label: 'Bar Council Legal Cease Notice', status: 'Ready' }
    ],
    keyBenefits: [
      {
        id: 'hp-1',
        icon: ShieldCheck,
        title: 'Stop Illegal Recovery Calls',
        description: 'We intervene directly so agents redirect all communication to our team, not you.',
      },
      {
        id: 'hp-2',
        icon: FileText,
        title: 'Legal Notice Handling',
        description: 'Our advocates respond to any threatening notices or false claims on your behalf.',
      },
      {
        id: 'hp-3',
        icon: Clock,
        title: 'RBI Timing Compliance',
        description: 'Recovery calls outside 7am-7pm or excessive daily contact are violations — we document and act on these.',
      },
      {
        id: 'hp-4',
        icon: Users,
        title: 'Family & Workplace Protection',
        description: 'We stop agents from contacting your relatives, neighbors, or employer.',
      },
      {
        id: 'hp-5',
        icon: Scale,
        title: 'Formal Complaint Support',
        description: 'We help file complaints with RBI/banking ombudsman if harassment continues.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Free Case Consultation',
        description: 'Free consultation call to understand your situation',
      },
      {
        step: '02',
        title: 'Communication Takeover',
        description: 'Our paralegal team takes over communication with recovery agents',
      },
      {
        step: '03',
        title: 'Legal Notice & Escalation',
        description: 'Advocates issue formal legal notices and escalate if harassment persists',
      },
    ],
  },

  'loan-settlement': {
    slug: 'loan-settlement',
    path: '/services/loan-settlement',
    title: 'Loan Settlement',
    tag: 'One-Time Settlement (OTS)',
    badgeText: 'Legally Negotiated Debt Resolution',
    heading: 'What is Loan Settlement?',
    intro: "If you're struggling with multiple loans or credit card dues you can no longer manage, a one-time settlement lets you close your debt for less than the full amount owed — legally negotiated with your lender, with proper documentation to protect you afterward.",
    problemCategory: 'Settlement',
    ctaTopic: 'Loan Settlement Consultation',
    graphicType: 'settlement',
    graphicBadges: [
      { label: 'Substantial Debt Reduction', status: 'Negotiated' },
      { label: 'Official Written No Dues Certificate', status: 'Guaranteed' },
      { label: 'Zero Direct Lender Harassment', status: 'Shielded' },
      { label: 'Multi-Loan / Card Consolidation', status: 'Supported' }
    ],
    keyBenefits: [
      {
        id: 'ls-1',
        icon: Percent,
        title: 'Reduced Payoff Amount',
        description: 'Negotiate settlements often well below your total outstanding balance.',
      },
      {
        id: 'ls-2',
        icon: Building2,
        title: 'Works Across Loan Types',
        description: 'Personal loans, credit cards, and business loans — one process covers multiple debts.',
      },
      {
        id: 'ls-3',
        icon: FileCheck2,
        title: 'Formal Waiver Documentation',
        description: 'Get official written settlement terms and no-dues confirmation, protecting you from future claims.',
      },
      {
        id: 'ls-4',
        icon: ShieldCheck,
        title: 'No Direct Lender Pressure',
        description: "Our team handles all negotiation directly, so you're not pressured into a bad deal.",
      },
      {
        id: 'ls-5',
        icon: Clock,
        title: 'Faster Debt Closure',
        description: 'Settle in weeks instead of dragging payments out for years.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Eligibility Assessment',
        description: 'Free consultation to review your total debt and eligibility for settlement',
      },
      {
        step: '02',
        title: 'Lender Negotiation',
        description: 'Our team negotiates directly with your lender(s) for the best possible terms',
      },
      {
        step: '03',
        title: 'Official Debt Closure',
        description: 'You receive formal settlement documents and official closure confirmation',
      },
    ],
  },

  'legal-notice-review': {
    slug: 'legal-notice-review',
    path: '/services/legal-notice-review',
    title: 'Legal Notice Review',
    tag: 'Advocate Defense',
    badgeText: 'High Court & District Advocate Panel',
    heading: 'What is Legal Notice Review?',
    intro: "Received a legal notice, summons, or court letter and don't know how serious it is or what to do next? Our advocates review the notice, explain your actual legal position in plain language, and prepare a proper response within the required deadline.",
    problemCategory: 'LegalNotice',
    ctaTopic: 'Legal Notice Review Consultation',
    graphicType: 'legal',
    graphicBadges: [
      { label: 'Statutory Deadline Safeguard', status: '48h Review' },
      { label: 'Advocate-Drafted Legal Reply', status: 'Custom' },
      { label: 'Section 138 & Recovery Suits', status: 'Defended' },
      { label: 'Comprehensive Case Risk Map', status: 'Provided' }
    ],
    keyBenefits: [
      {
        id: 'lnr-1',
        icon: FileSearch,
        title: 'Clear Notice Explanation',
        description: "We break down what the notice actually means and what's at stake, in simple terms.",
      },
      {
        id: 'lnr-2',
        icon: CalendarClock,
        title: 'Deadline Protection',
        description: 'Notices have strict response windows — we ensure your reply is filed on time, every time.',
      },
      {
        id: 'lnr-3',
        icon: Scale,
        title: 'Drafted by Advocates',
        description: 'Every response is prepared and reviewed by qualified legal professionals, not templates.',
      },
      {
        id: 'lnr-4',
        icon: Gavel,
        title: 'Covers All Notice Types',
        description: 'Cheque bounce, recovery suits, consumer complaints, and more — one team handles it all.',
      },
      {
        id: 'lnr-5',
        icon: Headset,
        title: 'Ongoing Case Support',
        description: 'We stay with you through follow-up hearings or further correspondence, not just the first reply.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Notice Submission',
        description: 'Share the notice with us for a free initial review',
      },
      {
        step: '02',
        title: 'Risk Assessment & Reply',
        description: 'Our advocate assesses the legal risk and drafts your response',
      },
      {
        step: '03',
        title: 'Filing & Representation',
        description: 'We file your reply and support you through any next steps',
      },
    ],
  },

  'debt-management': {
    slug: 'debt-management',
    path: '/services/debt-management',
    title: 'Debt Management',
    tag: 'Restructuring & Consolidation',
    badgeText: 'Stress-Free Financial Restructuring',
    heading: 'What is Debt Management?',
    intro: "Juggling multiple unsecured loans, credit cards, and EMIs every month can feel overwhelming. A structured Debt Management Plan consolidates everything into one affordable monthly payment, based on your actual income — without the compounding stress of dealing with each creditor separately.",
    problemCategory: 'Settlement',
    ctaTopic: 'Debt Management Consultation',
    graphicType: 'debt',
    graphicBadges: [
      { label: 'Single Consolidated Monthly Payment', status: 'Optimized' },
      { label: 'Paralegal Creditor Call Re-route', status: 'Active' },
      { label: 'Cheque Bounce & Notice Defense', status: 'Included' },
      { label: 'CIBIL Rebuilding Trajectory', status: 'Monitored' }
    ],
    keyBenefits: [
      {
        id: 'dm-1',
        icon: Calculator,
        title: 'One Affordable Payment',
        description: 'Replace multiple monthly payments with a single amount that fits your budget.',
      },
      {
        id: 'dm-2',
        icon: Headset,
        title: 'We Handle Creditor Communication',
        description: 'All creditor calls and correspondence get redirected to our paralegal team.',
      },
      {
        id: 'dm-3',
        icon: ShieldAlert,
        title: 'Legal Protection Included',
        description: 'Any legal notices related to bounced cheques or property risk are handled by our advocates.',
      },
      {
        id: 'dm-4',
        icon: Gauge,
        title: 'Credit Score Improvement',
        description: 'Consistent structured payments help rebuild your credit rating over time.',
      },
      {
        id: 'dm-5',
        icon: TrendingUp,
        title: 'Long-Term Financial Stability',
        description: 'Ongoing budgeting guidance to help you stay debt-free after the plan ends.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Financial Review',
        description: 'Free consultation to review your income, expenses, and total debt',
      },
      {
        step: '02',
        title: 'Custom Repayment Plan',
        description: 'We design a personalized monthly repayment plan across all your creditors',
      },
      {
        step: '03',
        title: 'Single Payment & Support',
        description: 'Make one monthly payment while we manage creditor communication and legal matters',
      },
    ],
  },

  'npa-secured-loans': {
    slug: 'npa-secured-loans',
    path: '/services/npa-secured-loans',
    title: 'NPA & Secured Loans',
    tag: 'SARFAESI & DRT Defense',
    badgeText: 'Property & Collateral Protection',
    heading: 'What is NPA & Secured Loan Support?',
    intro: "If your loan account has been marked as an NPA (Non-Performing Asset) or you're facing SARFAESI notices, auction threats, or property repossession risk, timely legal action can make the difference between resolution and losing your asset. We specialize in defending borrowers at every stage of this process.",
    problemCategory: 'NPA',
    ctaTopic: 'NPA & Secured Loans Consultation',
    graphicType: 'npa',
    graphicBadges: [
      { label: 'SARFAESI Sec 13(2) & 13(4) Reply', status: 'Statutory' },
      { label: 'Debt Recovery Tribunal (DRT) Filing', status: 'Secured' },
      { label: 'Urgent Auction & Repossession Stay', status: 'Prioritized' },
      { label: 'Commercial Restructuring / OTS', status: 'Negotiated' }
    ],
    keyBenefits: [
      {
        id: 'npa-1',
        icon: FileText,
        title: 'SARFAESI Notice Defense',
        description: 'We respond to and challenge improperly issued SARFAESI notices on your behalf.',
      },
      {
        id: 'npa-2',
        icon: Building2,
        title: 'DRT Representation',
        description: 'Our advocates represent you before the Debt Recovery Tribunal when needed.',
      },
      {
        id: 'npa-3',
        icon: Home,
        title: 'Auction & Repossession Stays',
        description: 'We act quickly to seek stays on property auction or asset seizure where legally possible.',
      },
      {
        id: 'npa-4',
        icon: FileSpreadsheet,
        title: 'Restructuring Negotiation',
        description: 'We explore restructuring or settlement options with the lender before matters escalate further.',
      },
      {
        id: 'npa-5',
        icon: Clock,
        title: 'Time-Sensitive Action',
        description: 'NPA cases move fast — we prioritize urgent cases to protect your legal rights within deadlines.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Urgent Case Review',
        description: 'Share your NPA notice or loan details for a free urgent case review',
      },
      {
        step: '02',
        title: 'Legal Assessment & Filing',
        description: 'Our advocates assess your legal options and file necessary responses',
      },
      {
        step: '03',
        title: 'Tribunal & Lender Defense',
        description: 'We represent you through DRT proceedings or negotiate directly with the lender',
      },
    ],
  },

  'credit-recovery': {
    slug: 'credit-recovery',
    path: '/services/credit-recovery',
    title: 'Credit Recovery',
    tag: 'Credit Score Repair & Cleanse',
    badgeText: 'Official Credit Bureau Dispute & Record Cleanse',
    heading: 'What is Credit Recovery?',
    intro: "A damaged credit score can affect your ability to get loans, credit cards, or even rent a home. Once your debts are resolved, we help you rebuild your credit responsibly — reviewing your credit report for errors and securing official No Dues Certificates from your lenders.",
    problemCategory: 'CreditRecovery',
    ctaTopic: 'Credit Recovery Consultation',
    graphicType: 'credit',
    graphicBadges: [
      { label: 'CIBIL / Experian Report Audit', status: 'Complete' },
      { label: 'Erroneous Written-Off Removal', status: 'Disputed' },
      { label: 'Official Lender No Dues Verification', status: 'Verified' },
      { label: '750+ CIBIL Score Blueprint', status: 'Active' }
    ],
    keyBenefits: [
      {
        id: 'cr-1',
        icon: FileSearch,
        title: 'Credit Report Review',
        description: 'We check your credit report for errors, outdated entries, or incorrect settlements.',
      },
      {
        id: 'cr-2',
        icon: FileCheck2,
        title: 'Official No Dues Certificates',
        description: 'We secure formal closure documents from lenders once debts are settled.',
      },
      {
        id: 'cr-3',
        icon: Gauge,
        title: 'Score Rebuilding Guidance',
        description: 'Practical steps to improve your credit score steadily over time.',
      },
      {
        id: 'cr-4',
        icon: ShieldCheck,
        title: 'Dispute Resolution',
        description: 'We help you formally dispute incorrect or unfair entries with credit bureaus.',
      },
      {
        id: 'cr-5',
        icon: TrendingUp,
        title: 'Future Loan Readiness',
        description: 'Get your credit profile in shape for future loans, cards, or mortgages.',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Credit Report Review',
        description: 'Free consultation and credit report review',
      },
      {
        step: '02',
        title: 'Dispute Erroneous Entries',
        description: 'We identify and formally dispute any errors or outdated negative entries',
      },
      {
        step: '03',
        title: 'Rebuilding & Monitoring',
        description: 'Ongoing guidance to rebuild and maintain a healthy credit score',
      },
    ],
  },
};

export const SERVICES_LIST = Object.values(SERVICES_DATA);
