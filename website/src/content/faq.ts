/**
 * FAQ, word for word from the original site (legacy/src/index.html), plus one
 * question on late payment that states the loan rule. Moves to the CRM later.
 */
export type FaqItem = {
  question: string;
  answer: string[];
  /** Render the answer lines as a bulleted list (the original used bullets for steps). */
  list?: boolean;
};

export const faq: readonly FaqItem[] = [
  {
    question: "What types of loans does Cashflow Loans offer?",
    answer: [
      "Cashflow Loans provides both **secured** and **unsecured loans** to meet your financial needs. Secured loans require collateral and are available for amounts above R500, while unsecured loans do not require collateral but involve a DebiCheck authorization process.",
    ],
  },
  {
    question: "How do I apply for a secured loan?",
    list: true,
    answer: [
      "Submit your application via our website, email, WhatsApp, or phone call",
      "Provide the required information and documentation",
      "Arrange for your collateral to be collected by our trusted courier partners at no additional cost",
      "After careful inspection of the collateral, the approved loan amount will be transferred to your bank account",
    ],
  },
  {
    question: "How does the unsecured loan process work?",
    list: true,
    answer: [
      "Submit your application through our website, WhatsApp, or phone call",
      "Provide the necessary information and documentation",
      "Upon approval, you will receive an email notification confirming the success of your application",
      "Authorize a DebiCheck debit order with your bank",
      "Once the DebiCheck is confirmed, the loan amount will be transferred to your bank account within 15 minutes",
    ],
  },
  {
    question: "What is DebiCheck, and why is it required for unsecured loans?",
    answer: [
      "DebiCheck is a secure debit order system designed to protect you from fraudulent or unauthorized transactions. It requires you to electronically confirm debit order details with your bank before any deductions are processed, ensuring you maintain full control over your account.",
    ],
  },
  {
    question: "Is my collateral safe with Cashflow Loans?",
    answer: [
      "Yes, your collateral is fully protected. All items held by Cashflow Loans are insured against unforeseen circumstances, and we take every precaution to ensure your property is secure and well-maintained during the loan period.",
    ],
  },
  {
    question: "How does Cashflow Loans ensure the security of my personal information?",
    answer: [
      "Cashflow Loans is committed to safeguarding your personal information in compliance with the Protection of Personal Information Act (POPIA). We employ robust security measures to protect your data and ensure confidentiality.",
    ],
  },
  {
    question: "Is Cashflow Loans a registered credit provider?",
    answer: [
      "Yes, Cashflow Loans is a licensed credit provider registered with the National Credit Regulator (NCR), ensuring compliance with all applicable regulations and a commitment to responsible lending practices.",
    ],
  },
  {
    question: "Are there any additional costs for collateral collection?",
    answer: [
      "No, for secured loans above R500, we partner with trusted courier companies to collect collateral items nationwide at no extra cost to you.",
    ],
  },
  {
    question: "How quickly will I receive my loan funds?",
    list: true,
    answer: [
      "For **secured loans**, funds are transferred to your bank account after the collateral is inspected and approved",
      "For **unsecured loans**, funds are transferred within 15 minutes of a successful DebiCheck authorization with your bank",
    ],
  },
  {
    question: "How can I contact Cashflow Loans for more information?",
    answer: [
      "You can reach us via our website, email, WhatsApp, or phone. Visit our website or contact our team for personalized assistance with your loan application.",
    ],
  },
  {
    question: "What happens if I pay late?",
    answer: [
      "A further 50% is added to the outstanding balance for each missed due date. If you think you will miss a payment, contact us before the due date.",
    ],
  },
];
