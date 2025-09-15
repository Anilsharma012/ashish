 ai_main_e305f8c35a55
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";

interface PublicSettings {
  success: boolean;
  data: {
    general?: {
      siteName?: string;
      contactEmail?: string;
      contactPhone?: string;
      address?: string;
    };
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    updatedAt?: string;
  };
}

export default function PrivacyPolicy() {
  const [settings, setSettings] = useState<PublicSettings["data"] | null>(null);
  const [effectiveDate, setEffectiveDate] =
    useState<string>("15 September 2025");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const json: PublicSettings = await res.json();
        if (json?.success && json?.data) {
          setSettings(json.data);
          const d = json.data.updatedAt || new Date().toISOString();
          setEffectiveDate(new Date(d).toLocaleDateString());
        }
      } catch {}
    };
    load();
  }, []);

  const siteName = settings?.general?.siteName || "Aashish Property";
  const email =
    settings?.contact?.email ||
    settings?.general?.contactEmail ||
    "support@aashishproperty.com";
  const phone =
    settings?.contact?.phone ||
    settings?.general?.contactPhone ||
    "+91 9876543210";
  const address =
    settings?.contact?.address ||
    settings?.general?.address ||
    "Rohtak, Haryana, India";

  // SEO
  useEffect(() => {
    const title = "Privacy Policy | Ashish Property";
    const desc =
      "How Ashish Property collects, uses, and safeguards your data. Read our privacy practices and your rights.";
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const toc = useMemo(
    () => [
      { id: "introduction", label: "Introduction" },
      { id: "data-we-collect", label: "Data We Collect" },
      { id: "use-of-data", label: "Use of Data" },
      { id: "legal-basis", label: "Legal Basis / Consent" },
      { id: "sharing", label: "Sharing" },
      { id: "retention", label: "Retention" },
      { id: "your-rights", label: "Your Rights" },
      { id: "children", label: "Children" },
      { id: "security", label: "Security" },
      { id: "cookies", label: "Cookies" },
      { id: "third-party-links", label: "Third-Party Links" },
      { id: "contact", label: "Contact / Grievance Officer" },
      { id: "changes", label: "Changes" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Last Updated: {effectiveDate}
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Table of Contents */}
        <nav
          aria-label="Table of contents"
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Contents</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-[#C70000]">
            {toc.map((t) => (
              <li key={t.id}>
                <a className="hover:underline" href={`#${t.id}`}>
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <article className="space-y-10">
          <section
            id="introduction"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              1) Introduction
            </h2>
            <p className="text-gray-700">
              This Privacy Policy explains how Ashish Property (“we”, “us”,
              “our”) collects, uses, and protects information when you use our
              website, services, and communication channels in India.
            </p>
          </section>

          <section
            id="data-we-collect"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              2) Information We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>
                <strong>Provided by you:</strong> Name, phone, email,
                requirements, location preferences, budget, and property
                details.
              </li>
              <li>
                <strong>Automatic:</strong> Device info, cookies, and basic
                analytics for improving experience.
              </li>
              <li>
                <strong>From third parties:</strong> Lead portals, banking
                partners (with consent), and public records for verification.
              </li>
            </ul>
          </section>

          <section
            id="use-of-data"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              3) How We Use Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>
                To provide and improve services, share curated listings,
                schedule site visits, and close transactions.
              </li>
              <li>
                To communicate updates, offers, and service notifications via
                call/SMS/WhatsApp/email.
              </li>
              <li>For fraud prevention, legal compliance, and analytics.</li>
            </ul>
          </section>

          <section
            id="legal-basis"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              4) Legal Basis / Consent
            </h2>
            <p className="text-gray-700">
              We process data based on your consent, to perform a contract
              (service request), our legitimate interests, and compliance with
              applicable laws.
            </p>
          </section>

          <section id="sharing" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              5) Sharing of Information
            </h2>
            <p className="text-gray-700">
              With property owners, buyers/tenants, service partners, banks, and
              legal/documentation teams for fulfilling your request. With
              analytics and hosting providers to operate our website. We do not
              sell your personal data.
            </p>
          </section>

          <section id="retention" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              6) Retention
            </h2>
            <p className="text-gray-700">
              We keep data as long as necessary for services, legal, and tax
              compliance, then delete/ anonymize it.
            </p>
          </section>

          <section
            id="your-rights"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              7) Your Rights
            </h2>
            <p className="text-gray-700">
              Access, correction, deletion, and withdrawal of consent (subject
              to legal limits). To exercise rights, contact our Grievance
              Officer.
            </p>
          </section>

          <section id="children" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              8) Children’s Privacy
            </h2>
            <p className="text-gray-700">
              Services are intended for individuals 18+ or under guardian
              supervision.
            </p>
          </section>

          <section id="security" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              9) Security
            </h2>
            <p className="text-gray-700">
              We use reasonable safeguards but no method is 100% secure. Share
              sensitive data with caution.
            </p>
          </section>

          <section id="cookies" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              10) Cookies
            </h2>
            <p className="text-gray-700">
              We use essential and analytics cookies. You can manage cookies in
              your browser settings.
            </p>
          </section>

          <section
            id="third-party-links"
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              11) Third-Party Links
            </h2>
            <p className="text-gray-700">
              External sites have their own policies; we’re not responsible for
              their practices.
            </p>
          </section>

          <section id="contact" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              12) Contact / Grievance Officer
            </h2>
            <div className="text-gray-700 space-y-1">
              <p>
                <strong>Name:</strong> 📌 Officer Name
              </p>
              <p>
                <strong>Email:</strong> privacy@ashishproperty.in
              </p>
              <p>
                <strong>Phone:</strong> +91-XXXXXXXXXX
              </p>
              <p>
                <strong>Address:</strong> 📌 Full postal address
              </p>
            </div>
          </section>

          <section id="changes" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              13) Changes to Policy
            </h2>
            <p className="text-gray-700">
              We may update this Policy; the “Last Updated” date will change
              accordingly. Note: This is general information, not legal advice.
              For strict compliance (e.g., DPDP Act 2023), consult your legal
              advisor.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
=======
import React, { useEffect } from "react";
import OLXStyleHeader from "../components/OLXStyleHeader";
import CategoryBar from "../components/CategoryBar";
import BottomNavigation from "../components/BottomNavigation";
import StaticFooter from "../components/StaticFooter";

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(
    `meta[name='${name}']`,
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Ashish Property";
    setMetaTag(
      "description",
      "How Ashish Property collects, uses, and safeguards your data. Read our privacy practices and your rights.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <OLXStyleHeader />
      <main className="pb-16">
        <CategoryBar />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Last Updated: 15 September 2025
            </p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                This Privacy Policy explains how Ashish Property (“we”, “us”,
                “our”) collects, uses, and protects information when you use our
                website, services, and communication channels in India.
              </p>

              <Section title="Information We Collect">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <span className="font-medium">Provided by you:</span> Name,
                    phone, email, requirements, location preferences, budget,
                    and property details.
                  </li>
                  <li>
                    <span className="font-medium">Automatic:</span> Device info,
                    cookies, and basic analytics for improving experience.
                  </li>
                  <li>
                    <span className="font-medium">From third parties:</span>{" "}
                    Lead portals, banking partners (with consent), and public
                    records for verification.
                  </li>
                </ul>
              </Section>

              <Section title="How We Use Information">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    To provide and improve services, share curated listings,
                    schedule site visits, and close transactions.
                  </li>
                  <li>
                    To communicate updates, offers, and service notifications
                    via call/SMS/WhatsApp/email.
                  </li>
                  <li>
                    For fraud prevention, legal compliance, and analytics.
                  </li>
                </ul>
              </Section>

              <Section title="Legal Basis/Consent">
                <p>
                  We process data based on your consent, to perform a contract
                  (service request), our legitimate interests, and compliance
                  with applicable laws.
                </p>
              </Section>

              <Section title="Sharing of Information">
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    With property owners, buyers/tenants, service partners,
                    banks, and legal/documentation teams for fulfilling your
                    request.
                  </li>
                  <li>
                    With analytics and hosting providers to operate our website.
                  </li>
                  <li>We do not sell your personal data.</li>
                </ul>
              </Section>

              <Section title="Retention">
                <p>
                  We keep data as long as necessary for services, legal, and tax
                  compliance, then delete/ anonymize it.
                </p>
              </Section>

              <Section title="Your Rights">
                <p>
                  Access, correction, deletion, and withdrawal of consent
                  (subject to legal limits). To exercise rights, contact our
                  Grievance Officer.
                </p>
              </Section>

              <Section title="Security">
                <p>
                  We use reasonable safeguards but no method is 100% secure.
                  Share sensitive data with caution.
                </p>
              </Section>

              <Section title="Cookies">
                <p>
                  We use essential and analytics cookies. You can manage cookies
                  in your browser settings.
                </p>
              </Section>

              <Section title="Third-Party Links">
                <p>
                  External sites have their own policies; we’re not responsible
                  for their practices.
                </p>
              </Section>

              <Section title="Children’s Privacy">
                <p>
                  Services are intended for individuals 18+ or under guardian
                  supervision.
                </p>
              </Section>

              <Section title="Changes to Policy">
                <p>
                  We may update this Policy; the “Last Updated” date will change
                  accordingly.
                </p>
              </Section>

              <Section title="Contact / Grievance Officer">
                <p>
                  Name: 📌 Officer Name
                  <br />
                  Email: privacy@ashishproperty.in
                  <br />
                  Phone: +91-XXXXXXXXXX
                  <br />
                  Address: 📌 Full postal address
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Note: This is general information, not legal advice. For
                  strict compliance (e.g., DPDP Act 2023), consult your legal
                  advisor.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
      <StaticFooter />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
 main
