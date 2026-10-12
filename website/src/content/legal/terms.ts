import { company } from "@cashflow/core";

import type { LegalDocument } from "./types";

/**
 * Terms and Conditions, word for word from the original application form
 * (legacy/forms/src/components/TermsAndConditions.jsx).
 * TODO: owner to confirm the wording and a fixed effective date (the original showed today's date).
 */
export const terms: LegalDocument = {
  intro: [
    'By applying for or obtaining a loan from Cashflow Loans ("we," "us," or "our"), you ("the Borrower" or "you") agree to be bound by the following Terms and Conditions ("Terms"). Please read these Terms carefully before entering into any loan agreement with us. If you do not agree with these Terms, you should not apply for or accept a loan from Cashflow Loans.',
  ],
  sections: [
    {
      title: "Loan Terms",
      clauses: [
        { heading: "Loan Duration", text: "All loans provided by Cashflow Loans are for a fixed term of one (1) month from the date of disbursement, unless otherwise specified in the loan agreement." },
        { heading: "Repayment Obligation", text: "The Borrower is required to repay the full loan amount, including any applicable interest and fees, by the due date specified in the loan agreement." },
      ],
    },
    {
      title: "Consequences of Non-Payment",
      clauses: [
        {
          heading: "Unsecured Loans",
          text: "In the event of non-payment by the due date, Cashflow Loans reserves the right to take any and all actions to recover the outstanding amount, including but not limited to:",
          list: [
            "Blacklisting the Borrower with credit bureaus or other relevant authorities.",
            "Repossessing assets owned by the Borrower with a value equivalent to the outstanding loan amount, in accordance with applicable laws.",
          ],
        },
        { heading: "Secured Loans", text: "For loans secured by collateral, failure to repay the loan by the due date will result in Cashflow Loans taking possession of and selling the collateral to recover the outstanding loan amount, including any associated costs, fees, or interest. The Borrower will be responsible for any shortfall if the sale of the collateral does not fully cover the outstanding amount." },
        { heading: "Additional Recovery Measures", text: "Cashflow Loans reserves the right to pursue all legal remedies available to recover the owed amount, including but not limited to legal action, debt collection services, and reporting to credit bureaus." },
      ],
    },
    {
      title: "Borrower Responsibilities",
      clauses: [
        { heading: "Accuracy of Information", text: "The Borrower is responsible for providing accurate and complete information, including banking details, at the time of loan application. Cashflow Loans will not be liable for any loss of income, funds, or other financial consequences resulting from incorrect or incomplete banking details provided by the Borrower." },
        { heading: "Timely Repayment", text: "The Borrower agrees to ensure that sufficient funds are available in the designated repayment account to cover the loan repayment on the due date." },
      ],
    },
    {
      title: "Liability",
      clauses: [
        { heading: "Non-Liability for Incorrect Banking Details", text: "Cashflow Loans shall not be responsible or liable for any loss, delay, or financial harm caused by the Borrower providing incorrect or incomplete banking details." },
        { heading: "Collateral Sale", text: "For secured loans, the Borrower acknowledges that Cashflow Loans is not liable for any loss in value or other consequences arising from the sale of collateral to recover the outstanding loan amount." },
      ],
    },
    {
      title: "General Provisions",
      clauses: [
        { heading: "Compliance with Laws", text: "All actions taken by Cashflow Loans to recover outstanding amounts will be conducted in accordance with applicable local, state, and federal laws." },
        { heading: "Amendments", text: "Cashflow Loans reserves the right to amend these Terms at any time. Any changes will be communicated to Borrowers in writing or through our website and will take effect upon the specified date." },
        { heading: "Governing Law", text: "These Terms and any loan agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which Cashflow Loans operates." },
        { heading: "Severability", text: "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect." },
        { heading: "Entire Agreement", text: "These Terms, together with the loan agreement, constitute the entire agreement between the Borrower and Cashflow Loans and supersede any prior agreements or understandings." },
      ],
    },
    {
      title: "Contact Information",
      clauses: [
        {
          text: "For any questions or concerns regarding these Terms or your loan, please contact Cashflow Loans at:",
          list: [`Phone: ${company.phoneDisplay}`, `Email: ${company.email}`, "Website: www.cashflowloans.co.za"],
        },
      ],
    },
  ],
  closing: ["By applying for or accepting a loan from Cashflow Loans, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions."],
};
