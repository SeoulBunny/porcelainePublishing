"use client";

// admin-quick-actions — add journal / add book / manage users / view
// reports, radius-ceiling rule (12px), no shadow, distinct from the
// public-site's Kiln-Stamp cards since these are mock actions with no
// destination content to preview. Mock-only: opens a placeholder panel
// state, no real backend action.

import { useState } from "react";
import { FiBookOpen, FiFileText, FiLayers, FiUsers } from "react-icons/fi";

const ACTIONS = [
  { label: "Add journal", Icon: FiLayers },
  { label: "Add book", Icon: FiBookOpen },
  { label: "Manage users", Icon: FiUsers },
  { label: "View reports", Icon: FiFileText },
];

export function AdminQuickActions() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <section id="reports" data-section="admin-quick-actions" className="border-b border-hairline bg-porcelain-soft/50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl text-ink">Quick actions</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setNotice(`${label} is a UI mockup in this preview.`)}
              className="flex flex-col items-center gap-2 rounded-xl border border-hairline bg-porcelain px-4 py-5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-px hover:border-sage"
            >
              <Icon className="h-5 w-5 text-slate" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        {notice && (
          <p role="status" className="mt-4 text-sm text-slate">
            {notice}
          </p>
        )}
      </div>
    </section>
  );
}
