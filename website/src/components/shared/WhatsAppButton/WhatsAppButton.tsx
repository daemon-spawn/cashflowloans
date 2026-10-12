import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@cashflow/core";

import styles from "./WhatsAppButton.module.css";

/** Floating WhatsApp shortcut — WhatsApp is the primary contact channel. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Cashflow Loans, I'd like to find out about a loan.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={styles.button}
    >
      <MessageCircle aria-hidden />
    </a>
  );
}
