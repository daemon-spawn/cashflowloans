/**
 * Request contracts shared by the website forms and the API.
 * The Flask API validates the same shapes in backend/app/schemas/.
 */
import { z } from "zod";
import { LOAN_TYPES, loanRules } from "./loan";
import { isValidSaIdNumber } from "./sa-id";

const phone = z
  .string()
  .trim()
  .regex(/^(\+27|0)\d{9}$/, "Enter a valid South African number, e.g. 0614011426");

export const applicationSchema = z
  .object({
    loanType: z.enum(LOAN_TYPES),
    amount: z.coerce.number().min(loanRules.minAmount).max(loanRules.maxAmount),
    repaymentDate: z.iso.date(),
    firstName: z.string().trim().min(1, "Required"),
    lastName: z.string().trim().min(1, "Required"),
    idNumber: z.string().trim().refine(isValidSaIdNumber, "Enter a valid 13-digit SA ID number"),
    phone,
    email: z.email(),
    acceptedTerms: z.literal(true, "You must accept the terms"),
  })
  .refine((v) => v.loanType !== "secured" || v.amount >= loanRules.securedMinAmount, {
    path: ["amount"],
    message: `Secured loans start at R${loanRules.securedMinAmount}`,
  });
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.email(),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5, "Tell us a bit more").max(5000),
});
export type ContactInput = z.infer<typeof contactSchema>;
