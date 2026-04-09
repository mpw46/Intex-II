// ---------------------------------------------------------------------------
// PrivacyPage.tsx — Privacy Policy
//
// Complies with:
//   • GDPR (EU General Data Protection Regulation)
//   • Republic Act 10173 — Philippine Data Privacy Act of 2012 (DPA)
//
// Keep the POLICY_DATE updated whenever this document is substantively changed.
// ---------------------------------------------------------------------------

const POLICY_DATE = 'April 9, 2026';
const CONTACT_EMAIL = 'privacy@haven.org'; // TODO: Replace with real privacy contact

// ---------------------------------------------------------------------------
// Table of contents entries — anchors must match section `id` attributes
// ---------------------------------------------------------------------------
const TOC = [
  { id: 'information-we-collect',   label: '1. Information We Collect' },
  { id: 'how-we-use-information',   label: '2. How We Use Your Information' },
  { id: 'resident-data',            label: '3. Resident Data Protection' },
  { id: 'data-sharing',             label: '4. Data Sharing & Disclosure' },
  { id: 'international-transfers',  label: '5. International Data Transfers' },
  { id: 'cookies',                  label: '6. Cookies & Tracking' },
  { id: 'data-retention',           label: '7. Data Retention' },
  { id: 'your-rights',              label: '8. Your Rights' },
  { id: 'security',                 label: '9. Security Measures' },
  { id: 'children',                 label: '10. Children\'s Privacy' },
  { id: 'dpia',                     label: '10A. Data Protection Impact Assessments' },
  { id: 'changes',                  label: '11. Changes to This Policy' },
  { id: 'contact',                  label: '12. Contact Us' },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold text-stone-900 mt-12 mb-4 scroll-mt-24">
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-700 leading-relaxed mb-4">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-2 text-stone-700 mb-4">
      {items.map(item => (
        <li key={item} className="leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Page header */}
      <div className="bg-haven-teal-900 text-white pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-haven-teal-300 mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/70 text-sm">
            Effective date: {POLICY_DATE}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:flex lg:gap-16">
        {/* ---------------------------------------------------------------- */}
        {/* Sidebar — table of contents (sticky on desktop)                  */}
        {/* ---------------------------------------------------------------- */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">
              Contents
            </p>
            <nav aria-label="Privacy policy table of contents">
              <ul className="space-y-1">
                {TOC.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block text-sm text-stone-600 hover:text-haven-teal-700
                        py-1 transition-colors duration-150
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2 rounded"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* ---------------------------------------------------------------- */}
        {/* Main content                                                      */}
        {/* ---------------------------------------------------------------- */}
        <main className="flex-1 min-w-0">
          {/* Intro */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 mb-8">
            <Paragraph>
              Haven ("we," "our," or "us") operates safehouses and rehabilitation programs
              for girls who are survivors of abuse and trafficking in the Philippines. We take
              your privacy—and especially the privacy of the girls in our care—extremely
              seriously. This policy explains what information we collect, why we collect it,
              and how we protect it.
            </Paragraph>
            <Paragraph>
              This policy applies to visitors of our public website, registered supporters
              and donors, and authorised staff members who access the Haven portal. It
              complies with the{' '}
              <strong>EU General Data Protection Regulation (GDPR)</strong> and the{' '}
              <strong>Philippine Data Privacy Act of 2012 (Republic Act 10173)</strong>.
            </Paragraph>
            <Paragraph>
              <strong>Data Controller:</strong> Haven, a US-based 501(c)(3) nonprofit
              organisation. For all data protection enquiries, contact our Data Privacy
              Officer at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="text-haven-teal-600 hover:text-haven-teal-700 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>.
            </Paragraph>
            <Paragraph>
              <strong>EU Representation</strong>
            </Paragraph>
            <Paragraph>
              Haven does not have an establishment in the European Economic Area (EEA) and
              does not intentionally target or monitor individuals within the EEA. Where GDPR
              applies incidentally (for example, where an EU-based individual chooses to engage
              with our services), Haven will comply with applicable data protection obligations.
            </Paragraph>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">

            {/* 1. Information We Collect */}
            <SectionHeading id="information-we-collect">
              1. Information We Collect
            </SectionHeading>
            <Paragraph>
              <strong>Information you provide directly:</strong>
            </Paragraph>
            <BulletList items={[
              'Name, email address, and contact details when you register an account or make a donation',
              'Payment information processed securely through our payment provider (we do not store full card numbers)',
              'Messages or enquiries you send through our contact forms',
              'Volunteer or skills-contribution details if you register as a supporter',
            ]} />
            <Paragraph>
              <strong>Information collected automatically:</strong>
            </Paragraph>
            <BulletList items={[
              'IP address and general geographic region (country / region level)',
              'Browser type, operating system, and referring URL',
              'Pages visited, time spent, and links clicked (via cookies — see Section 5)',
              'Cookie preference choice stored in your browser\'s local storage',
            ]} />
            <Paragraph>
              We do <strong>not</strong> use fingerprinting, sell data to third parties, or
              collect information about minors through this public website.
            </Paragraph>

            {/* 2. How We Use Your Information */}
            <SectionHeading id="how-we-use-information">
              2. How We Use Your Information
            </SectionHeading>
            <Paragraph>
              We process your personal data only for the purposes listed below. For each
              purpose, we note the lawful basis under GDPR and the DPA:
            </Paragraph>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">
                      Purpose
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">
                      Lawful Basis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    ['Providing and maintaining your account', 'Contract performance'],
                    ['Processing donations and issuing receipts', 'Contract performance'],
                    ['Sending donation updates and impact reports (if opted in)', 'Consent'],
                    ['Improving the website through anonymised analytics (only if cookies accepted)', 'Consent'],
                    ['Responding to your enquiries', 'Legitimate interest / Contract'],
                    ['Complying with legal or regulatory obligations', 'Legal obligation'],
                  ].map(([purpose, basis]) => (
                    <tr key={purpose} className="hover:bg-stone-50 transition-colors duration-100">
                      <td className="px-4 py-3 text-stone-700">{purpose}</td>
                      <td className="px-4 py-3 text-stone-500">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paragraph>
              Where we rely on <strong>legitimate interests</strong> as a lawful basis, we
              conduct a <strong>Legitimate Interest Assessment (LIA)</strong> to ensure that
              processing is necessary and that your fundamental rights and freedoms are not
              overridden. You may request further information about these assessments.
            </Paragraph>
            <Paragraph>
              We do not engage in automated decision-making or profiling that produces legal
              or similarly significant effects.
            </Paragraph>

            {/* 3. Resident Data Protection */}
            <SectionHeading id="resident-data">
              3. Resident Data Protection
            </SectionHeading>
            <div className="flex items-start gap-3 p-4 bg-haven-teal-50 border border-haven-teal-200
              rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="h-5 w-5 text-haven-teal-600 shrink-0 mt-0.5"
                aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="text-sm text-haven-teal-800">
                <strong>Resident data receives the highest level of protection.</strong>{' '}
                Information about the girls in our care is never published, shared with
                the public, or used in any external system without explicit organisational
                authorisation.
              </p>
            </div>
            <Paragraph>
              Case records, counselling session notes, health data, and personal details of
              residents are:
            </Paragraph>
            <BulletList items={[
              'Stored only in access-controlled internal systems — never on the public website',
              'Accessible only to authorised social workers and administrators directly responsible for a resident\'s case',
              'Anonymised before appearing in any public-facing impact statistics or reports',
              'Retained in accordance with Philippine Department of Social Welfare and Development (DSWD) standards and the DPA\'s data minimisation principle',
              'Never transferred outside of authorised partner organisations without a written data-sharing agreement',
            ]} />
            <Paragraph>
              All public statistics on this website (total girls supported, reintegration
              rates, programme outcomes) are <strong>aggregate anonymised figures</strong> that
              cannot be traced back to any individual.
            </Paragraph>
            <Paragraph>
              <strong>Special Category Data (GDPR Article 9)</strong>
            </Paragraph>
            <Paragraph>
              Resident data may include special category personal data, including health
              information and highly sensitive personal history. We process this data strictly
              for <strong>social care, safeguarding, and rehabilitation purposes</strong>.
            </Paragraph>
            <Paragraph>Processing is carried out under:</Paragraph>
            <BulletList items={[
              'Article 9(2)(c): Protection of vital interests',
              'Article 9(2)(g): Substantial public interest, including safeguarding vulnerable individuals',
              'Article 9(2)(h): Provision of social care and treatment',
            ]} />
            <Paragraph>
              All such processing is subject to strict safeguards including role-based access
              control, data minimisation, and confidentiality obligations.
            </Paragraph>

            {/* 4. Data Sharing */}
            <SectionHeading id="data-sharing">
              4. Data Sharing &amp; Disclosure
            </SectionHeading>
            <Paragraph>
              We do not sell, rent, or trade personal data. We share information only in
              limited circumstances:
            </Paragraph>
            <BulletList items={[
              'Service providers (data processors): including Microsoft Azure (cloud hosting and infrastructure), payment processors, and email delivery providers. All processors operate under binding Data Processing Agreements (DPAs) that meet GDPR requirements.',
              'Partner organisations: in-country partners involved in safehouse coordination and programme delivery, under formal data-sharing agreements with strict safeguarding obligations',
              'Legal requirements: where disclosure is required by law or necessary to protect the safety or vital interests of an individual',
              'Organisational changes: such as restructuring or merger, with appropriate notice where required',
            ]} />
            <Paragraph>
              All recipients are contractually required to implement appropriate technical
              and organisational safeguards.
            </Paragraph>

            {/* 5. International Data Transfers */}
            <SectionHeading id="international-transfers">
              5. International Data Transfers
            </SectionHeading>
            <Paragraph>
              Haven is a US-based organisation serving programmes in the Philippines. Your
              personal data may be processed in, or transferred to, countries outside your
              own — including the United States and the European Economic Area — where we
              use cloud services or infrastructure providers.
            </Paragraph>
            <Paragraph>
              Our primary cloud infrastructure is hosted on <strong>Microsoft Azure</strong>.
              Where personal data is transferred outside the Philippines or the EEA, we rely
              on one or more of the following safeguards:
            </Paragraph>
            <BulletList items={[
              'Standard Contractual Clauses (SCCs) approved by the European Commission',
              'An adequacy decision by the relevant supervisory authority',
              'Data-processing agreements that impose equivalent data-protection obligations on the recipient',
            ]} />
            <Paragraph>
              You may request details of the specific safeguards in place for any transfer
              by contacting our Data Privacy Officer.
            </Paragraph>
            <Paragraph>
              Where personal data is transferred internationally, we assess risks on a
              case-by-case basis and implement supplementary safeguards where necessary,
              in line with applicable data protection guidance.
            </Paragraph>

            {/* 6. Cookies */}
            <SectionHeading id="cookies">
              6. Cookies &amp; Tracking
            </SectionHeading>
            <Paragraph>
              We use a limited number of <strong>first-party cookies and browser storage
              technologies</strong> to operate and improve our website.
            </Paragraph>
            <Paragraph>
              Non-essential cookies (including analytics) are <strong>not placed unless you
              provide explicit consent</strong> via the cookie banner. You may accept or
              decline these cookies, and your choice will be respected.
            </Paragraph>
            <Paragraph>
              Our analytics are <strong>first-party only</strong> and used exclusively to
              generate <strong>aggregated, anonymised insights</strong> about website usage.
              These analytics do not identify individual users.
            </Paragraph>
            <Paragraph>
              You may withdraw or modify your consent at any time via the "Cookie Preferences"
              link in the site footer.
            </Paragraph>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">Name</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">Type</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">Purpose</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-500 px-4 py-3">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    ['haven-cookie-consent', 'localStorage', 'Stores your cookie consent choice (accepted / declined)', 'Never (until cleared or reset)'],
                    ['haven-session', 'Session cookie', 'Maintains your authenticated session', 'Session end'],
                    ['_analytics', 'Analytics cookie', 'Anonymised page-view statistics (only if accepted)', '13 months'],
                  ].map(([name, type, purpose, expires]) => (
                    <tr key={name} className="hover:bg-stone-50 transition-colors duration-100">
                      <td className="px-4 py-3 font-mono text-xs text-stone-700">{name}</td>
                      <td className="px-4 py-3 text-stone-500">{type}</td>
                      <td className="px-4 py-3 text-stone-700">{purpose}</td>
                      <td className="px-4 py-3 text-stone-500">{expires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paragraph>
              You can withdraw or change your cookie consent at any time by clicking the
              "Cookie Preferences" link in the site footer, or by clearing the{' '}
              <code className="text-xs bg-stone-100 px-1 py-0.5 rounded font-mono">
                haven-cookie-consent
              </code>{' '}
              key from your browser's local storage. Declining analytics cookies does not
              affect any functionality of the website.
            </Paragraph>

            {/* 7. Data Retention */}
            <SectionHeading id="data-retention">
              7. Data Retention
            </SectionHeading>
            <Paragraph>
              We retain personal data only for as long as necessary for the purpose it was
              collected, or as required by law.
            </Paragraph>
            <BulletList items={[
              'Donor account data: retained for the lifetime of the account plus 7 years (financial record requirements)',
              'Donation transaction records: 7 years from the date of the donation (tax and audit compliance)',
              'Contact / enquiry messages: 2 years from last correspondence',
              'Website analytics data: 13 months, then automatically deleted or anonymised',
              'Resident case records: retained per DSWD standards and applicable Philippine law — typically until the resident reaches adulthood plus a defined review period',
            ]} />
            <Paragraph>
              When data is no longer required, it is securely deleted or anonymised so that
              it can no longer be linked to an individual.
            </Paragraph>

            {/* 8. Your Rights */}
            <SectionHeading id="your-rights">
              8. Your Rights
            </SectionHeading>
            <Paragraph>
              Under GDPR and the Philippine Data Privacy Act, you have the following rights
              regarding your personal data:
            </Paragraph>
            <BulletList items={[
              'Right to access — request a copy of the personal data we hold about you',
              'Right to rectification — ask us to correct inaccurate or incomplete data',
              'Right to erasure ("right to be forgotten") — request deletion of your personal data, subject to our legal retention obligations',
              'Right to restriction of processing — ask us to limit how we use your data',
              'Right to data portability — receive your data in a structured, machine-readable format',
              'Right to object — object to processing based on legitimate interest or for direct marketing',
              'Right to withdraw consent — where processing is based on consent, withdraw it at any time without affecting prior processing',
              'Right to lodge a complaint — with the Philippine National Privacy Commission (NPC) or your local data protection authority',
            ]} />
            <Paragraph>
              To exercise any of these rights, please email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="text-haven-teal-600 hover:text-haven-teal-700 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>. We will respond within 30 days. We may ask you to verify your identity
              before fulfilling a request.
            </Paragraph>
            <Paragraph>
              If you are located in the European Economic Area (EEA), you may also lodge a
              complaint with your <strong>local data protection supervisory authority</strong>.
            </Paragraph>

            {/* 9. Security */}
            <SectionHeading id="security">
              9. Security Measures
            </SectionHeading>
            <Paragraph>
              We implement appropriate technical and organisational measures to protect
              your personal data against unauthorised access, loss, or destruction, including:
            </Paragraph>
            <BulletList items={[
              'HTTPS / TLS encryption for all data in transit between your browser and our servers',
              'Encrypted storage of passwords using industry-standard hashing (bcrypt)',
              'Role-based access control — staff can only access data relevant to their role',
              'Azure-hosted infrastructure with automated security patching and backups',
              'Strong password requirements enforced on all staff and admin accounts',
              'Optional multi-factor authentication available for all account holders',
              'Regular internal security reviews as part of the IS 414 security programme',
            ]} />
            <Paragraph>
              No transmission of data over the internet is 100% secure. If you believe your
              data has been compromised, please contact us immediately.
            </Paragraph>
            <Paragraph>
              <strong>Data Breach Notification</strong>
            </Paragraph>
            <Paragraph>
              In the event of a personal data breach, we will assess the risk to individuals
              and, where required, notify the appropriate supervisory authority within 72 hours
              and affected individuals without undue delay.
            </Paragraph>

            {/* 10. Children's Privacy */}
            <SectionHeading id="children">
              10. Children&apos;s Privacy
            </SectionHeading>
            <Paragraph>
              Our public website is not directed at children under the age of 18, and we do
              not <strong>knowingly</strong> collect personal data from children. If you
              believe a child has provided personal information without appropriate consent,
              please contact us and we will delete it promptly.
            </Paragraph>
            <Paragraph>
              Data relating to the minor residents in our care is handled exclusively through
              the internal staff portal under the strict protections described in Section 3.
              Residents are never identified by name or photograph on the public website.
            </Paragraph>

            {/* 10A. DPIAs */}
            <SectionHeading id="dpia">
              10A. Data Protection Impact Assessments
            </SectionHeading>
            <Paragraph>
              Given the sensitive nature of the data we process—particularly relating to
              vulnerable individuals—we conduct <strong>Data Protection Impact Assessments
              (DPIAs)</strong> where processing is likely to result in a high risk to
              individuals' rights and freedoms.
            </Paragraph>
            <Paragraph>
              These assessments ensure that risks are identified and mitigated before
              processing begins.
            </Paragraph>

            {/* 11. Changes */}
            <SectionHeading id="changes">
              11. Changes to This Policy
            </SectionHeading>
            <Paragraph>
              We may update this privacy policy from time to time. When we make material
              changes, we will update the effective date at the top of this page and notify
              registered users by email at least 14 days before the changes take effect.
              Where any change requires a new legal basis for processing (for example,
              expanding the purposes for which we use your data), we will seek fresh consent
              from affected individuals before proceeding.
            </Paragraph>
            <Paragraph>
              Continued browsing of the website does not constitute consent to changed data
              processing. If you object to material changes, you may request deletion of your
              account by contacting us before the revised policy takes effect.
            </Paragraph>

            {/* 12. Contact */}
            <SectionHeading id="contact">
              12. Contact Us
            </SectionHeading>
            <Paragraph>
              If you have any questions about this privacy policy, wish to exercise your
              rights, or want to report a concern, please contact:
            </Paragraph>
            <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 text-sm text-stone-700">
              <p className="font-semibold text-stone-900 mb-1">Haven — Data Privacy Officer</p>
              <p>
                Email:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="text-haven-teal-600 hover:text-haven-teal-700 underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p className="mt-2 text-stone-500 text-xs">
                For complaints relating to Philippine data subjects, you may also contact
                the <strong>National Privacy Commission (NPC)</strong> at{' '}
                <span className="font-medium">privacy.gov.ph</span>.
              </p>
            </div>

            {/* Divider */}
            <div className="mt-12 pt-6 border-t border-stone-200">
              <p className="text-xs text-stone-400">
                This policy was last updated on {POLICY_DATE}. Previous versions are
                available on request.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
