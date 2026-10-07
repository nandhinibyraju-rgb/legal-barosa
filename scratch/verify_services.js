import { SERVICE_SPECIFIC_DATA } from '../src/data/serviceSpecificDetailData.js';

const services = [
  'harassment-protection',
  'loan-settlement',
  'legal-notice-review',
  'debt-management',
  'npa-secured-loans',
  'credit-recovery',
];

console.log('--- VERIFYING ALL 6 SERVICES ---');

let allPassed = true;

services.forEach((slug) => {
  const data = SERVICE_SPECIFIC_DATA[slug];
  if (!data) {
    console.error(`MISSING DATA FOR SLUG: ${slug}`);
    allPassed = false;
    return;
  }

  const checks = [
    { name: 'serviceTitle', ok: Boolean(data.serviceTitle) },
    { name: 'heroHeading', ok: Boolean(data.heroHeading) },
    { name: 'heroIntro', ok: Boolean(data.heroIntro) },
    { name: '1. problemStatement', ok: Boolean(data.problemStatement?.question && data.problemStatement?.triggers?.length > 0) },
    { name: '2. whoIsThisFor', ok: Boolean(data.whoIsThisFor?.idealFor?.length > 0 && data.whoIsThisFor?.notSuitableFor?.length > 0) },
    { name: '3. whatLegalBharosaDoes', ok: Boolean(data.whatLegalBharosaDoes?.length >= 4) },
    { name: '4. authorityDisclosure', ok: Boolean(data.authorityDisclosure?.title && data.authorityDisclosure?.description) },
    { name: '5. processSteps', ok: Boolean(data.processSteps?.length >= 5) },
    { name: '6. documentsRequired', ok: Boolean(data.documentsRequired?.length >= 4) },
    { name: '7. risksAndLimitations', ok: Boolean(data.risksAndLimitations?.length >= 3) },
    { name: '8. feesAndEngagement', ok: Boolean(data.feesAndEngagement?.pricingNote && data.feesAndEngagement?.details?.length > 0) },
    { name: '9. faqs', ok: Boolean(data.faqs?.length >= 4) },
    { name: '10. caseStudies', ok: Boolean(data.caseStudies?.length > 0) },
    { name: '11. borrowerRights', ok: Boolean(data.borrowerRights?.length >= 3) },
    { name: '13. disclaimer', ok: Boolean(data.disclaimer?.financialVsLegal && data.disclaimer?.paymentsDirectToLender) },
  ];

  console.log(`\nService: ${data.serviceTitle} (${slug})`);
  console.log(`Problem Question: "${data.problemStatement.question}"`);
  console.log(`Authority Disclosure: "${data.authorityDisclosure.title}"`);
  console.log(`Process Steps (${data.processSteps.length}): ${data.processSteps.map(s => s.title).join(' -> ')}`);
  console.log(`Case Studies: ${data.caseStudies.length} real reviews (${data.caseStudies.map(c => c.clientName).join(', ')})`);
  console.log(`Pricing Note: "${data.feesAndEngagement.pricingNote}"`);

  checks.forEach((c) => {
    if (!c.ok) {
      console.error(`  FAIL: ${c.name}`);
      allPassed = false;
    }
  });
});

// Check that content is distinct and not duplicated
for (let i = 0; i < services.length; i++) {
  for (let j = i + 1; j < services.length; j++) {
    const s1 = SERVICE_SPECIFIC_DATA[services[i]];
    const s2 = SERVICE_SPECIFIC_DATA[services[j]];

    if (s1.problemStatement.question === s2.problemStatement.question) {
      console.error(`DUPLICATE PROBLEM STATEMENT between ${services[i]} and ${services[j]}`);
      allPassed = false;
    }
    if (s1.processSteps.map(s => s.title).join() === s2.processSteps.map(s => s.title).join()) {
      console.error(`DUPLICATE PROCESS STEPS between ${services[i]} and ${services[j]}`);
      allPassed = false;
    }
    if (s1.faqs[0].question === s2.faqs[0].question) {
      console.error(`DUPLICATE FAQS between ${services[i]} and ${services[j]}`);
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log('\n>>> ALL 6 SERVICES FULLY VALIDATED AND STRICTLY DISTINCT! <<<');
} else {
  console.error('\n>>> VALIDATION FAILED! <<<');
  process.exit(1);
}
// Final submission update
