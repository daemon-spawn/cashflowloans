/**
 * Single source of truth for company details shown across the website and CRM.
 * Keep in sync with backend/app/core/company.py.
 */
export const company = {
  name: "Cashflow Loans",
  legalName: "Cashflow Loans",
  /** National Credit Regulator registration number. */
  ncrNumber: "NCRCP22656" as string | null,
  email: "info@cashflowloans.co.za",
  phone: "+27614011426",
  phoneDisplay: "061 401 1426",
  whatsapp: "27614011426",
  hours: "Mon – Sat, 08:00 – 17:00",
  country: "South Africa",
  social: {
    facebook: "https://www.facebook.com/share/1Jcb8SKRQd/",
    instagram: "https://www.instagram.com/cashflowloans27",
  },
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${company.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
