/** FAQ content, migrated from the legacy site (legacy/src/index.html). */
export type FaqItem = { question: string; answer: string[] };

export const faq: readonly FaqItem[] = [
  {
    question: "What types of loans does Cashflow Loans offer?",
    answer: [
      "We offer secured and unsecured loans. Secured loans require collateral and are available for amounts from R500. Unsecured loans need no collateral but involve a DebiCheck authorisation.",
    ],
  },
  {
    question: "How do I apply for a secured loan?",
    answer: [
      "Apply on our website, by email, WhatsApp or phone, and provide the required information and documents.",
      "Our courier partners collect your collateral at no extra cost. Once it has been inspected, the approved amount is paid into your bank account.",
    ],
  },
  {
    question: "How does the unsecured loan process work?",
    answer: [
      "Apply on our website, WhatsApp or by phone and upload your documents. Once approved, you'll get an email confirmation.",
      "Authorise a DebiCheck debit order with your bank. Once it's confirmed, the money is in your account within 15 minutes.",
    ],
  },
  {
    question: "What is DebiCheck, and why is it required for unsecured loans?",
    answer: [
      "DebiCheck is a secure debit-order system that protects you from unauthorised deductions. You confirm the debit order with your bank electronically before anything is deducted, so you stay in control of your account.",
    ],
  },
  {
    question: "Is my collateral safe with Cashflow Loans?",
    answer: ["Yes. All collateral we hold is insured, and we take every precaution to keep your property secure and well-maintained during the loan period."],
  },
  {
    question: "How do you protect my personal information?",
    answer: ["We process your personal information in line with the Protection of Personal Information Act (POPIA) and use strong security measures to keep it confidential."],
  },
  {
    question: "Is Cashflow Loans a registered credit provider?",
    answer: ["Yes. We are registered with the National Credit Regulator (NCR) and committed to responsible lending."],
  },
  {
    question: "Are there extra costs for collateral collection?",
    answer: ["No. For secured loans from R500, our courier partners collect collateral nationwide at no extra cost."],
  },
  {
    question: "How quickly will I receive my money?",
    answer: [
      "Secured loans: once your collateral has been inspected and approved.",
      "Unsecured loans: within 15 minutes of a successful DebiCheck authorisation.",
    ],
  },
  {
    question: "What happens if I pay late?",
    answer: ["A further 50% is added to the outstanding balance for each missed due date. Talk to us early if you're struggling — we'd rather help you find a way through."],
  },
];
