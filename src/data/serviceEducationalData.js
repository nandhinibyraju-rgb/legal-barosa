/**
 * serviceEducationalData.js
 * Comprehensive educational content for all 6 LegalBharosa services.
 * Structured strictly according to the required 9-step educational architecture:
 * 1. WHAT IS THIS PROBLEM?
 * 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
 * 3. HOW LEGALBHAROSA CAN HELP
 * 4. POSSIBLE RESOLUTION PATHS
 * 5. THE LEGALBHAROSA RESOLUTION JOURNEY (9-Step General Process)
 * 6. WHO IS THIS FOR?
 * 7. DOCUMENTS / INFORMATION YOU MAY NEED
 * 8. WHAT LEGALBHAROSA CAN AND CANNOT DO
 * 9. FINAL CASE REVIEW CTA
 * 
 * Fact-based, educational, free of unverified claims or fake guarantees.
 */

// Global 9-Step Customer Resolution Journey
export const GLOBAL_RESOLUTION_JOURNEY = [
  {
    step: '01',
    title: 'INTAKE',
    description: 'Customer shares the problem, basic loan/notice details and relevant documents for initial confidential review.',
  },
  {
    step: '02',
    title: 'CASE CLASSIFICATION',
    description: 'The situation is categorized, such as EMI stress, harassment, legal notice, secured NPA or business distress.',
  },
  {
    step: '03',
    title: 'RISK ASSESSMENT',
    description: 'The situation is assessed based on the level of financial/legal pressure and whether active proceedings or possession/auction issues are involved.',
  },
  {
    step: '04',
    title: 'RESOLUTION PLAN',
    description: 'Potential pathways are identified based on the circumstances, such as DMP, restructuring, settlement/OTS, negotiation or legal support.',
  },
  {
    step: '05',
    title: 'PROFESSIONAL ASSIGNMENT',
    description: 'The appropriate debt counsellor, legal professional or case manager is involved according to the requirements of the case.',
  },
  {
    step: '06',
    title: 'LENDER ENGAGEMENT',
    description: 'Where applicable, communication, proposals, documentation and negotiation with the lender are handled.',
  },
  {
    step: '07',
    title: 'LEGAL ESCALATION',
    description: 'Where formal legal action is required, the appropriate qualified legal professional handles the relevant legal stage.',
  },
  {
    step: '08',
    title: 'CLOSURE',
    description: 'Relevant settlement/repayment evidence, closure documentation and follow-up actions are addressed.',
  },
  {
    step: '09',
    title: 'RECOVERY',
    description: 'Provide appropriate guidance around budgeting, credit education and avoiding future debt problems.',
  },
];

// Universal Transparency Guardrails (What LegalBharosa Can and Cannot Do)
export const UNIVERSAL_CAN_AND_CANNOT = {
  canHelpWith: [
    'Understanding the legal and financial reality of your situation in plain language',
    'Objective case assessment and risk categorization',
    'Organizing and verifying loan records, notices, and communications',
    'Unbiased guidance on available statutory and commercial resolution pathways',
    'Communication and negotiation support with lenders where applicable',
    'Coordination with qualified advocates and legal professionals where proceedings require it',
  ],
  cannotGuarantee: [
    'Lender acceptance of a settlement proposal or specific discount percentage',
    'A specific pre-determined settlement or waiver amount',
    'A specific court verdict or guaranteed legal outcome',
    'Automatic cancellation or deletion of lawful debt obligations',
    'Guaranteed instantaneous credit score repairs or artificial bureau alterations',
  ],
};

export const SERVICE_EDUCATIONAL_DATA = {
  // =========================================================================
  // 1. HARASSMENT PROTECTION
  // =========================================================================
  'harassment-protection': {
    slug: 'harassment-protection',
    serviceTitle: 'Harassment Protection',
    
    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What is Recovery Agent Harassment?',
      summary: 'When debt recovery crosses statutory legal boundaries into intimidation, humiliation, and unauthorized intrusion.',
      paragraphs: [
        'Borrowers who face temporary payment delays often experience aggressive contact from third-party recovery agencies. While financial institutions have a legitimate right to recover outstanding dues through lawful channels, recovery agents frequently exceed their legal remit.',
        'Unlawful recovery practices include calling repeatedly outside permissible hours (before 7:00 AM or after 7:00 PM), using abusive or threatening language, making unannounced visits to residential or work premises, and unlawfully contacting friends, colleagues, or family members. These tactics are severe violations of the Reserve Bank of India (RBI) Master Direction on Fair Practices Code.',
        'Documenting communications, maintaining call records, and understanding available statutory remedies — such as formal cease-and-desist notices and the RBI Integrated Ombudsman Scheme — are critical steps in halting unlawful pressure and restoring personal dignity.',
      ],
      keyHighlights: [
        'RBI Fair Practices Code explicitly bars abusive language, threats, and harassment.',
        'Calls are legally restricted strictly to the 7:00 AM – 7:00 PM daily window.',
        'Contacting employers, neighbors, or third parties without consent is an actionable regulatory breach.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Know Your Statutory Rights',
        description: 'Understand that taking a loan does not waive your fundamental right to dignity and privacy. Recovery agents have zero legal authority to use coercion, threats, or physical intrusion.',
      },
      {
        phase: 'DOCUMENT',
        title: 'Preserve All Evidence',
        description: 'Record phone conversations, save threatening SMS/WhatsApp messages, screenshot call logs showing timing, and note identity details or vehicle numbers of visiting agents.',
      },
      {
        phase: 'ASSESS',
        title: 'Categorize the Violation',
        description: 'Check whether the conduct breaches RBI timing rules (outside 7am-7pm), involves workplace/relative contact, or constitutes criminal intimidation under applicable laws.',
      },
      {
        phase: 'ACT',
        title: 'Initiate Lawful Escalation',
        description: 'Direct the lender in writing to channel all future communication through authorized representation, and file formal complaints with the Principal Nodal Officer and Banking Ombudsman.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa provides structured paralegal intervention and advocate coordination to protect borrowers against unlawful recovery practices.',
      points: [
        {
          title: 'Case Assessment & Violation Audit',
          description: 'We review call logs, recordings, and message histories to evaluate statutory Fair Practices Code non-compliance.',
        },
        {
          title: 'Communication Channel Takeover',
          description: 'We issue formal representations directing lenders and recovery agencies to route communications through proper channels, relieving direct daily pressure.',
        },
        {
          title: 'Statutory Cease-and-Desist Notice',
          description: 'Where harassment persists, qualified advocates issue formal legal notices under RBI directions and applicable consumer protection statutes.',
        },
        {
          title: 'Regulatory & Ombudsman Escalation',
          description: 'Guidance and drafting support for filing complaints on the RBI CMS (Complaint Management System) portal and banking ombudsman.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Direct Statutory Notice',
        badge: 'Legal Notice',
        description: 'A formal advocate-drafted cease notice citing RBI circulars and relevant judicial precedents served directly to the lender’s compliance team.',
        suitability: 'Effective when third-party recovery agents repeatedly ignore verbal requests to adhere to RBI conduct guidelines.',
      },
      {
        title: 'Principal Nodal Officer (PNO) Escalation',
        badge: 'Internal Escalation',
        description: 'Filing detailed formal grievances with the bank or NBFC’s designated internal grievance redressal mechanism and PNO with documented evidence.',
        suitability: 'Suitable for addressing agency misconduct before escalating to external regulatory authorities.',
      },
      {
        title: 'RBI Integrated Ombudsman Filing',
        badge: 'Regulatory Pathway',
        description: 'Submitting a statutory complaint through the RBI Complaint Management System (CMS) for deficiency in banking services and violation of fair recovery norms.',
        suitability: 'Applicable when the lender fails to resolve the complaint within 30 days or provides an unsatisfactory response.',
      },
      {
        title: 'Law Enforcement / Police Complaint',
        badge: 'Criminal Defense',
        description: 'Assisting in drafting formal police complaints under Sections of Bharatiya Nyaya Sanhita (formerly IPC) where physical threats, extortion, or criminal trespass occur.',
        suitability: 'Reserved strictly for severe cases involving physical assault, extortionate demands, or public defamation.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Borrowers facing excessive daily calls, intimidation, or vulgar language from recovery agencies',
        'Individuals whose employers, family members, or neighbors are being harassed regarding loan dues',
        'Borrowers receiving unauthorized home or workplace visits outside lawful operating hours',
        'Anyone being threatened with immediate arrest or police detention over civil unsecured debts',
      ],
      notSuitableFor: [
        'Individuals seeking to permanently evade legitimate, legally incurred debt obligations without repayment or settlement',
        'Borrowers facing lawful court summons or SARFAESI physical possession orders (which require courtroom/DRT legal representation)',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Call logs showing timestamps and frequency of incoming recovery calls',
      'Audio recordings of abusive or threatening conversations (if available)',
      'Screenshots of threatening WhatsApp messages, SMS, or emails',
      'Loan account number and name of the lending bank/NBFC',
      'Details of visiting agents (visiting card, agent ID, employee code, or vehicle numbers if noted)',
      'Copies of any previous written complaints sent to the lender',
    ],
  },

  // =========================================================================
  // 2. LOAN SETTLEMENT
  // =========================================================================
  'loan-settlement': {
    slug: 'loan-settlement',
    serviceTitle: 'Loan Settlement',

    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What is Loan Settlement (OTS)?',
      summary: 'A mutually agreed financial compromise allowing borrowers in genuine distress to close unsecured debt for an agreed sum.',
      paragraphs: [
        'A One-Time Settlement (OTS) or negotiated debt settlement is a structured financial resolution where a lender agrees to accept a lump-sum or phased amount that is less than the total outstanding balance, formally waiving the remaining balance.',
        'Borrowers typically consider this pathway when an unforeseen life event — such as severe illness, job loss, business failure, or breadwinner demise — creates permanent inability to continue regular monthly EMI payments. Rather than remaining trapped in compounding interest and endless default cycles, settlement provides an orderly exit.',
        'It is crucial to understand that loan settlement is never an automatic legal right; acceptance and settlement terms rest entirely upon the lender’s internal compromise policies, audit requirements, and the documented severity of the borrower’s genuine hardship. Furthermore, settlements are reported to credit bureaus as "Settled" or "Post-Write-Off", which reflects on future credit eligibility.',
      ],
      keyHighlights: [
        'Settlement is an agreement between lender and borrower, not a statutory entitlement.',
        'Lenders evaluate documented financial hardship, debt age, and recovery feasibility.',
        'Formal closure requires an authentic, written Settlement Letter and No Dues Certificate directly from the lender.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Understand the Trade-Offs',
        description: 'Recognize that settlement resolves active recovery pressure and closes the liability, but will reflect on credit bureau records as "Settled" rather than "Closed".',
      },
      {
        phase: 'DOCUMENT',
        title: 'Compile Hardship Evidence',
        description: 'Assemble verifiable proof of financial distress — medical records, termination letters, bank statements showing reduced cash flow, or business tax returns.',
      },
      {
        phase: 'ASSESS',
        title: 'Determine Liquidity Capacity',
        description: 'Calculate your realistic pool of funds for a lump-sum or 2-4 installment settlement without resorting to predatory, high-interest borrowing.',
      },
      {
        phase: 'ACT',
        title: 'Submit Formal Compromise Proposal',
        description: 'Initiate a structured hardship representation through the lender’s designated settlement vertical, backed by documentation.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa assists borrowers through structured financial analysis and professional negotiation to seek fair settlement terms.',
      points: [
        {
          title: 'Hardship & Affordability Audit',
          description: 'We analyze your total debt portfolio, income capacity, and documentary evidence to establish a realistic settlement proposal.',
        },
        {
          title: 'Lender Negotiation Support',
          description: 'Our experienced team interfaces directly with bank and NBFC settlement departments, presenting structured compromise cases.',
        },
        {
          title: 'Settlement Document Verification',
          description: 'We review the formal Settlement Letter issued by the lender to verify terms, payment deadlines, waiver clauses, and account closure conditions before you pay.',
        },
        {
          title: 'Closure & NDC Tracking',
          description: 'Post-payment assistance to ensure the lender issues an authentic No Dues Certificate (NDC) and initiates credit bureau status updates.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'One-Time Settlement (OTS)',
        badge: 'Lump-Sum',
        description: 'Full and final closure via a single lump-sum payment negotiated against accumulated principal and interest.',
        suitability: 'Best suited for borrowers who have access to emergency savings, family support, or liquidated non-essential assets.',
      },
      {
        title: 'Structured Tranche Settlement',
        badge: '2 to 4 Tranches',
        description: 'Negotiating an agreed settlement amount paid across 2 to 4 structured monthly installments under a binding agreement.',
        suitability: 'Helpful for distressed borrowers with recovering cash flow who cannot arrange the entire lump-sum in 30 days.',
      },
      {
        title: 'Waiver of Penal Charges & Restructuring',
        badge: 'Term Extension',
        description: 'Requesting the waiver of compounding penal interest, late fees, and bounce charges while continuing principal repayment over an extended tenure.',
        suitability: 'Ideal for borrowers whose income has recovered and who prefer to protect their credit score rather than accept a "Settled" status.',
      },
      {
        title: 'National Lok Adalat Settlement',
        badge: 'Judicial Lok Adalat',
        description: 'Reaching a formal compromise settlement before the District Legal Services Authority (DLSA) Lok Adalat panel, carrying the finality of a civil court decree.',
        suitability: 'Highly recommended when formal recovery suits or Section 138 notices have already been initiated by the lender.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Borrowers with unsecured personal loans, credit card balances, or business overdrafts overdue by 90+ days',
        'Individuals experiencing genuine, documented loss of livelihood, business failure, or critical illness',
        'Borrowers trapped in minimum-due cycles where monthly payments only service interest without reducing principal',
        'Borrowers who have received pre-litigation notices and wish to resolve dues amicably',
      ],
      notSuitableFor: [
        'Secured loans (home loans / LAP) where property foreclosure proceedings are active (requires specialized NPA / SARFAESI defense)',
        'Borrowers who have sufficient income and assets to comfortably service their regular monthly obligations',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Original loan sanction letters and latest account statement / foreclosure quote',
      'Proof of financial hardship (job termination letter, salary reduction slip, or medical expense records)',
      'Last 6 months’ bank statements showing actual financial position',
      'PAN card and Aadhaar card copies for KYC verification',
      'Copies of any demand letters, legal notices, or email correspondence received from the lender',
    ],
  },

  // =========================================================================
  // 3. LEGAL NOTICE REVIEW
  // =========================================================================
  'legal-notice-review': {
    slug: 'legal-notice-review',
    serviceTitle: 'Legal Notice Review',

    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What is a Legal Notice?',
      summary: 'A formal statutory communication warning of impending legal proceedings that demands immediate professional review.',
      paragraphs: [
        'A legal notice is a formal written document issued by an advocate on behalf of a lender, financial institution, or creditor. It establishes the sender’s intention to initiate legal proceedings and gives the recipient a specific statutory period (typically 7 to 15 days) to resolve the stated grievance.',
        'In debt-related matters, notices typically arise under Section 138 of the Negotiable Instruments Act (cheque bounce), Section 25 of the Payment and Settlement Systems Act (NACH / ECS mandate bounce), arbitration clauses, or Order 37 of the CPC (summary suits for recovery).',
        'Ignoring a legal notice is among the costliest mistakes a borrower can make. Failing to respond within the deadline allows the creditor to approach the court, potentially leading to ex-parte orders, issuance of non-bailable warrants, or asset attachments. A well-reasoned, advocate-drafted reply sets your defense on the legal record from day one.',
      ],
      keyHighlights: [
        'A legal notice sets a statutory deadline — ignoring it forfeits vital procedural defenses.',
        'Notices often contain calculation errors, inflated penal claims, or jurisdictional defects.',
        'An advocate-drafted formal reply preserves your factual defense for any subsequent proceedings.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Check the Notice Type & Deadline',
        description: 'Identify the exact statutory provision cited (e.g. Sec 138 NI Act, Sec 25 PSSA, Arbitration) and calculate the reply deadline from the date you received it.',
      },
      {
        phase: 'DOCUMENT',
        title: 'Preserve the Postal Envelope',
        description: 'Keep the original postal cover showing the Speed Post / Registered Post tracking number and date of delivery, as this establishes limitation periods in court.',
      },
      {
        phase: 'ASSESS',
        title: 'Audit the Claimed Amounts',
        description: 'Compare the figures claimed in the notice against your actual bank statements, loan sanction schedule, and actual payment receipts to identify discrepancies.',
      },
      {
        phase: 'ACT',
        title: 'Draft & Dispatch Formal Reply',
        description: 'Engage an advocate to draft a precise legal reply rebutting false allegations, clarifying facts, and dispatching it within the statutory response window.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa connects borrowers with qualified High Court and District Court advocates to review notices and formulate timely defense replies.',
      points: [
        {
          title: 'Rapid Statutory Deadline Assessment',
          description: 'We audit the notice within 24-48 hours to determine limitation windows, jurisdictional validity, and immediate risks.',
        },
        {
          title: 'Discrepancy & Overcharge Analysis',
          description: 'Our team examines the claim for unlawful compounding, uncredited payments, or incorrect cheque presentation procedures.',
        },
        {
          title: 'Custom Advocate-Drafted Reply',
          description: 'A qualified advocate prepares a tailored, legally robust reply denying false assertions and placing genuine hardship and counter-claims on record.',
        },
        {
          title: 'Pre-Litigation Resolution Support',
          description: 'Using the reply as leverage to open amicable settlement channels or participate in National Lok Adalat proceedings.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Formal Advocate Legal Reply',
        badge: 'Statutory Reply',
        description: 'A structured legal reply issued on advocate letterhead placing your defense on record and rebutting erroneous claims.',
        suitability: 'Mandatory for every validly served notice under Section 138, Section 25, or civil recovery provisions.',
      },
      {
        title: 'Pre-Litigation Settlement Request',
        badge: 'Negotiation',
        description: 'Simultaneously responding to the legal notice while formally requesting the lender to refer the matter to the bank’s compromise committee or Lok Adalat.',
        suitability: 'Effective when the borrower acknowledges genuine debt but disputes inflated fees and seeks an affordable settlement.',
      },
      {
        title: 'Arbitration Objection & Representation',
        badge: 'Arbitration Law',
        description: 'Challenging unilateral arbitrator appointment, lack of jurisdiction, or biased venues under the Arbitration and Conciliation Act, 1996.',
        suitability: 'Essential when NBFCs invoke unilateral arbitration without mutual consent in distant jurisdictions.',
      },
      {
        title: 'Court Defense & Bail Representation',
        badge: 'Court Proceedings',
        description: 'Where a Section 138 criminal complaint is filed in court, coordinating advocate representation for appearance, bail, and trial defense.',
        suitability: 'Applicable when formal court summons have been issued following the expiration of the notice period.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Borrowers who have received a statutory legal notice under Section 138 of the Negotiable Instruments Act',
        'Individuals served with Section 25 notices for NACH/ECS electronic mandate dishonor',
        'Recipients of arbitration notices, conciliation letters, or civil recovery summons',
        'Anyone confused about whether a received document is a genuine legal notice or an agency intimidation tactic',
      ],
      notSuitableFor: [
        'Parties already subject to final non-appealable court decrees where execution proceedings have concluded',
        'Cases requiring urgent criminal writ petitions before the Supreme Court without prior High Court representation',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Complete copy of the legal notice including all pages and annexures',
      'The postal envelope / Speed Post cover showing tracking number and delivery date',
      'Original loan agreement or sanction letter (if available)',
      'Bank statement showing the dishonored cheque or NACH debit attempt',
      'Payment receipts of any installments paid towards the loan account',
    ],
  },

  // =========================================================================
  // 4. DEBT MANAGEMENT
  // =========================================================================
  'debt-management': {
    slug: 'debt-management',
    serviceTitle: 'Debt Management',

    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What is Debt and EMI Stress?',
      summary: 'When multiple repayment commitments consume household income, triggering a dangerous compounding debt spiral.',
      paragraphs: [
        'Debt stress occurs when an individual or family’s aggregate monthly EMI obligations exceed their manageable income. Often driven by multiple credit cards, personal loans, instant app loans, and BNPL credit lines, borrowers find themselves juggling 5 to 15 different payment dates each month.',
        'When funds fall short, borrowers often make minimum card payments or take new high-cost credit to pay existing EMIs. This creates a destructive debt trap where compounding interest rates (often 36% to 48% annually on credit cards) ensure that despite regular payments, the total outstanding balance continues to swell.',
        'A Debt Management Plan (DMP) is an organized, non-adversarial financial roadmap. It restructures and aligns repayments based on realistic household cash flow, helping borrowers escape the spiral through transparent, steady debt reduction without compounding panic.',
      ],
      keyHighlights: [
        'Minimum credit card payments go almost entirely to interest, keeping borrowers indebted for decades.',
        'Managing multiple disjointed creditor dates increases bounce penalties, late fees, and operational stress.',
        'A structured plan assesses genuine disposable income to establish single-channel, sustainable repayment.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Stop Taking Fresh Debt',
        description: 'Impose an immediate freeze on borrowing from apps, credit cards, or moneylenders to service existing EMIs; stop worsening the debt ratio.',
      },
      {
        phase: 'DOCUMENT',
        title: 'Build a Complete Debt Ledger',
        description: 'Document every active loan — creditor name, current outstanding, interest rate, monthly EMI, and number of pending tenures.',
      },
      {
        phase: 'ASSESS',
        title: 'Calculate Disposable Cash Flow',
        description: 'Deduct non-negotiable living costs (rent, food, school fees, utilities) from net take-home income to calculate genuine repayment capacity.',
      },
      {
        phase: 'ACT',
        title: 'Establish a Restructured Roadmap',
        description: 'Engage with debt counsellors to consolidate communication, request interest rate reductions, and implement a structured Debt Management Plan.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa offers holistic debt counselling, financial restructuring, and creditor communication management.',
      points: [
        {
          title: 'Comprehensive Financial Diagnosis',
          description: 'We audit your complete liability portfolio and household cash flow to calculate a realistic, single monthly affordable pool.',
        },
        {
          title: 'Creditor Restructuring Proposals',
          description: 'We submit formal proposals to creditors seeking tenure extension, interest rate reduction, or conversion of card balances to term loans.',
        },
        {
          title: 'Centralized Creditor Communication',
          description: 'Our paralegal team handles correspondence, mitigating the daily anxiety of juggling dozens of aggressive collections calls.',
        },
        {
          title: 'Long-Term Financial Rehabilitation',
          description: 'Ongoing guidance on household budgeting, disciplined cash flow allocation, and avoiding future debt dependency.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Debt Management Plan (DMP)',
        badge: 'Structured Repayment',
        description: 'Consolidating multiple repayment obligations into one structured monthly allocation distributed equitably across creditors.',
        suitability: 'Best for borrowers with steady income who need relief from high interest and multiple chaotic payment dates.',
      },
      {
        title: 'Loan Restructuring & Tenure Extension',
        badge: 'Term Restructuring',
        description: 'Negotiating with lenders under RBI prudential frameworks to extend loan tenures, thereby reducing monthly EMI burdens.',
        suitability: 'Applicable for borrowers facing moderate, medium-term income reduction who want to protect their credit standing.',
      },
      {
        title: 'Credit Card Balance to Term Loan Conversion',
        badge: 'Interest Reduction',
        description: 'Converting revolving card dues (accruing 36%-48% APR) into fixed personal term loans at substantially lower interest rates.',
        suitability: 'Crucial for cardholders whose monthly payments are completely eaten up by finance charges and GST.',
      },
      {
        title: 'Selective Phased Settlement',
        badge: 'Hybrid Solution',
        description: 'Continuing regular restructured payments on critical loans while selectively negotiating settlements on irrecoverable debts.',
        suitability: 'Suitable for multi-loan portfolios where certain high-penalty debts cannot be salvaged through regular repayment.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Salaried individuals or small business owners with multiple unsecured loans and credit cards',
        'Borrowers who are spending more than 50% of their net monthly income on debt servicing',
        'Individuals who have started defaulting on EMIs or relying on new credit to pay existing creditors',
        'Anyone seeking a disciplined, non-litigious roadmap to become debt-free over 24 to 60 months',
      ],
      notSuitableFor: [
        'Borrowers with zero verifiable income or prospects of income (who may require formal insolvency assessment)',
        'Complex corporate insolvency proceedings governed under the Insolvency and Bankruptcy Code (IBC) for listed entities',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Latest credit bureau report (CIBIL / Experian) showing all active credit lines',
      'Recent loan account statements and credit card bills for each liability',
      'Last 3 months’ salary slips or 6 months’ business bank statements',
      'Summary of monthly household expenditure (rent, utilities, groceries, medical)',
      'Details of any notices or calls received from individual lenders',
    ],
  },

  // =========================================================================
  // 5. NPA & SECURED LOANS
  // =========================================================================
  'npa-secured-loans': {
    slug: 'npa-secured-loans',
    serviceTitle: 'NPA & Secured Loans',

    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What is an NPA and Secured Loan Risk?',
      summary: 'When a secured loan defaults, statutory foreclosure under the SARFAESI Act threatens property ownership and business assets.',
      paragraphs: [
        'Under Reserve Bank of India prudential norms, when a borrower fails to pay interest or principal installments for 90 consecutive days, the lending institution classifies the loan account as a Non-Performing Asset (NPA).',
        'For secured borrowings — such as home loans, loans against property (LAP), and commercial mortgages — NPA classification triggers the formidable provisions of the SARFAESI Act, 2002. This allows banks and financial institutions to enforce security interests without the prior intervention of a civil court.',
        'Lenders issue a 60-day demand notice under Section 13(2). If unaddressed, they proceed to Section 13(4) symbolic possession, apply to the District Magistrate (DM) or Chief Metropolitan Magistrate (CMM) for physical possession under Section 14, and schedule public e-auctions. Timely statutory objections and representation before the Debt Recovery Tribunal (DRT) are critical to safeguarding your asset.',
      ],
      keyHighlights: [
        'SARFAESI allows lenders to seize and auction mortgaged collateral without approaching a civil court.',
        'Section 13(2) gives the borrower an indispensable 60-day statutory window to raise objections under Section 13(3A).',
        'Procedural lapses by the lender can form valid legal grounds to stay auctions and obtain relief before the DRT.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Identify the Notice Stage',
        description: 'Verify the exact statutory section cited — whether a Section 13(2) 60-day demand notice, Section 13(4) possession notice, or Section 14 magistrate notice.',
      },
      {
        phase: 'DOCUMENT',
        title: 'Preserve Mortgage & Notice Records',
        description: 'Assemble the original loan agreement, mortgage deed, payment ledgers, and the exact physical envelope and publication copies of all statutory notices.',
      },
      {
        phase: 'ASSESS',
        title: 'Check for Statutory Lapses',
        description: 'Audit the notice for procedural violations — improper account NPA date classification, failure to detail asset descriptions, or non-compliance with RBI master circulars.',
      },
      {
        phase: 'ACT',
        title: 'File Objections & DRT Petitions',
        description: 'Submit formal statutory objections under Section 13(3A) within 60 days, and file a Securitisation Application (SA) under Section 17 before the DRT if possession is threatened.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa coordinates with specialized banking and DRT advocates to mount legal defenses against property auction and repossession.',
      points: [
        {
          title: 'SARFAESI Section 13(3A) Representation',
          description: 'Drafting formal legal objections challenging improper NPA classification, inflated calculations, and statutory non-compliance within the 60-day window.',
        },
        {
          title: 'Debt Recovery Tribunal (DRT) Defense',
          description: 'Preparing and filing Securitisation Applications (SA) under Section 17 of SARFAESI before the competent DRT to seek interim stays on auction and possession.',
        },
        {
          title: 'Section 14 Magistrate Hearing Defense',
          description: 'Advocate representation before the Chief Metropolitan Magistrate (CMM) or District Magistrate (DM) regarding physical possession orders.',
        },
        {
          title: 'Commercial Compromise & OTS Negotiation',
          description: 'Assisting in submitting structured compromise settlement (OTS) proposals directly to the bank’s high-power committee prior to auction.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Sec 13(3A) Statutory Objection',
        badge: 'Mandatory Notice Defense',
        description: 'Submitting a comprehensive legal objection within 60 days of the 13(2) notice; the lender is statutorily obligated to respond within 15 days.',
        suitability: 'Mandatory first step for any borrower served with a Section 13(2) demand notice.',
      },
      {
        title: 'Securitisation Application (SA) before DRT',
        badge: 'Tribunal Litigation',
        description: 'Filing a formal application under Section 17 of SARFAESI challenging the lender’s measures and petitioning for stay orders against auction.',
        suitability: 'Essential when the lender issues a Section 13(4) possession notice or issues an auction sale notice.',
      },
      {
        title: 'Compromise Settlement / Commercial OTS',
        badge: 'Commercial Settlement',
        description: 'Negotiating a one-time settlement with the bank’s stressed asset vertical based on real collateral market value and forced liquidation value.',
        suitability: 'Suitable for business promoters and property owners who have liquid funds or an equity partner to close the account.',
      },
      {
        title: 'Account Regularization & Restructuring',
        badge: 'Overdue Clearance',
        description: 'Clearing the genuine overdue interest and principal to restore the account from NPA to standard asset status under RBI prudential guidelines.',
        suitability: 'Best for borrowers whose cash flow was temporarily halted but has now stabilized.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Property owners facing home loan or loan against property (LAP) default past 90 days',
        'Borrowers served with SARFAESI Section 13(2) demand notices or Section 13(4) possession notices',
        'Business enterprises receiving Section 14 notices from the District Magistrate / CMM for property seizure',
        'Borrowers whose mortgaged commercial or residential property is listed for imminent bank auction',
      ],
      notSuitableFor: [
        'Unsecured personal loans or credit cards where no mortgage or hypothecated collateral was pledged',
        'Agricultural land where SARFAESI Act is explicitly barred under Section 31(i) of the Act (which requires revenue/civil court defense)',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Copy of the Section 13(2) demand notice and proof of service / postal tracking',
      'Copy of Section 13(4) possession notice or newspaper auction notice (if issued)',
      'Original loan sanction letter, mortgage deed, and complete account ledger from inception',
      'Valuation reports or property title documents',
      'Proof of past payments, communication letters, and restructuring applications submitted to the bank',
    ],
  },

  // =========================================================================
  // 6. CREDIT RECOVERY
  // =========================================================================
  'credit-recovery': {
    slug: 'credit-recovery',
    serviceTitle: 'Credit Recovery',

    // 1. WHAT IS THIS PROBLEM?
    whatIsThisProblem: {
      headline: 'What are Credit Report Issues?',
      summary: 'When inaccuracies, outdated default tags, and unresolved bureau remarks obstruct financial credibility.',
      paragraphs: [
        'Your credit score (compiled by licensed credit bureaus such as CIBIL, Experian, Equifax, and CRIF High Mark) represents your financial reputation in the Indian banking system. A score below 700–750 can prevent you from obtaining housing loans, vehicle finance, business credit, or even personal credit cards.',
        'While authentic past defaults naturally pull down scores, millions of borrowers suffer from clerical errors, erroneous reporting, and bureaucratic delays. Common issues include closed loans still showing as "Active", paid-off debts erroneously labeled "Written Off" or "Wilful Default", mismatched PAN numbers, and failure by lenders to report issued No Dues Certificates (NDCs).',
        'Credit recovery is the systematic, lawful process of auditing your credit records, raising statutory disputes to remove incorrect data, ensuring lenders submit accurate closure data, and following structured financial habits to rebuild your score legitimately over time.',
      ],
      keyHighlights: [
        'Under RBI regulations, banks must update credit bureau records within 30 days of debt closure or correction.',
        'Erroneous duplicate accounts and identity mismatches frequently degrade credit scores unfairly.',
        'True credit rebuilding is an educational, documented discipline — no entity can magically erase valid records overnight.',
      ],
    },

    // 2. WHAT SHOULD YOU DO FIRST? (UNDERSTAND -> DOCUMENT -> ASSESS -> ACT)
    firstSteps: [
      {
        phase: 'UNDERSTAND',
        title: 'Check All 4 Bureau Reports',
        description: 'Lenders check different bureaus; examine your official reports from CIBIL, Experian, Equifax, and CRIF High Mark to get the complete picture.',
      },
      {
        phase: 'DOCUMENT',
        title: 'Gather Closure Evidence',
        description: 'Locate all formal No Dues Certificates (NDCs), settlement letters, payment receipts, and bank account closure confirmations.',
      },
      {
        phase: 'ASSESS',
        title: 'Identify Inaccuracies & Lapses',
        description: 'Audit each account row for days past due (DPD) errors, incorrect balances on closed cards, wrong personal details, or unauthorized enquiries.',
      },
      {
        phase: 'ACT',
        title: 'File Formal Bureau & Lender Disputes',
        description: 'Raise structured disputes through credit bureau portals and formally petition the concerned bank’s nodal officer to upload corrected data.',
      },
    ],

    // 3. HOW LEGALBHAROSA CAN HELP
    howWeHelp: {
      intro: 'LegalBharosa provides thorough credit report analysis, dispute filing support, and lender closure verification.',
      points: [
        {
          title: 'Full Bureau Audit & Error Identification',
          description: 'We conduct a line-by-line review across your credit reports to identify clerical mistakes, outdated records, and reporting anomalies.',
        },
        {
          title: 'NDC Verification & Lender Follow-up',
          description: 'We assist in obtaining missing No Dues Certificates from past lenders and ensuring they transmit closure records to credit bureaus.',
        },
        {
          title: 'Statutory Credit Bureau Dispute Filing',
          description: 'Drafting and lodging formal online and written disputes under the Credit Information Companies (Regulation) Act, 2005.',
        },
        {
          title: 'Structured Credit Rebuilding Guidance',
          description: 'Practical, step-by-step guidance on credit utilization ratios, secured card strategies, and disciplined repayment habits to improve scores over 6-18 months.',
        },
      ],
    },

    // 4. POSSIBLE RESOLUTION PATHS
    resolutionPaths: [
      {
        title: 'Clerical Error & Bureau Dispute',
        badge: 'Bureau Dispute',
        description: 'Formally disputing factual errors such as wrong name, mismatched PAN, fraudulent accounts, or wrong payment status directly with credit bureaus.',
        suitability: 'Ideal for borrowers whose scores are suppressed by technical bureau or clerical mistakes.',
      },
      {
        title: 'Lender NDC Upload Rectification',
        badge: 'Lender Compliance',
        description: 'Directing the lender’s credit bureau operations team to upload official No Dues Certificates and change status from "Default" to "Closed / Settled".',
        suitability: 'Necessary when you have fully paid a loan or settlement but the bank failed to update bureau records within 30 days.',
      },
      {
        title: 'Goodwill Correction Representation',
        badge: 'Lender Discretion',
        description: 'Submitting a formal petition to the lender explaining that an isolated 30-day delay was due to technical or medical reasons, requesting removal of the late remark.',
        suitability: 'Applicable for borrowers with otherwise exemplary repayment histories who experienced a minor operational glitch.',
      },
      {
        title: 'Secured Rebuilding Trajectory',
        badge: 'Score Rebuilding',
        description: 'Adopting a disciplined credit-building regimen using low-limit fixed-deposit-backed credit cards with low credit utilization and 100% on-time payments.',
        suitability: 'The essential long-term pathway for anyone who has concluded settlements or defaults and wants to regain prime loan eligibility.',
      },
    ],

    // 6. WHO IS THIS FOR?
    whoIsThisFor: {
      idealFor: [
        'Borrowers who have cleared debts or completed settlements but still show active default remarks',
        'Individuals denied home loans, business loans, or credit cards due to a low CIBIL score below 700',
        'Victims of identity theft, mismatched PAN records, or unauthorized loan enquiries',
        'Anyone who wants an objective, realistic roadmap to rebuild their credit reputation responsibly',
      ],
      notSuitableFor: [
        'Individuals seeking illegal "score-hacking" or fraudulent removal of legitimate, active unpaid default records',
        'Borrowers currently in active, ongoing default who have not yet initiated settlement or repayment of their debts',
      ],
    },

    // 7. DOCUMENTS / INFORMATION YOU MAY NEED
    documentsNeeded: [
      'Recent full credit reports (CIBIL, Experian, Equifax, or CRIF) downloaded within the last 30 days',
      'PAN card and Aadhaar card copies for identity verification',
      'No Dues Certificates (NDCs) or closure letters from past lenders for settled/closed accounts',
      'Bank statement proof showing debit of final settlement/closure amounts',
      'Reference numbers of any previous dispute tickets raised with the bureaus or banks',
    ],
  },
};
// Final submission update
