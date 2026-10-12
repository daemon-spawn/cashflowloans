import { company } from "@cashflow/core";

import type { LegalDocument } from "./types";

/**
 * Built only from what the site and the original Terms already state.
 * TODO: owner review before launch (Information Officer name, retention periods, NCR number).
 */
export const privacy: LegalDocument = {
  intro: [
    "Cashflow Loans is committed to safeguarding your personal information in compliance with the Protection of Personal Information Act (POPIA). This policy explains what we collect when you use this website, why we need it and how we look after it.",
  ],
  sections: [
    {
      title: "What we collect",
      clauses: [
        {
          heading: "When you apply for a loan",
          list: [
            "Your name, surname, South African ID number, cellphone number and email address",
            "The loan type, amount and repayment date you choose",
            "A copy of your ID",
            "For unsecured loans: your latest payslip and a 3-month bank statement",
            "For secured loans: photos of your collateral",
          ],
        },
        { heading: "When you contact us", text: "Your name, email address, and optionally your phone number, a subject and your message." },
      ],
    },
    {
      title: "Why we collect it",
      clauses: [
        {
          list: [
            "To assess and process your loan application",
            "To confirm your application by email and contact you about it",
            "To arrange collection and inspection of collateral for secured loans",
            "To set up the DebiCheck debit order for unsecured loans",
            "To recover outstanding amounts as set out in our Terms and Conditions",
            "To answer your questions",
          ],
        },
      ],
    },
    {
      title: "Who we share it with",
      clauses: [
        {
          text: "We share your information only where it is needed to provide your loan:",
          list: [
            "Your bank, to authorise the DebiCheck debit order",
            "Our courier partners, to collect your collateral",
            "Credit bureaus and debt collection services, if a loan is not repaid, as set out in our Terms and Conditions",
          ],
        },
      ],
    },
    {
      title: "How we protect it",
      clauses: [
        { text: "We employ robust security measures to protect your data and ensure confidentiality. The documents you upload are stored privately and only our team can open them." },
      ],
    },
    {
      title: "Your rights",
      clauses: [
        {
          text: "Under POPIA you may ask us what personal information we hold about you, ask us to correct or delete it, and object to how it is used. You may also lodge a complaint with the Information Regulator.",
        },
      ],
    },
    {
      title: "Contact Information",
      clauses: [
        {
          text: "For any questions about your personal information, please contact Cashflow Loans at:",
          list: [`Phone: ${company.phoneDisplay}`, `Email: ${company.email}`],
        },
      ],
    },
  ],
};
