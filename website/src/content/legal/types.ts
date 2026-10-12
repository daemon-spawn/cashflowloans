export type LegalClause = { heading?: string; text?: string; list?: string[] };
export type LegalSection = { title: string; clauses: LegalClause[] };
export type LegalDocument = { intro: string[]; sections: LegalSection[]; closing?: string[] };
