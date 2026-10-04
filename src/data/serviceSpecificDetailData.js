/**
 * serviceSpecificDetailData.js
 * Clean, concise, service-specific data for all 6 LegalBharosa Service Detail Pages.
 * 
 * Strictly adheres to the 10-section service-page structural foundation:
 * 1. HERO / SERVICE INTRO
 * 2. WHAT IS THIS PROBLEM? (2–3 short paragraphs: What is happening? Why does it matter?)
 * 3. WHO IS THIS FOR? (Concise, scannable list)
 * 4. HOW LEGALBHAROSA CAN HELP (3–5 concise points/cards)
 * 5. POSSIBLE RESOLUTION PATHS (Only service-specific options with short title + 1–2 sentence explanation)
 * 6. STEP-BY-STEP RESOLUTION PROCESS (Interactive stacked card deck steps)
 * 7. DOCUMENTS & INFORMATION REQUIRED (Formatted cards: DOCUMENT NAME + 1–2 sentence explanation)
 * 8. RISKS & LIMITATIONS (3–5 transparent points)
 * 9. FREE CASE ASSESSMENT CTA
 * 10. LEGAL DISCLAIMER / SCOPE
 * 
 * ZERO fake reviews, zero fake stats, zero guaranteed outcome claims.
 */

import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  Clock,
  PhoneCall,
  UserX,
  FileCheck2,
  FileSearch,
  Gavel,
  Landmark,
  DollarSign,
  TrendingUp,
  Building,
  HelpCircle,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Home,
  Gauge,
  Calculator,
  UserCheck,
  Compass
} from 'lucide-react';

export const SERVICE_SPECIFIC_DATA = {
  // =========================================================================
  // 1. HARASSMENT PROTECTION
  // =========================================================================
  'harassment-protection': {
    slug: 'harassment-protection',
    serviceTitle: 'Harassment Protection',
    tag: 'RBI Fair Practices Code',
    badgeText: 'Statutory Borrower Rights Protection',
    heroHeading: 'Harassment Protection & Recovery Agent Defense',
    heroIntro:
      'If you are experiencing aggressive recovery calls, unannounced visits, or intimidation from collection agencies, statutory protections under Reserve Bank of India (RBI) directives safeguard your fundamental dignity and privacy.',
    ctaTopic: 'Harassment Protection Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What is Recovery Agent Harassment?',
      paragraphs: [
        'Borrowers facing temporary payment delays often experience aggressive contact from third-party recovery agencies. While financial institutions have a legitimate commercial right to seek repayment, recovery agents frequently cross legal boundaries into intimidation, humiliation, and harassment.',
        'Unlawful recovery practices include calls outside permissible statutory hours (before 7:00 AM or after 7:00 PM), abusive language, unannounced visits to residential or work premises, and unauthorized contact with family, colleagues, or employers. These tactics are severe violations of the Reserve Bank of India (RBI) Master Direction on Fair Practices Code.',
        'Ignoring unlawful pressure often emboldens rogue agencies. Documenting communications, preserving call records, and initiating structured statutory escalation are essential steps to halt intimidation and restore personal peace of mind.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Borrowers receiving frequent, excessive recovery phone calls throughout the day that disrupt work and family life.',
      'Individuals whose family members, employers, or workplace colleagues are being contacted without authorization.',
      'Borrowers subjected to unannounced home visits by recovery agents outside permissible operating hours (7:00 AM to 7:00 PM).',
      'Recipients of fake legal threats or WhatsApp messages claiming imminent police arrest or property confiscation for unsecured debts.',
      'Borrowers who acknowledge their debt but demand lawful, civil, and regulated communication channels.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: FileSearch,
        title: 'Case Assessment & Conduct Audit',
        description: 'We audit incoming call logs, messages, and agent conduct against RBI Fair Practices Code directives to identify actionable violations.'
      },
      {
        icon: FileText,
        title: 'Evidence & Record Guidance',
        description: 'We guide you on recording calls, saving communications, logging agent credentials, and preserving admissible evidence.'
      },
      {
        icon: Scale,
        title: 'Grievance & Ombudsman Escalation',
        description: 'We assist in drafting formal representations to the lender’s Principal Nodal Officer (PNO) and regulatory complaints via the RBI Integrated Ombudsman Scheme (CMS).'
      },
      {
        icon: Gavel,
        title: 'Legal Professional Coordination',
        description: 'Where harassment persists or involves extortion, we coordinate with qualified independent advocates to issue formal cease-and-desist notices.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Principal Nodal Officer (PNO) Escalation',
        description: 'Filing detailed formal grievances with documented evidence through the lender’s statutory internal redressal mechanism to halt agency misconduct.'
      },
      {
        title: 'Statutory Cease-and-Desist Notice',
        description: 'An advocate-drafted formal notice served to the lender and recovery agency citing RBI circulars and demanding immediate cessation of unlawful tactics.'
      },
      {
        title: 'RBI Integrated Ombudsman Filing',
        description: 'Submitting a regulatory complaint via the RBI Complaint Management System (CMS) for deficiency in banking service and persistent recovery violations.'
      },
      {
        title: 'Formal Police Representation',
        description: 'Drafting formal complaints for law enforcement intervention where threats involve physical intimidation, extortion, or criminal trespass.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Document',
        description: 'Collect and organize evidence including call timestamps, agent contact numbers, audio recordings, and threatening messages.'
      },
      {
        step: '02',
        title: 'Assess',
        description: 'Our team examines the material to determine whether regulatory non-compliance or statutory breaches have occurred.'
      },
      {
        step: '03',
        title: 'Review',
        description: 'We review the underlying loan status, outstanding balance, and previous communications between you and the financial institution.'
      },
      {
        step: '04',
        title: 'Guidance',
        description: 'We provide immediate operational advice on managing incoming calls, setting communication boundaries, and redirecting inquiries.'
      },
      {
        step: '05',
        title: 'Escalation',
        description: 'Where appropriate, formal written representations are issued to the lender’s grievance cell, Nodal Officer, or the Banking Ombudsman.'
      },
      {
        step: '06',
        title: 'Follow-Up',
        description: 'We monitor institutional responses, ensure communication records are maintained, and coordinate further advocate action if required.'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'CALL LOGS & TIMESTAMPS',
        description: 'Screenshots of phone logs showing incoming call timings, frequency, and calling numbers outside permissible hours.'
      },
      {
        name: 'MESSAGES & SCREENSHOTS',
        description: 'Screenshots of threatening WhatsApp chats, SMS notifications, or emails from recovery representatives.'
      },
      {
        name: 'AUDIO RECORDINGS',
        description: 'Recordings of phone conversations involving abusive language, threats, or intimidation (if available).'
      },
      {
        name: 'LOAN SANCTION OR STATEMENT',
        description: 'Basic loan statement or sanction letter identifying the lending bank, NBFC, and account number.'
      },
      {
        name: 'AGENT IDENTITY DETAILS',
        description: 'Visiting cards, employee IDs, collection agency names, or vehicle numbers noted during home or office visits.'
      },
      {
        name: 'PRIOR GRIEVANCE RECORDS',
        description: 'Copies or reference numbers of any previous complaints submitted to the bank’s customer care or branch.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Legitimate Reminders Are Lawful',
        description: 'Lenders have the legal right to contact borrowers to demand repayment during permissible statutory hours (7:00 AM to 7:00 PM).'
      },
      {
        title: 'Underlying Debt Remains Payable',
        description: 'Filing a harassment complaint does not cancel, erase, or reduce the borrower’s lawful contractual repayment obligation.'
      },
      {
        title: 'Independent Regulatory Timelines',
        description: 'Institutional grievance cells and the Banking Ombudsman investigate independently according to their own statutory timelines.'
      },
      {
        title: 'Court & Police Representation Scope',
        description: 'Formal criminal complaints or High Court writ petitions require direct engagement and representation by an independent enrolled advocate.'
      }
    ]
  },

  // =========================================================================
  // 2. LOAN SETTLEMENT
  // =========================================================================
  'loan-settlement': {
    slug: 'loan-settlement',
    serviceTitle: 'Loan Settlement',
    tag: 'One-Time Settlement (OTS)',
    badgeText: 'Legally Negotiated Debt Resolution',
    heroHeading: 'One-Time Settlement (OTS) & Debt Resolution',
    heroIntro:
      'When genuine financial hardship makes servicing full loan liabilities unsustainable, a negotiated One-Time Settlement (OTS) provides a transparent, legally documented compromise to close accounts with formal waivers.',
    ctaTopic: 'Loan Settlement Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What is a One-Time Settlement (OTS)?',
      paragraphs: [
        'A One-Time Settlement (OTS) is a structured financial compromise where a lending institution agrees to accept a mutually agreed lump-sum or phased amount that is less than the total outstanding balance, formally waiving the remaining dues.',
        'Borrowers typically consider this pathway when an unforeseen life crisis — such as job loss, critical medical illness, business failure, or breadwinner demise — creates genuine, long-term inability to continue regular monthly EMI payments. Rather than remaining trapped in compounding interest, settlement provides a structured exit.',
        'Loan settlement is a discretionary commercial agreement, not an automatic statutory entitlement. Approval requires documented proof of hardship, and accounts are reported to credit bureaus as "Settled", which impacts credit history while permanently closing financial liability.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Borrowers with unsecured personal loans, credit card balances, or business overdrafts overdue by 90+ days.',
      'Individuals experiencing genuine, documented loss of livelihood, critical illness, or business closure.',
      'Borrowers trapped in minimum-due credit card cycles where payments only service finance charges and GST.',
      'Borrowers who have received pre-litigation notices and wish to resolve dues amicably outside courtroom disputes.',
      'Individuals who have arranged a lump-sum or short-installment settlement fund from family, savings, or non-core assets.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: Calculator,
        title: 'Hardship & Portfolio Assessment',
        description: 'We audit your liability portfolio, evaluate cash flow, and analyze documentary hardship evidence to calculate a realistic compromise proposal.'
      },
      {
        icon: FileSpreadsheet,
        title: 'Compromise Proposal Documentation',
        description: 'We prepare structured, professional hardship representations adhering to standard institutional compromise formats for submission to lenders.'
      },
      {
        icon: Scale,
        title: 'Lender Negotiation Support',
        description: 'Our experienced team interfaces with bank and NBFC stressed-asset divisions, presenting structured compromise cases backed by verifiable facts.'
      },
      {
        icon: FileCheck2,
        title: 'Settlement Document Verification',
        description: 'We examine the formal Settlement Letter issued by the lender to verify payment schedules, waiver clauses, and closure commitments before you pay.'
      },
      {
        icon: ShieldCheck,
        title: 'Closure & NDC Tracking',
        description: 'We assist you in tracking the post-payment release of the official No Dues Certificate (NDC) and verifying subsequent credit bureau status reporting.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'One-Time Settlement (OTS)',
        description: 'Full and final account closure via a single lump-sum payment negotiated against accumulated principal and interest.'
      },
      {
        title: 'Structured Tranche Settlement',
        description: 'Negotiating an agreed compromise amount paid across 2 to 4 structured monthly installments under a binding written agreement.'
      },
      {
        title: 'National Lok Adalat Settlement',
        description: 'Reaching a formal compromise settlement before the District Legal Services Authority (DLSA) Lok Adalat panel, carrying the finality of a civil court decree.'
      },
      {
        title: 'Hardship Penalty Waiver & Restructuring',
        description: 'Requesting the waiver of compounding penal interest and late fees while continuing principal repayment over an extended tenure.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Evaluate',
        description: 'Examine loan accounts, overdue tenure, total outstanding balances, and verifiable hardship documentation.'
      },
      {
        step: '02',
        title: 'Audit',
        description: 'Verify accumulated penal charges, interest calculations, and payment histories to determine a realistic settlement baseline.'
      },
      {
        step: '03',
        title: 'Proposal',
        description: 'Draft a formal, structured hardship representation outlining your inability to service the full debt with supporting evidence.'
      },
      {
        step: '04',
        title: 'Negotiation',
        description: 'Engage with the lender’s authorized settlement officers to discuss viable lump-sum or structured installment terms.'
      },
      {
        step: '05',
        title: 'Letter Review',
        description: 'Thoroughly review the official written Settlement Letter issued by the lender before any payment is transferred.'
      },
      {
        step: '06',
        title: 'Closure',
        description: 'Ensure settlement funds are remitted directly to the lender and secure the authentic No Dues Certificate (NDC).'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'LOAN STATEMENT',
        description: 'Latest statement showing outstanding principal, accrued interest, repayment history, and current account status.'
      },
      {
        name: 'PROOF OF FINANCIAL HARDSHIP',
        description: 'Job termination letter, salary reduction slip, medical records, or business financial statements proving income distress.'
      },
      {
        name: 'BANK STATEMENTS',
        description: 'Last 6 months’ bank statements showing current cash flow and actual financial capacity.'
      },
      {
        name: 'KYC DOCUMENTS',
        description: 'Self-attested copies of PAN card and Aadhaar card required for institutional identity verification.'
      },
      {
        name: 'DEMAND NOTICES & CORRESPONDENCE',
        description: 'Copies of any recent demand letters, legal notices, or settlement offers received from the lender.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Lender Approval is Discretionary',
        description: 'Settlements require approval by the lender’s internal compromise committee; no institution is legally mandated to accept a specific discount.'
      },
      {
        title: 'Credit Bureau Remark',
        description: 'Settled accounts are reported to credit bureaus as "Settled" or "Post-Write-Off", which reflects on credit history and future borrowing eligibility.'
      },
      {
        title: 'Direct Lender Remittance',
        description: 'All settlement funds must be paid directly into the lender’s designated bank account; LegalBharosa never collects debt settlement monies.'
      },
      {
        title: 'Unsecured Loans Scope',
        description: 'OTS mechanisms apply primarily to unsecured debts; secured property-backed loans involve statutory SARFAESI foreclosure provisions.'
      }
    ]
  },

  // =========================================================================
  // 3. LEGAL NOTICE REVIEW
  // =========================================================================
  'legal-notice-review': {
    slug: 'legal-notice-review',
    serviceTitle: 'Legal Notice Review',
    tag: 'Advocate Defense',
    badgeText: 'High Court & District Advocate Panel',
    heroHeading: 'Legal Notice & Summons Review by Advocates',
    heroIntro:
      'Have you received a legal notice, summons, or court-related communication and are unsure what it means or what to do next? Independent qualified advocates review the document, clarify your legal position, and draft timely defense replies.',
    ctaTopic: 'Legal Notice Review Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What is a Legal Notice?',
      paragraphs: [
        'A legal notice is a formal statutory communication issued by an advocate on behalf of a lender, creditor, or financial institution. It formally communicates the sender’s intention to initiate legal proceedings and gives the recipient a strict statutory deadline (typically 7 to 15 days) to respond.',
        'In debt-related matters, notices typically arise under Section 138 of the Negotiable Instruments Act (cheque bounce), Section 25 of the Payment and Settlement Systems Act (NACH mandate bounce), arbitration clauses, or civil recovery provisions. Notices often contain calculation errors, inflated penal claims, or jurisdictional defects.',
        'Ignoring a legal notice is among the costliest mistakes a borrower can make. Failing to respond forfeits critical procedural defenses and can result in ex-parte court orders or arrest warrants. An advocate-drafted formal reply sets your factual defense on the official record from day one.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Borrowers who have received a statutory legal notice under Section 138 of the Negotiable Instruments Act.',
      'Individuals served with Section 25 notices for NACH / ECS electronic mandate dishonor.',
      'Recipients of arbitration notices, unilateral arbitrator appointment letters, or conciliation summons.',
      'Borrowers served with civil recovery suits or pre-litigation notices from Lok Adalats or tribunals.',
      'Anyone seeking an objective review to determine whether a document is a genuine legal notice or an agency scare tactic.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: FileSearch,
        title: 'Statutory Notice Scrutiny',
        description: 'We examine the notice to verify the statutory section cited, verify delivery tracking dates, and identify the exact reply deadline.'
      },
      {
        icon: Scale,
        title: 'Claim & Account Audit',
        description: 'We cross-reference claimed amounts against your loan agreements, actual bank debit records, and statements to identify discrepancies or overcharges.'
      },
      {
        icon: Gavel,
        title: 'Advocate Coordination',
        description: 'We connect you with qualified independent advocates who evaluate legal merits, jurisdictional validity, and available procedural defenses.'
      },
      {
        icon: FileText,
        title: 'Tailored Legal Reply Drafting',
        description: 'Advocates draft a robust, fact-based statutory legal reply on official advocate letterhead rebutting false assertions and establishing your defense.'
      },
      {
        icon: Landmark,
        title: 'Pre-Litigation Settlement Support',
        description: 'Where appropriate, we leverage the reply to open pre-litigation dialogue with the lender or participate in National Lok Adalat proceedings.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Formal Advocate Legal Reply',
        description: 'A structured reply on advocate letterhead rebutting inaccurate allegations, challenging calculations, and setting factual defenses on record.'
      },
      {
        title: 'Pre-Litigation Settlement Request',
        description: 'Responding to the notice while formally requesting the lender to refer the matter to the bank’s compromise committee or National Lok Adalat.'
      },
      {
        title: 'Arbitration Objection & Challenge',
        description: 'Challenging unilateral arbitrator appointments, jurisdictional defects, or biased venues under the Arbitration and Conciliation Act, 1996.'
      },
      {
        title: 'Court Appearance & Defense Coordination',
        description: 'Where a Section 138 complaint has already been filed in court, coordinating advocate representation for appearance, bail, and trial defense.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Notice Intake',
        description: 'Examine the complete notice document, verify speed post tracking delivery dates, and calculate statutory limitation deadlines.'
      },
      {
        step: '02',
        title: 'Audit',
        description: 'Review claimed amounts, calculate penal charges, and compare notice claims with actual loan account ledgers.'
      },
      {
        step: '03',
        title: 'Advocate Assignment',
        description: 'The matter is assigned to a qualified independent advocate experienced in banking litigation and statutory defense.'
      },
      {
        step: '04',
        title: 'Defense Formulation',
        description: 'The advocate prepares a point-by-point factual and legal defense addressing specific statutory provisions cited.'
      },
      {
        step: '05',
        title: 'Reply Dispatch',
        description: 'The formal legal reply is issued on advocate letterhead and dispatched via Registered/Speed Post with proof of delivery.'
      },
      {
        step: '06',
        title: 'Monitoring',
        description: 'We track delivery confirmation and assist in evaluating subsequent lender correspondence or court proceedings.'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'LEGAL NOTICE',
        description: 'Complete copy of the legal notice including all pages, schedules, annexures, and advocate details.'
      },
      {
        name: 'POSTAL ENVELOPE',
        description: 'The original postal envelope showing the speed post tracking number and date of delivery.'
      },
      {
        name: 'LOAN SANCTION OR AGREEMENT',
        description: 'Original loan sanction letter or loan agreement containing governing terms and dispute clauses.'
      },
      {
        name: 'BANK STATEMENT',
        description: 'Bank statement reflecting the dishonored cheque or disputed NACH / ECS electronic debit attempt.'
      },
      {
        name: 'PAYMENT RECEIPTS',
        description: 'Receipts or account ledger entries confirming all past repayments made towards the loan account.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Strict Limitation Deadlines',
        description: 'Statutory replies must be dispatched within prescribed timeframes (typically 15 days); delay may forfeit important defenses.'
      },
      {
        title: 'Judicial Discretion',
        description: 'Courts and tribunals make independent determinations; issuing a reply sets your defense on record but does not guarantee immunity from filing.'
      },
      {
        title: 'Factual Accuracy Essential',
        description: 'An advocate’s reply relies strictly on truthful, verifiable facts provided by the borrower; false claims undermine courtroom defense.'
      },
      {
        title: 'Enrolled Advocate Engagement Scope',
        description: 'Formal courtroom appearances, bail applications, and judicial filings require direct representation by an enrolled advocate.'
      }
    ]
  },

  // =========================================================================
  // 4. DEBT MANAGEMENT
  // =========================================================================
  'debt-management': {
    slug: 'debt-management',
    serviceTitle: 'Debt Management',
    tag: 'Restructuring & Consolidation',
    badgeText: 'Stress-Free Financial Restructuring',
    heroHeading: 'Structured Debt Management & EMI Restructuring',
    heroIntro:
      'Struggling with multiple loan EMIs, credit cards, and rising interest burdens? A structured Debt Management Plan aligns your liabilities with real disposable income through transparent budgeting, creditor communication, and restructuring.',
    ctaTopic: 'Debt Management Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What is Debt and EMI Stress?',
      paragraphs: [
        'Debt stress happens when multiple loan and credit card obligations consume more than 50% to 70% of household income. Juggling staggered payment dates across multiple lenders creates financial chaos, missed payments, bounce fees, and high-interest debt traps.',
        'When funds fall short, borrowers often make minimum card payments or take new high-cost credit to service existing EMIs. Compounding interest rates (often 36% to 48% annually on credit cards) ensure that despite regular payments, the total outstanding balance continues to swell.',
        'A Debt Management Plan (DMP) is an organized, non-adversarial financial roadmap. It restructures and aligns repayments based on realistic household cash flow, helping borrowers escape the spiral through steady, transparent debt reduction without panic.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Salaried individuals or business promoters whose monthly debt obligations exceed 50% of net monthly income.',
      'Borrowers juggling 3 or more unsecured personal loans, credit cards, and instant app credit lines.',
      'Individuals trapped in credit card minimum-due cycles where principal balances never reduce.',
      'Borrowers who have started defaulting on EMIs or relying on fresh borrowing to service existing debts.',
      'Anyone seeking a disciplined, non-litigious roadmap to become debt-free over 24 to 60 months.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: Calculator,
        title: 'Comprehensive Financial Audit',
        description: 'We audit your complete liability portfolio, interest rates, and household cash flow to calculate a genuine, single affordable monthly repayment capacity.'
      },
      {
        icon: FileSpreadsheet,
        title: 'Debt Mapping & Prioritization',
        description: 'We categorize your debts by interest cost, legal risk, and creditor type, establishing a structured hierarchy for sustainable repayment.'
      },
      {
        icon: Scale,
        title: 'Restructuring Proposal Support',
        description: 'We help prepare formal restructuring proposals under RBI prudential guidelines, requesting tenure extensions, interest reductions, or card-to-loan conversions.'
      },
      {
        icon: PhoneCall,
        title: 'Centralized Communication Support',
        description: 'Our paralegal team assists in routing and managing creditor correspondence, significantly reducing daily operational harassment and anxiety.'
      },
      {
        icon: TrendingUp,
        title: 'Long-Term Financial Rehabilitation',
        description: 'We provide structured budgeting guidance, cash flow allocation frameworks, and financial education to help you achieve lasting financial stability.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Debt Management Plan (DMP)',
        description: 'Consolidating multiple repayment obligations into one structured monthly allocation distributed equitably across creditors based on disposable cash flow.'
      },
      {
        title: 'Loan Restructuring & Tenure Extension',
        description: 'Negotiating with lenders under RBI prudential frameworks to extend loan tenures, thereby reducing monthly EMI burdens.'
      },
      {
        title: 'Credit Card Balance to Term Loan Conversion',
        description: 'Converting revolving card dues (accruing 36%-48% APR) into fixed personal term loans at substantially lower interest rates.'
      },
      {
        title: 'Selective Phased Settlement',
        description: 'Continuing regular restructured payments on critical loans while selectively negotiating settlements on unserviceable debts.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Financial Audit',
        description: 'Compile and analyze all active loans, credit cards, interest rates, minimum dues, and total monthly repayment obligations.'
      },
      {
        step: '02',
        title: 'Budget Mapping',
        description: 'Calculate net income, deduct non-negotiable living expenses, and determine realistic disposable surplus for debt servicing.'
      },
      {
        step: '03',
        title: 'Plan Formulation',
        description: 'Create a prioritized repayment roadmap with projected timelines for complete debt clearance.'
      },
      {
        step: '04',
        title: 'Creditor Engagement',
        description: 'Submit formal representations to lenders requesting restructuring, tenure extensions, or interest rate concessions.'
      },
      {
        step: '05',
        title: 'Plan Execution',
        description: 'Begin disciplined, structured repayments according to the agreed plan, directing funds into designated lender accounts.'
      },
      {
        step: '06',
        title: 'Periodic Review',
        description: 'Review progress every 3 to 6 months, adjusting payment allocations as income grows or individual debts are closed.'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'CREDIT BUREAU REPORT',
        description: 'Recent credit report (CIBIL or Experian) listing all active credit accounts, balances, and payment histories.'
      },
      {
        name: 'LOAN & CARD STATEMENTS',
        description: 'Latest statements for each active personal loan, credit card, and credit facility showing outstanding balances and interest rates.'
      },
      {
        name: 'INCOME PROOF',
        description: 'Last 3 months’ salary slips or 6 months’ business bank statements verifying net monthly income.'
      },
      {
        name: 'HOUSEHOLD EXPENSE SUMMARY',
        description: 'Summary of mandatory household living costs including rent, utilities, food, and dependent care.'
      },
      {
        name: 'DEMAND NOTICES & REMINDERS',
        description: 'Copies of any recent payment reminders, default notices, or restructuring communications received from lenders.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Lender Discretion on Terms',
        description: 'Restructuring and interest rate concessions depend on each lender’s internal credit policy; approval is not guaranteed.'
      },
      {
        title: 'Requires Financial Discipline',
        description: 'A debt management plan requires consistent, uninterrupted monthly payments according to the agreed schedule.'
      },
      {
        title: 'Temporary Credit Restriction',
        description: 'Restructuring or debt management programs may be noted on credit records, temporarily restricting new credit approvals.'
      },
      {
        title: 'Direct Lender Remittance',
        description: 'All loan payments must be made directly to the respective lending institutions; LegalBharosa does not collect debt servicing funds.'
      }
    ]
  },

  // =========================================================================
  // 5. NPA & SECURED LOANS
  // =========================================================================
  'npa-secured-loans': {
    slug: 'npa-secured-loans',
    serviceTitle: 'NPA & Secured Loans',
    tag: 'SARFAESI & DRT Defense',
    badgeText: 'Property & Collateral Protection',
    heroHeading: 'NPA Resolution & SARFAESI / DRT Defense',
    heroIntro:
      'When secured loans default, banks initiate formidable recovery under the SARFAESI Act, threatening property repossession and public auction. Independent banking advocates provide structured legal defense before the Debt Recovery Tribunal (DRT).',
    ctaTopic: 'NPA & Secured Loans Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What is an NPA and Secured Loan Risk?',
      paragraphs: [
        'Under Reserve Bank of India prudential norms, when a borrower fails to pay interest or principal installments for 90 consecutive days, the loan account is classified as a Non-Performing Asset (NPA).',
        'For secured borrowings — such as home loans, loans against property (LAP), and commercial mortgages — NPA classification triggers the SARFAESI Act, 2002. This allows banks and financial institutions to enforce security interests and seize mortgaged properties without prior civil court approval.',
        'Lenders issue a 60-day demand notice under Section 13(2). If unaddressed, they proceed to Section 13(4) symbolic possession, apply to the District Magistrate under Section 14 for physical eviction, and schedule public e-auctions. Timely statutory objections and representation before the Debt Recovery Tribunal (DRT) are critical to protecting your property.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Homeowners, business promoters, and property owners facing SARFAESI Section 13(2), 13(4), or Section 14 notices.',
      'Borrowers whose residential or commercial mortgaged property is scheduled for imminent public bank e-auction.',
      'Enterprises facing Debt Recovery Tribunal (DRT) Original Applications (OA) or Securitisation Applications (SA).',
      'Borrowers seeking commercial One-Time Settlement (OTS) or account regularization for stressed property-backed loans.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: FileSearch,
        title: 'Statutory Procedure Audit',
        description: 'We examine all SARFAESI notices, account statements, and publication documents to identify procedural errors, improper NPA classifications, and valuation flaws.'
      },
      {
        icon: FileText,
        title: 'Section 13(3A) Objection Drafting',
        description: 'We coordinate with advocates to prepare formal legal objections under Section 13(3A) within the mandatory 60-day window, which the bank is legally required to answer.'
      },
      {
        icon: Gavel,
        title: 'DRT Securitisation Application (SA)',
        description: 'Independent banking advocates draft and file Securitisation Applications under Section 17 of SARFAESI before the competent Debt Recovery Tribunal to seek stays on auctions.'
      },
      {
        icon: Landmark,
        title: 'Section 14 Magistrate Defense',
        description: 'Advocate representation before the Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) regarding physical possession applications.'
      },
      {
        icon: Scale,
        title: 'Commercial Compromise & OTS Coordination',
        description: 'Assisting promoters in presenting structured commercial compromise (OTS) proposals to the bank’s high-power settlement committee prior to auction.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Sec 13(3A) Statutory Objection',
        description: 'Submitting a comprehensive legal objection within 60 days of the 13(2) notice; the lender is statutorily obligated to respond within 15 days.'
      },
      {
        title: 'Securitisation Application (SA) before DRT',
        description: 'Filing a formal application under Section 17 of SARFAESI challenging the lender’s measures and petitioning for stay orders against auction.'
      },
      {
        title: 'Commercial Compromise / OTS',
        description: 'Negotiating a one-time settlement with the bank’s stressed asset vertical based on real collateral market value and forced liquidation value.'
      },
      {
        title: 'Account Regularization & Restructuring',
        description: 'Clearing the genuine overdue interest and principal to restore the account from NPA to standard asset status under RBI prudential guidelines.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Notice Intake',
        description: 'Examine SARFAESI notices, identify the exact statutory stage (Section 13(2), 13(4), or Section 14), and verify statutory timelines.'
      },
      {
        step: '02',
        title: 'Audit',
        description: 'Audit NPA classification dates, interest compounding, and security description accuracy for procedural non-compliance.'
      },
      {
        step: '03',
        title: 'Section 13(3A) Reply',
        description: 'Draft and serve formal statutory objections within 60 days, challenging erroneous calculations and improper procedures.'
      },
      {
        step: '04',
        title: 'DRT Defense',
        description: 'Prepare and file a Securitisation Application under Section 17 before the competent DRT to challenge possession and auction.'
      },
      {
        step: '05',
        title: 'OTS Exploration',
        description: 'Simultaneously explore structured commercial compromise proposals with the bank’s stressed asset management vertical.'
      },
      {
        step: '06',
        title: 'Resolution',
        description: 'Execute approved settlement terms, ensure release of original title deeds, and obtain complete satisfaction of charge.'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'SARFAESI STATUTORY NOTICES',
        description: 'Complete copies of Section 13(2) demand notice, Section 13(4) possession notice, or Section 14 magistrate notices.'
      },
      {
        name: 'AUCTION PUBLICATION',
        description: 'Newspaper clipping or formal sale notice showing property description, reserve price, and scheduled auction date.'
      },
      {
        name: 'LOAN & MORTGAGE DOCUMENTS',
        description: 'Original loan sanction letter, registered mortgage deed, and complete statement of account from inception.'
      },
      {
        name: 'PROPERTY TITLE & VALUATION',
        description: 'Property title deeds, recent approved valuation reports, or municipal tax receipts establishing market value.'
      },
      {
        name: 'REPRESENTATION HISTORY',
        description: 'Copies of any past objection letters, restructuring requests, or payment receipts submitted to the bank.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Strict Limitation Periods',
        description: 'Objections under Section 13(3A) must be submitted within 60 days, and DRT applications under Section 17 within 45 days of measures.'
      },
      {
        title: 'DRT Judicial Discretion',
        description: 'Interim stay orders, conditional pre-deposits, and auction relief depend entirely on the judicial discretion of the presiding tribunal.'
      },
      {
        title: 'Agricultural Land Exemption',
        description: 'Agricultural land is statutorily exempt under Section 31(i) of SARFAESI, requiring distinct civil or revenue court defense.'
      },
      {
        title: 'Advocate Representation Scope',
        description: 'Filing pleadings and arguing before the DRT, CMM, or High Court requires direct representation by an enrolled advocate.'
      }
    ]
  },

  // =========================================================================
  // 6. CREDIT RECOVERY
  // =========================================================================
  'credit-recovery': {
    slug: 'credit-recovery',
    serviceTitle: 'Credit Recovery',
    tag: 'Credit Score Repair & Cleanse',
    badgeText: 'Official Credit Bureau Dispute & Record Cleanse',
    heroHeading: 'Credit Report Review & Dispute Guidance',
    heroIntro:
      'Suffering from inaccurate credit reporting, outdated default flags, or missing No Dues Certificates that damage your credit score? We conduct line-by-line credit audits and guide you through lawful bureau and lender dispute processes.',
    ctaTopic: 'Credit Recovery Consultation',

    // 2. WHAT IS THIS PROBLEM?
    problemExplanation: {
      headline: 'What are Credit Report Issues?',
      paragraphs: [
        'Your credit score (compiled by licensed credit bureaus including CIBIL, Experian, Equifax, and CRIF High Mark) represents your financial reputation in the Indian banking system. A score below 700–750 can prevent you from obtaining housing loans, vehicle finance, business credit, or personal credit cards.',
        'While authentic past defaults naturally pull down scores, millions of borrowers suffer from clerical errors, duplicate loan entries, and bureaucratic delays. Common issues include closed loans still showing as "Active", paid-off debts erroneously labeled "Written Off", mismatched PAN numbers, and failure by lenders to transmit accurate No Dues Certificates (NDCs).',
        'Credit recovery is the systematic, lawful process of auditing your credit records, raising statutory disputes to remove incorrect data, ensuring lenders submit accurate closure data, and following structured financial habits to rebuild your score legitimately over time.'
      ]
    },

    // 3. WHO IS THIS FOR?
    whoIsThisFor: [
      'Borrowers who have cleared debts or completed settlements but still show active default remarks on their bureau reports.',
      'Individuals denied housing loans, vehicle loans, or credit cards due to outdated or erroneous CIBIL entries.',
      'Victims of identity mismatches, duplicate PAN entries, or unauthorized credit enquiries.',
      'Anyone who wants an objective, realistic roadmap to rebuild their credit reputation responsibly over time.'
    ],

    // 4. HOW LEGALBHAROSA CAN HELP
    howWeHelp: [
      {
        icon: FileSearch,
        title: 'Multi-Bureau Report Audit',
        description: 'We conduct a line-by-line review across all 4 licensed Indian credit bureaus (CIBIL, Experian, Equifax, CRIF) to identify clerical errors, outdated records, and anomalies.'
      },
      {
        icon: FileCheck2,
        title: 'NDC Verification & Procurement',
        description: 'We assist in obtaining missing official No Dues Certificates (NDCs) from past lenders and ensuring proper account closure documentation is in place.'
      },
      {
        icon: Scale,
        title: 'Statutory Bureau Dispute Guidance',
        description: 'We guide you through filing formal online and written disputes under the Credit Information Companies (Regulation) Act, 2005 (CICRA).'
      },
      {
        icon: Building,
        title: 'Lender Compliance Escalation',
        description: 'Where banks fail to upload corrected closure records within 30 days, we assist in escalating grievances to the Principal Nodal Officer and Banking Ombudsman.'
      },
      {
        icon: Gauge,
        title: 'Responsible Rebuilding Roadmap',
        description: 'We provide structured educational guidance on credit utilization ratios, secured credit card strategies, and repayment habits to rebuild scores over 6 to 18 months.'
      }
    ],

    // 5. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Clerical Error & Bureau Dispute',
        description: 'Formally disputing factual errors such as wrong name, mismatched PAN, fraudulent accounts, or wrong payment status directly with credit bureaus.'
      },
      {
        title: 'Lender NDC Upload Rectification',
        description: 'Directing the lender’s credit bureau operations team to upload official No Dues Certificates and change status from "Default" to "Closed / Settled".'
      },
      {
        title: 'Goodwill Correction Representation',
        description: 'Submitting a formal petition to the lender explaining an isolated 30-day delay caused by technical or medical hardship, requesting removal of the late remark.'
      },
      {
        title: 'Secured Rebuilding Trajectory',
        description: 'Adopting a disciplined credit-building regimen using low-limit fixed-deposit-backed credit cards with low credit utilization and 100% on-time payments.'
      }
    ],

    // 6. STEP-BY-STEP RESOLUTION PROCESS
    processSteps: [
      {
        step: '01',
        title: 'Multi-Bureau Audit',
        description: 'Download and analyze complete credit reports across CIBIL, Experian, Equifax, and CRIF High Mark.'
      },
      {
        step: '02',
        title: 'Error Identification',
        description: 'Identify discrepancies, incorrect DPD tags, settled accounts still marked open, and unauthorized inquiries.'
      },
      {
        step: '03',
        title: 'NDC Gathering',
        description: 'Collect and verify No Dues Certificates, closure receipts, and settlement letters from respective lending institutions.'
      },
      {
        step: '04',
        title: 'Dispute Filing',
        description: 'Submit formal statutory disputes via credit bureau portals and lodge rectification requests with lender nodal officers.'
      },
      {
        step: '05',
        title: 'Lender Follow-Up',
        description: 'Track the 30-day statutory resolution timeline, escalating to the Banking Ombudsman if corrections are ignored.'
      },
      {
        step: '06',
        title: 'Score Rebuilding',
        description: 'Implement a structured credit rehabilitation plan focusing on low utilization, timely payments, and credit mix diversification.'
      }
    ],

    // 7. DOCUMENTS & INFORMATION REQUIRED
    documentsRequired: [
      {
        name: 'CREDIT BUREAU REPORTS',
        description: 'Official full credit reports (CIBIL, Experian, Equifax, or CRIF) downloaded within the last 30 days.'
      },
      {
        name: 'NO DUES CERTIFICATE (NDC)',
        description: 'Official closure letters, NDC, or settlement completion letters issued by the respective lenders.'
      },
      {
        name: 'PAYMENT PROOF',
        description: 'Bank statements or transaction receipts confirming payment of final settlement or closure amounts.'
      },
      {
        name: 'KYC DOCUMENTS',
        description: 'Self-attested PAN card and Aadhaar card copies required for bureau identity verification.'
      },
      {
        name: 'DISPUTE REFERENCES',
        description: 'Acknowledgement numbers or email threads of any previous dispute tickets raised with banks or credit bureaus.'
      }
    ],

    // 8. RISKS & LIMITATIONS
    risksAndLimitations: [
      {
        title: 'Legitimate Default History Cannot Be Fraudulently Erased',
        description: 'Lawful, accurate default history cannot be illegally removed; only erroneous, outdated, or unverified records can be corrected.'
      },
      {
        title: 'Lender & Bureau Discretion',
        description: 'Credit bureaus update records based on data certified and transmitted by the reporting lender within statutory 30-day cycles.'
      },
      {
        title: 'Rebuilding Takes Consistent Time',
        description: 'Legitimate credit score recovery is a progressive financial discipline requiring 6 to 18 months of consistent on-time repayment behavior.'
      },
      {
        title: 'No Overnight Magic Fixes',
        description: 'LegalBharosa strictly complies with RBI and CICRA regulations and does not offer deceptive "instant score-boosting" services.'
      }
    ]
  }
};
