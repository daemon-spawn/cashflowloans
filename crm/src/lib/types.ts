/** Shapes returned by the Flask staff API (backend/app/schemas/serializers.py). Money is a decimal string. */
import type {
  ApplicationSource,
  ApplicationStatus,
  CollateralStatus,
  DocumentKind,
  LoanStatus,
  LoanType,
} from "@cashflow/core";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  idNumber: string;
  email: string;
  phone: string;
  blacklisted: boolean;
  blacklistReason: string | null;
  createdAt: string;
};

export type Standing =
  | "overdue"
  | "due"
  | "active"
  | "pending_payout"
  | "applicant"
  | "written_off"
  | "paid"
  | "declined"
  | "none";

export type ClientSummary = Client & {
  standing: Standing;
  applications: number;
  loans: number;
  borrowed: string;
  repaid: string;
  outstanding: string;
  nextDueDate: string | null;
};

export type Application = {
  id: string;
  reference: string;
  loanType: LoanType;
  amount: string;
  repaymentDate: string;
  status: ApplicationStatus;
  declineReason: string | null;
  source: ApplicationSource;
  reviewedBy: string | null;
  loanId: string | null;
  client: Client;
  createdAt: string;
};

export type Document = {
  id: string;
  kind: DocumentKind;
  filename: string;
  contentType: string;
  sizeBytes: number;
  url: string | null;
  createdAt: string;
};

export type Note = { id: string; body: string; author: string; applicationId: string | null; loanId: string | null; createdAt: string };
export type Activity = { id: string; kind: string; message: string; actor: string; applicationId: string | null; loanId: string | null; createdAt: string };

export type LedgerEntry = { on: string; kind: "advance" | "fee" | "payment" | "late_charge"; amount: string; balance: string; label: string };
export type Payment = {
  id: string;
  amount: string;
  paidOn: string;
  method: string;
  reference: string | null;
  notes: string | null;
  recordedBy: string | null;
  createdAt: string;
};

export type Loan = {
  id: string;
  reference: string | null;
  applicationId: string | null;
  client: Client;
  loanType: LoanType;
  principal: string;
  fee: string;
  totalRepayable: string;
  paidOutOn: string | null;
  paidOutBy: string | null;
  dueDate: string | null;
  status: LoanStatus;
  balance: string;
  paid: string;
  lateCharges: string;
  missedPeriods: number;
  nextDueDate: string | null;
  paidAt: string | null;
  writtenOffAt: string | null;
  writtenOffReason: string | null;
  collateralStatus: CollateralStatus | null;
  collateralDescription: string | null;
  requestedRepaymentDate: string | null;
  createdAt: string;
};

export type LoanDetail = Loan & {
  ledger: { entries: LedgerEntry[] };
  payments: Payment[];
  notes: Note[];
  activity: Activity[];
};

export type ApplicationDetail = Application & {
  documents: Document[];
  notes: Note[];
  activity: Activity[];
  loan: Loan | null;
  otherLoans: Loan[];
};

export type ClientDetail = ClientSummary & {
  applicationList: Application[];
  loanList: Loan[];
  notes: Note[];
  documents: Document[];
  activity: Activity[];
};

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "handled";
  createdAt: string;
};

export type LoanRow = {
  loanId: string;
  clientId: string;
  clientName: string;
  phone: string;
  reference: string | null;
  status: LoanStatus;
  dueDate: string | null;
  balance: string;
};

export type Overview = {
  today: string;
  applications: { new: number; inReview: number; today: number };
  messagesNew: number;
  totals: {
    loaned: string;
    collected: string;
    outstanding: string;
    overdueAmount: string;
    repaymentRate: number | null;
    averageLoan: string;
    openLoans: number;
    overdueLoans: number;
    pendingPayout: number;
    pendingPayoutAmount: string;
    clients: number;
  };
  loansByStatus: Partial<Record<LoanStatus, number>>;
  outstandingByType: Partial<Record<LoanType, string>>;
  dueSoon: LoanRow[];
  overdue: LoanRow[];
};

export type Analytics = {
  timeframe: string;
  since: string | null;
  newClients: number;
  loaned: string;
  collected: string;
  net: string;
  topClients: {
    clientId: string;
    name: string;
    loaned: string;
    repaid: string;
    outstanding: string;
    profit: string;
    lastActivity: string | null;
  }[];
};

export type Settings = { staffEmails: string[]; notifyEmail: string; emailConfigured: boolean; you: string };

export type ReminderRun = {
  date: string;
  loansChecked: number;
  remindersSent: number;
  dueTomorrow: number;
  dueToday: number;
  overdue: number;
  pendingPayout: number;
  toReview: number;
  digestSent: boolean;
};
