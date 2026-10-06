/**
 * LegalBharosa AI — Production Serverless AI Backend
 * Endpoint: POST /api/ai
 *
 * Built with Google's official @google/genai SDK.
 * Server-side only: Reads GEMINI_API_KEY from environment.
 * Full Agentic Legal Case Intelligence:
 * - Dynamic structured case state maintenance
 * - Evidence tracking (USER, DOCUMENT, AUTHORIZED_SOURCE, INFERENCE)
 * - Approved Indian statutory knowledge retrieval
 * - Multimodal document understanding (PDF, JPG, PNG)
 * - 5-Step personalized action plan generation
 * - Advocate-ready consultation brief handoff
 * - High-risk escalation and neutral legal safety disclaimers
 * - Multilingual: English, Hindi, Telugu
 */

import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

// ============================================================================
// ENVIRONMENT VARIABLE LOADER (Server-side Only)
// ============================================================================
function ensureEnvLoaded() {
  if (process.env.GEMINI_API_KEY) return;
  try {
    const envPaths = [
      path.resolve(process.cwd(), '.env.local'),
      path.resolve(process.cwd(), '.env')
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eq = trimmed.indexOf('=');
          if (eq !== -1) {
            const key = trimmed.slice(0, eq).trim();
            let val = trimmed.slice(eq + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch (e) {
    // Silently continue
  }
}

// ============================================================================
// APPROVED STATUTORY KNOWLEDGE REPOSITORY (Indian Law & Regulatory Sources)
// ============================================================================
const AUTHORITATIVE_SOURCES = {
  rbi_fpc: {
    id: 'src_rbi_fpc',
    title: 'RBI Master Direction — Fair Practices Code for Lenders & Recovery Agents',
    source: 'Reserve Bank of India (RBI/DNBR/2016-17/45 & Master Circular 2022)',
    authorityLevel: 'Statutory Regulatory Directive',
    jurisdiction: 'India (All Scheduled Commercial Banks & NBFCs)',
    topic: 'Recovery Agent Conduct & Harassment Protection',
    effectiveDate: 'September 2016 (Updated regularly)',
    summary: 'Prohibits collection calls before 08:00 AM or after 07:00 PM. Strictly bars verbal abuse, harassment, contacting relatives/workplace colleagues, and unauthorized physical visits. Borrowers hold the legal right to escalate violations to the RBI Banking Ombudsman (CMS Portal).'
  },
  ni_act_138: {
    id: 'src_ni_138',
    title: 'Negotiable Instruments Act, 1881 — Section 138 (Dishonour of Cheque / Mandate)',
    source: 'Act of Parliament, Act No. 26 of 1881',
    authorityLevel: 'Central Statutory Enactment',
    jurisdiction: 'India (Pan-India Jurisdiction)',
    topic: 'Cheque Bounce & Statutory Pre-Litigation Notice',
    effectiveDate: 'Enacted 1881 (Amended 2002, 2018)',
    summary: 'A notice under Section 138 gives the recipient a mandatory 15-day statutory window to respond or clear lawful dues from date of receipt. A notice is not a court judgment. If payment is disputed or not made, the complainant has 30 days to file a formal complaint before the Judicial Magistrate.'
  },
  sarfaesi_2002: {
    id: 'src_sarfaesi_2002',
    title: 'Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002',
    source: 'Act of Parliament, Act No. 54 of 2002',
    authorityLevel: 'Central Statutory Enactment',
    jurisdiction: 'India (Secured Debts only)',
    topic: 'Secured Asset Recovery & NPA Classification',
    effectiveDate: '21 June 2002',
    summary: 'Applies strictly to secured credit where property/collateral is pledged. Requires mandatory 90-day overdue classification prior to NPA declaration. Section 13(2) mandates a 60-day demand notice. Borrowers have statutory rights under Section 13(3A) to file representations which lenders must formally answer within 15 days.'
  },
  rbi_ots_2023: {
    id: 'src_rbi_ots',
    title: 'RBI Framework on Compromise Settlements and Technical Write-offs',
    source: 'Reserve Bank of India Circular (DOR.STR.REC.20/21.04.048/2023-24)',
    authorityLevel: 'Statutory Regulatory Directive',
    jurisdiction: 'India (All Regulated Lending Entities)',
    topic: 'One-Time Settlement (OTS) & Loan Closure Guidelines',
    effectiveDate: '08 June 2023',
    summary: 'Directs all regulated lenders to institute board-approved compromise settlement policies. Crucially mandates that any OTS terms must be formally sanctioned on official bank letterhead with an authorized signatory prior to payment, followed by No Dues Certificate (NDC) and CIBIL update.'
  },
  arbitration_1996: {
    id: 'src_arb_1996',
    title: 'Arbitration and Conciliation Act, 1996 & Supreme Court Perkins Eastman Ruling',
    source: 'Act No. 26 of 1996 & Supreme Court of India [(2020) 20 SCC 760]',
    authorityLevel: 'Apex Judicial Precedent & Statute',
    jurisdiction: 'India',
    topic: 'Unilateral Sole Arbitrator Appointments in Loan Agreements',
    effectiveDate: '1996 (Binding Supreme Court Precedent from 2019)',
    summary: 'A party having an interest in the dispute outcome (e.g. a lending bank/NBFC) is legally ineligible to unilaterally appoint a sole arbitrator without mutual consent. Borrowers can formally challenge unilateral arbitration appointments under Section 11 / 14.'
  }
};

// ============================================================================
// GEMINI CLIENT INITIALIZER & FALLBACK EXECUTOR
// ============================================================================
function getGeminiClient() {
  ensureEnvLoaded();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Execute Gemini model request with automatic fallback:
 * Priority: process.env.GEMINI_MODEL -> gemini-3.8-flash -> gemini-3.5-flash -> gemini-flash-latest
 */
async function callGeminiWithFallback({ contents, systemInstruction, responseMimeType = 'application/json' }) {
  const ai = getGeminiClient();
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  const candidateModels = [
    preferredModel,
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];
  const uniqueModels = [...new Set(candidateModels)];

  let lastError = null;

  for (const modelName of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            responseMimeType,
            temperature: 0.2,
          }
        });
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Timeout calling Gemini model ${modelName}`)), 22000);
        });
        const response = await Promise.race([generatePromise, timeoutPromise]);

        if (response && response.text) {
          return { modelName, text: response.text };
        }
      } catch (err) {
        lastError = err;
        const msg = err?.message || String(err);
        const status = err?.status || err?.code;

        // If 404 (deprecated/not found) or 429 (quota exhausted on this model), immediately try next candidate model
        if (
          status === 404 || 
          status === 429 || 
          msg.includes('404') || 
          msg.includes('429') || 
          msg.includes('NOT_FOUND') || 
          msg.includes('no longer available') || 
          msg.includes('quota') || 
          msg.includes('RESOURCE_EXHAUSTED')
        ) {
          break; // Try next model immediately
        }

        // If temporary 503 high demand spike, retry once after short backoff
        if (attempt === 1 && (status === 503 || msg.includes('high demand') || msg.includes('UNAVAILABLE'))) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        break; // try next candidate model
      }
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API.');
}

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================
function getSystemPrompt(language = 'en', caseProfile = null) {
  const languageNames = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const targetLang = languageNames[language] || 'English';

  const activeFacts = caseProfile?.facts?.map(f => typeof f === 'object' ? `${f.source || 'USER'}: ${f.text}` : f).join('; ') || 'None established yet';
  const currentMissing = caseProfile?.missingInformation?.join(', ') || 'None identified yet';
  const currentStage = caseProfile?.stage || 'Information Gathering';

  return `You are LegalBharosa AI, India's premier Legal Case Intelligence Agent for LegalBharosa.org.
Tagline: "Understand your situation. Know your next step."

TARGET LANGUAGE: Respond in ${targetLang}. Use natural, accurate language with appropriate legal terminology.

CRITICAL BEHAVIORAL AND LEGAL RULES:
1. DO NOT dump large, overwhelming paragraphs. Keep responses calm, concise, and structured (2-3 short paragraphs max).
2. REAL AGENTIC LOOP:
   - Understand what the user explicitly stated.
   - DO NOT automatically assume SARFAESI, court proceedings, property attachment, OTS eligibility, or RBI violations UNLESS supported by stated facts or uploaded documents.
   - For a general overdue/EMI issue, ask the single highest-value next question to narrow down the case (e.g., "What type of loan is it — personal, home, vehicle, business, or another type?").
   - Offer 2-4 concrete, clickable suggested options/chips for the user.
   - DO NOT repeat questions that have already been answered.
   - Remember all previously stated facts:
     CURRENT CONFIRMED FACTS: [${activeFacts}]
     CURRENT STAGE: [${currentStage}]
     DOCUMENTS RECORDED: [${caseProfile?.documents?.join(', ') || 'None'}]
3. FACT EVIDENCE TRACKING:
   - Extract facts and tag EACH fact strictly with one of these sources:
     - "USER": Directly stated by the user.
     - "DOCUMENT": Explicitly read from an uploaded document.
     - "AUTHORIZED_SOURCE": From an authoritative Indian statute or regulatory circular.
     - "INFERENCE": Logical deductions by the AI.
   - NEVER present AI inference as a confirmed fact.
4. APPROVED INDIAN STATUTORY FRAMEWORKS:
   - Debt Collection & Harassment: RBI Master Direction on Fair Practices Code (08:00 AM - 07:00 PM calls, no verbal abuse/shaming, no contacting family/friends/relatives, escalation to Banking Ombudsman).
   - Cheque / NACH Bounce: Section 138 Negotiable Instruments Act (15-day statutory reply window).
   - NPA & SARFAESI Act, 2002: Applies ONLY to secured loans. 90-day overdue NPA classification, Section 13(2) 60-day demand notice, Section 13(3A) representation rights.
   - Loan Settlement & OTS: RBI June 8, 2023 Circular on Compromise Settlements (Sanction Letter on letterhead before payment, No Dues Certificate).
   - Arbitration: Arbitration & Conciliation Act 1996 / Supreme Court Perkins Eastman ruling (bars unilateral appointment of sole arbitrator by lending institution).
5. HIGH-RISK ESCALATION:
   - If court hearing dates, Section 138 15-day deadline expiry, arrest threats, physical violence threats, or urgent property possession are detected:
     Set "highRisk": true, "urgency": "Urgent" or "Critical". Include a calm prompt to prepare for advocate review.
6. LEGAL SAFETY:
   - Never claim to be an advocate or guarantee legal outcomes.
   - Never fabricate laws, citations, or judgments.
   - Use phrasing like "Based on the information provided...", "Under Indian regulatory guidelines...", "You may want to consider...".
   - Include the subtle disclaimer: "LegalBharosa AI provides general information and case organization support. It does not replace advice from a qualified legal professional."

OUTPUT FORMAT: Return VALID JSON ONLY matching this schema:
{
  "reply": "Your response in ${targetLang} (clean markdown formatting)",
  "caseUpdate": {
    "title": "Short 3-5 word concise case title (e.g., Personal Loan EMI Issue, Bank Recovery Notice, Property Notice Review)",
    "caseType": "Category (e.g., Bank Loan / Debt Issue, Recovery Harassment, Legal Notice Review, Loan Settlement)",
    "caseSubType": "Specific subtype (e.g., Unsecured Personal Loan, Cheque Bounce Sec 138)",
    "stage": "Factual stage (e.g., Information Gathering, Notice Analysis, Pre-Litigation Review)",
    "urgency": "Normal | Moderate | Urgent | Critical",
    "facts": [
      { "text": "Specific fact statement", "source": "USER | DOCUMENT | AUTHORIZED_SOURCE | INFERENCE" }
    ],
    "missingInformation": ["Specific missing item 1", "Specific missing item 2"],
    "importantDates": [
      { "label": "Date label", "date": "Date value" }
    ],
    "amounts": [
      { "label": "Amount label", "amount": "₹..." }
    ],
    "possibleOptions": ["Option 1", "Option 2"],
    "recommendedNextStep": "Single immediate concrete practical step",
    "expertEscalation": false,
    "sources": [
      {
        "id": "src_rbi_fpc",
        "title": "RBI Master Direction — Fair Practices Code",
        "authorityLevel": "Statutory Regulatory Directive",
        "summary": "Key summary relevant to this issue"
      }
    ]
  },
  "suggestedActions": ["Quick chip 1", "Quick chip 2", "Quick chip 3"],
  "highRisk": false
}`;
}

// ============================================================================
// MAIN HTTP HANDLER
// ============================================================================
export default async function handler(req, res) {
  // CORS configuration
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Ensure robust response helper availability
  if (!res.status) {
    res.status = (code) => { res.statusCode = code; return res; };
  }
  if (!res.json) {
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    let {
      messages = [],
      message = null,
      prompt = null,
      caseProfile = null,
      document = null,
      action = 'chat',
      language = 'en',
      intent = null
    } = body;

    // Normalize messages
    if ((!messages || messages.length === 0) && (message || prompt)) {
      messages = [{ role: 'user', content: message || prompt }];
    }

    // 1. MODULE: DOCUMENT ANALYSIS (Multimodal Vision / PDF / Text)
    if (action === 'analyze_document' || document) {
      const docResult = await handleDocumentAnalysis(document, caseProfile, language);
      return res.status(200).json(docResult);
    }

    // 2. MODULE: 5-STEP ACTION PLAN GENERATION
    if (action === 'generate_plan' || intent === 'create_plan') {
      const planResult = await handleGenerateActionPlan(caseProfile, language);
      return res.status(200).json(planResult);
    }

    // 3. MODULE: ADVOCATE-READY CASE BRIEF EXPORT
    if (action === 'export_summary' || intent === 'expert_brief') {
      const briefResult = await handleExportExpertBrief(caseProfile, messages, language);
      return res.status(200).json(briefResult);
    }

    // 4. MODULE: CHAT CONVERSATION AGENT (Real Multi-turn Case Intelligence)
    const chatResult = await handleChatConversation({
      messages,
      caseProfile,
      language,
      intent
    });

    return res.status(200).json(chatResult);

  } catch (err) {
    console.error('[LegalBharosa AI] Error processing request:', err?.message || err);

    // Clean user-facing error state preserving case profile
    const fallbackProfile = req.body?.caseProfile || {
      caseType: 'General Legal Case',
      stage: 'Information Gathering',
      urgency: 'Normal',
      facts: [],
      missingInformation: ['Loan type or legal situation details'],
      importantDates: [],
      recommendedNextStep: 'Describe your situation to begin structured analysis.'
    };

    return res.status(200).json({
      isError: true,
      canRetry: true,
      message: "Something went wrong while processing your request.",
      reply: "Something went wrong while processing your request. Please click [Try Again] to resend your message.",
      caseProfile: fallbackProfile,
      caseUpdate: fallbackProfile,
      suggestedActions: [
        "I missed several EMI payments",
        "I received a legal notice from a bank",
        "Recovery agents are calling my relatives"
      ],
      suggestedQuestions: [
        "I missed several EMI payments",
        "I received a legal notice from a bank",
        "Recovery agents are calling my relatives"
      ]
    });
  }
}

// ============================================================================
// HANDLER: CHAT CONVERSATION
// ============================================================================
async function handleChatConversation({ messages, caseProfile, language, intent }) {
  const systemInstruction = getSystemPrompt(language, caseProfile);

  // Format messages for Gemini contents array
  const contents = [];
  
  // Auto-detect intent from last user message if not explicitly provided
  const lastMsg = messages[messages.length - 1];
  const lastText = (lastMsg?.content || lastMsg?.text || lastMsg?.message || '').toLowerCase();
  if (!intent) {
    if (lastText.includes('understand my loan problem')) intent = 'loan_intake';
    else if (lastText.includes('stop recovery harassment')) intent = 'harassment_intake';
    else if (lastText.includes('sarfaesi & property notice')) intent = 'sarfaesi_intake';
  }

  // Quick Actions Context Injection
  let systemContextPrefix = '';
  if (intent === 'loan_intake') {
    systemContextPrefix = '[Context: User initiated "Understand My Loan Problem". The user is seeking guidance regarding an overdue loan or EMI issue. Ask the single most useful clarifying question to establish the loan type without jumping to legal conclusions.]\n';
  } else if (intent === 'harassment_intake') {
    systemContextPrefix = '[Context: User initiated "Stop Recovery Harassment". Understand collection practices, timing, and third-party contact against RBI Fair Practices Code.]\n';
  } else if (intent === 'sarfaesi_intake') {
    systemContextPrefix = '[Context: User initiated "SARFAESI & Property Notice". Determine if secured loan, whether Sec 13(2) notice received, and 60-day limitation.]\n';
  }

  // Sanitize, normalize, and interleave multi-turn conversation
  const sanitizedTurns = [];
  for (const m of (messages || [])) {
    const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
    let text = (m.content || m.text || m.message || '').trim();
    if (!text) continue;

    // Drop leading model greeting so contents always begins with user
    if (sanitizedTurns.length === 0 && role === 'model') continue;

    // Keep history concise (cap previous turns to 1000 chars)
    if (text.length > 1000) {
      text = text.slice(0, 1000) + '...';
    }

    // Merge consecutive turns with the same role
    if (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === role) {
      sanitizedTurns[sanitizedTurns.length - 1].parts[0].text += `\n\n${text}`;
    } else {
      sanitizedTurns.push({
        role,
        parts: [{ text }]
      });
    }
  }

  // Ensure contents starts with a user turn
  if (sanitizedTurns.length === 0) {
    sanitizedTurns.push({ role: 'user', parts: [{ text: 'Hello, I need legal guidance.' }] });
  } else if (sanitizedTurns[0].role !== 'user') {
    sanitizedTurns.unshift({ role: 'user', parts: [{ text: 'Hello, please assist with my legal matter.' }] });
  }

  // Prepend intent context to the final user prompt
  if (systemContextPrefix) {
    for (let i = sanitizedTurns.length - 1; i >= 0; i--) {
      if (sanitizedTurns[i].role === 'user') {
        sanitizedTurns[i].parts[0].text = `${systemContextPrefix}${sanitizedTurns[i].parts[0].text}`;
        break;
      }
    }
  }

  const { text } = await callGeminiWithFallback({
    contents: sanitizedTurns,
    systemInstruction,
    responseMimeType: 'application/json'
  });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (parseErr) {
    // If output has markdown backticks, clean it
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  // Merge newly extracted facts into live case profile
  const mergedProfile = mergeCaseProfiles(caseProfile, parsed.caseUpdate);

  return {
    reply: parsed.reply,
    message: parsed.reply,
    caseProfile: mergedProfile,
    caseUpdate: mergedProfile,
    suggestedActions: parsed.suggestedActions || [],
    suggestedQuestions: parsed.suggestedActions || [],
    highRisk: Boolean(parsed.highRisk || mergedProfile.urgency === 'High' || mergedProfile.urgency === 'Urgent' || mergedProfile.urgency === 'Critical')
  };
}

// ============================================================================
// HANDLER: DOCUMENT ANALYSIS (PDF / Image Multimodal)
// ============================================================================
async function handleDocumentAnalysis(document, caseProfile, language) {
  if (!document) {
    throw new Error('No document provided for analysis.');
  }

  const languageNames = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const targetLang = languageNames[language] || 'English';

  const docInstruction = `You are LegalBharosa AI Legal Document Analyzer.
Analyze the provided legal notice, contract, bank communication, or court document.

CRITICAL RULES:
1. Extract ONLY facts explicitly stated in the document.
2. NEVER invent or fabricate parties, amounts, dates, or legal sections.
3. If an amount or date is unclear, explicitly state that it remains unconfirmed.
4. Output in ${targetLang}.

Return VALID JSON ONLY matching this schema:
{
  "documentAnalysis": {
    "documentType": "Document category (e.g., Section 138 Statutory Notice, SARFAESI 13(2) Demand, Loan Recall Notice, Court Summons, Loan Agreement)",
    "issuingParty": "Name of lender, bank, NBFC, or advocate who issued it",
    "recipient": "Name of borrower or recipient",
    "amountMentioned": "₹ Exact claimed amount with breakdown if available",
    "importantDate": "Notice date and exact response deadline or hearing date",
    "demands": "Specific demands made (e.g., pay ₹... within 15 days, surrender collateral, appear before magistrate)",
    "keyClauses": "Key statutory provisions cited (e.g., Section 138 NI Act, Section 13(2) SARFAESI Act, Section 25 PSS Act)",
    "unclearItems": "Any ambiguous claims, missing attachments, or unverified amounts",
    "questionsForAdvocate": "2-3 targeted questions the user should ask their legal advocate during consultation",
    "summary": "Plain-language 2-3 sentence overview of what this document means for the borrower."
  },
  "caseUpdate": {
    "caseType": "Classified Category",
    "caseSubType": "Specific Notice Subtype",
    "stage": "Document Review / Statutory Response Window",
    "urgency": "Urgent | Moderate | Critical",
    "facts": [
      { "text": "Fact from document", "source": "DOCUMENT" }
    ],
    "importantDates": [
      { "label": "Statutory Deadline / Notice Date", "date": "..." }
    ],
    "missingInformation": ["Items needing verification"],
    "recommendedNextStep": "Immediate concrete step based on the notice deadline"
  },
  "reply": "Clear, reassuring overview explaining what the document is, what the sender is demanding, and what the borrower's immediate next steps should be.",
  "suggestedActions": [
    "Create My Action Plan",
    "Prepare for an Expert",
    "What happens if I miss the deadline?"
  ]
}`;

  const parts = [];

  // Check if multimodal data is provided
  if (document.dataUrl || document.base64) {
    const rawBase64 = (document.dataUrl || document.base64).replace(/^data:.*?;base64,/, '');
    const mimeType = document.fileType || (document.fileName?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    
    parts.push({
      inlineData: {
        mimeType,
        data: rawBase64
      }
    });
  }

  // If text was extracted from document or provided
  let textPrompt = `Document Filename: ${document.fileName || 'Legal Document'}\n`;
  if (document.text) {
    textPrompt += `Document Extracted Text:\n${document.text.slice(0, 30000)}\n\n`;
  }
  textPrompt += `Please analyze this document thoroughly according to the schema.`;

  parts.push({ text: textPrompt });

  const { text } = await callGeminiWithFallback({
    contents: [{ role: 'user', parts }],
    systemInstruction: docInstruction,
    responseMimeType: 'application/json'
  });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const mergedProfile = mergeCaseProfiles(caseProfile, parsed.caseUpdate);
  // Add document to profile
  if (document.fileName) {
    mergedProfile.documents = Array.from(new Set([...(mergedProfile.documents || []), document.fileName]));
  }

  // Inject extracted document findings into case facts so follow-up conversations remember them
  if (parsed.documentAnalysis) {
    const da = parsed.documentAnalysis;
    const parts = [
      da.documentType ? `Type: ${da.documentType}` : '',
      da.issuingParty ? `Issuer: ${da.issuingParty}` : '',
      da.amountMentioned ? `Amount: ${da.amountMentioned}` : '',
      da.importantDate ? `Deadline: ${da.importantDate}` : '',
      da.demands ? `Demands: ${da.demands}` : '',
      da.summary ? `Summary: ${da.summary}` : ''
    ].filter(Boolean).join(' | ');

    if (parts) {
      if (!Array.isArray(mergedProfile.facts)) mergedProfile.facts = [];
      mergedProfile.facts.unshift({
        text: `[${document.fileName || 'Uploaded Document'}]: ${parts}`,
        source: 'DOCUMENT'
      });
    }
  }

  return {
    reply: parsed.reply,
    message: parsed.reply,
    documentAnalysis: parsed.documentAnalysis,
    caseProfile: mergedProfile,
    caseUpdate: mergedProfile,
    suggestedActions: parsed.suggestedActions || ['Create My Action Plan', 'Prepare for an Expert'],
    suggestedQuestions: parsed.suggestedActions || ['Create My Action Plan', 'Prepare for an Expert']
  };
}

// ============================================================================
// HANDLER: 5-STEP ACTION PLAN GENERATION
// ============================================================================
async function handleGenerateActionPlan(caseProfile, language) {
  const languageNames = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const targetLang = languageNames[language] || 'English';

  const planInstruction = `You are LegalBharosa AI Legal Strategist.
Generate a tailored 5-step action plan for this specific borrower case based STRICTLY on confirmed case facts.

CASE PROFILE:
Type: ${caseProfile?.caseType || 'General Legal Dispute'}
Subtype: ${caseProfile?.caseSubType || 'Loan Default Assessment'}
Stage: ${caseProfile?.stage || 'Information Gathering'}
Urgency: ${caseProfile?.urgency || 'Normal'}
Confirmed Facts: ${JSON.stringify(caseProfile?.facts || [])}
Deadlines: ${JSON.stringify(caseProfile?.importantDates || [])}
Documents: ${JSON.stringify(caseProfile?.documents || [])}

LANGUAGE: Respond in ${targetLang}.

RULES:
- Do NOT guarantee legal outcomes.
- Base each step directly on the borrower's actual situation.
- Structure:
  01 Understand: Plain language breakdown of the legal issue and claims.
  02 Prepare: Relevant documents and evidence borrower must assemble.
  03 Consider: Practical resolution avenues (e.g., compromise settlement OTS, restructuring, formal legal representation, Ombudsman complaint).
  04 Next Action: Immediate step to take in the next 24-48 hours.
  05 Professional Review: What specific issues to consult an advocate on.

Return VALID JSON ONLY matching this schema:
{
  "actionPlan": {
    "step1_understand": "...",
    "step2_prepare": "...",
    "step3_consider": "...",
    "step4_next_action": "...",
    "step5_professional_review": "..."
  },
  "reply": "Your customized 5-step legal action plan is ready. Here is a breakdown of your next steps.",
  "suggestedActions": [
    "Prepare for an Expert",
    "What documents do I need for my lawyer?",
    "How does an OTS settlement work?"
  ]
}`;

  const { text } = await callGeminiWithFallback({
    contents: [{ role: 'user', parts: [{ text: 'Generate my personalized 5-step action plan.' }] }],
    systemInstruction: planInstruction,
    responseMimeType: 'application/json'
  });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  const updatedProfile = {
    ...caseProfile,
    actionPlan: parsed.actionPlan
  };

  return {
    reply: parsed.reply,
    message: parsed.reply,
    actionPlan: parsed.actionPlan,
    caseProfile: updatedProfile,
    caseUpdate: updatedProfile,
    suggestedActions: parsed.suggestedActions || ['Prepare for an Expert', 'Book Consultation']
  };
}

// ============================================================================
// HANDLER: ADVOCATE-READY CASE BRIEF EXPORT
// ============================================================================
async function handleExportExpertBrief(caseProfile, messages, language) {
  const languageNames = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const targetLang = languageNames[language] || 'English';

  const briefInstruction = `You are LegalBharosa AI Legal Secretary.
Create a comprehensive, professional case summary for review by a Bar Council registered advocate in India.

CASE PROFILE:
Type: ${caseProfile?.caseType || 'General Legal Dispute'}
Subtype: ${caseProfile?.caseSubType || 'Loan Default'}
Stage: ${caseProfile?.stage || 'Intake'}
Urgency: ${caseProfile?.urgency || 'Normal'}
Confirmed Facts: ${JSON.stringify(caseProfile?.facts || [])}
Deadlines: ${JSON.stringify(caseProfile?.importantDates || [])}
Missing Info: ${JSON.stringify(caseProfile?.missingInformation || [])}
Documents: ${JSON.stringify(caseProfile?.documents || [])}

LANGUAGE: Respond in ${targetLang}.

Return VALID JSON ONLY matching this schema:
{
  "expertSummary": {
    "problem": "Executive summary of the borrower's core dispute",
    "timeline": "Timeline of key events and defaults",
    "confirmedFacts": "Bulleted list of established facts with evidence tags",
    "importantDocuments": "List of reviewed or available documents",
    "importantDates": "Upcoming statutory deadlines or court appearances",
    "amounts": "Outstanding dues, disputed interest, or settlement targets",
    "userGoal": "What the user wants to achieve (e.g. stop harassment, negotiate OTS, defend Section 138 notice)",
    "concerns": "Borrower's chief fears and risks",
    "missingInformation": "Evidentiary gaps requiring advocate attention",
    "aiObservations": "Preliminary statutory observations under Indian law",
    "areasRequiringProfessionalReview": "Key legal questions for the advocate",
    "fullText": "Full formatted text of the brief ready to print or copy"
  },
  "reply": "Your advocate-ready case brief has been generated. You can download it or share it directly when booking a consultation with our panel advocate.",
  "suggestedActions": [
    "Book Advocate Consultation",
    "Download Case Brief (.txt)",
    "Review Action Plan"
  ]
}`;

  const { text } = await callGeminiWithFallback({
    contents: [{ role: 'user', parts: [{ text: 'Generate comprehensive advocate case brief.' }] }],
    systemInstruction: briefInstruction,
    responseMimeType: 'application/json'
  });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  return {
    reply: parsed.reply,
    message: parsed.reply,
    expertSummary: parsed.expertSummary,
    caseProfile,
    caseUpdate: caseProfile,
    suggestedActions: parsed.suggestedActions || ['Book Advocate Consultation', 'Download Case Brief']
  };
}

// ============================================================================
// HELPER: CASE PROFILE MERGER
// ============================================================================
function mergeCaseProfiles(current = {}, updates = {}) {
  const cur = current || {};
  const upd = updates || {};

  const currentFacts = Array.isArray(cur?.facts) ? cur.facts : [];
  const updateFacts = Array.isArray(upd?.facts) ? upd.facts : [];

  // Deduplicate facts based on normalized text
  const factMap = new Map();
  currentFacts.forEach((f) => {
    const text = typeof f === 'object' && f !== null ? (f.text || f.fact) : String(f);
    if (text) factMap.set(text.toLowerCase().trim(), typeof f === 'object' ? f : { text, source: 'USER' });
  });
  updateFacts.forEach((f) => {
    const text = typeof f === 'object' && f !== null ? (f.text || f.fact) : String(f);
    if (text) factMap.set(text.toLowerCase().trim(), typeof f === 'object' ? f : { text, source: 'USER' });
  });

  // Merge missing information
  const currentMissing = Array.isArray(cur?.missingInformation) ? cur.missingInformation : [];
  const updateMissing = Array.isArray(upd?.missingInformation) ? upd.missingInformation : [];
  const combinedMissing = Array.from(new Set([...currentMissing, ...updateMissing]));

  // Merge important dates
  const currentDates = Array.isArray(cur?.importantDates) ? cur.importantDates : [];
  const updateDates = Array.isArray(upd?.importantDates) ? upd.importantDates : [];
  const dateMap = new Map();
  currentDates.forEach(d => {
    const key = typeof d === 'object' ? (d.label || d.date) : String(d);
    if (key) dateMap.set(key, d);
  });
  updateDates.forEach(d => {
    const key = typeof d === 'object' ? (d.label || d.date) : String(d);
    if (key) dateMap.set(key, d);
  });

  // Authoritative sources
  const currentSources = Array.isArray(cur?.sources) ? cur.sources : [];
  const updateSources = Array.isArray(upd?.sources) ? upd.sources : [];
  const srcMap = new Map();
  currentSources.forEach(s => { if (s?.title) srcMap.set(s.title, s); });
  updateSources.forEach(s => { if (s?.title) srcMap.set(s.title, s); });

  return {
    ...cur,
    title: upd.title || cur.title || 'Legal Situation Assessment',
    caseType: upd.caseType || cur.caseType || 'General Legal Case',
    caseSubType: upd.caseSubType || cur.caseSubType || '',
    stage: upd.stage || cur.stage || 'Information Gathering',
    urgency: upd.urgency || cur.urgency || 'Normal',
    facts: Array.from(factMap.values()),
    missingInformation: combinedMissing,
    importantDates: Array.from(dateMap.values()),
    amounts: upd.amounts || cur.amounts || [],
    possibleOptions: upd.possibleOptions || cur.possibleOptions || [],
    recommendedNextStep: upd.recommendedNextStep || cur.recommendedNextStep || 'Review situation details.',
    expertEscalation: Boolean(upd.expertEscalation || cur.expertEscalation),
    sources: Array.from(srcMap.values()),
    actionPlan: upd.actionPlan || cur.actionPlan || null,
  };
}
