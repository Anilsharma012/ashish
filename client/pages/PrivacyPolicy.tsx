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
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toLocaleDateString());

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
  const email = settings?.contact?.email || settings?.general?.contactEmail || "support@aashishproperty.com";
  const phone = settings?.contact?.phone || settings?.general?.contactPhone || "+91 9876543210";
  const address = settings?.contact?.address || settings?.general?.address || "Rohtak, Haryana, India";

  // SEO
  useEffect(() => {
    const title = `Privacy Policy | ${siteName}`;
    const desc = `Read the Privacy Policy for ${siteName}. Learn how we collect, use, and protect your data.`;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [siteName]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-600 text-sm">Last Updated: {effectiveDate}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Table of Contents */}
        <nav aria-label="Table of contents" className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Contents</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-[#C70000]">
            {toc.map((t) => (
              <li key={t.id}>
                <a className="hover:underline" href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <article className="space-y-10">
          <section id="introduction" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">1) Introduction</h2>
            <p className="text-gray-700">
              We respect your privacy. This Privacy Policy explains how {siteName} collects, uses, and protects personal information in connection with our website, app, and services in India.
            </p>
          </section>

          <section id="data-we-collect" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">2) Data We Collect</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Provided: name, phone, email, address, service or property details.</li>
              <li>Automatic: device information, cookies, analytics data, and usage logs.</li>
            </ul>
          </section>

          <section id="use-of-data" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">3) Use of Data</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Provide and improve services, including scheduling and customer support.</li>
              <li>Safety, fraud prevention, and quality assurance.</li>
              <li>Communication (SMS/WhatsApp/email) about orders, quotes, and updates.</li>
            </ul>
          </section>

          <section id="legal-basis" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">4) Legal Basis / Consent</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Consent</li>
              <li>Contract performance</li>
              <li>Legitimate interests</li>
              <li>Legal compliance</li>
            </ul>
          </section>

          <section id="sharing" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">5) Sharing</h2>
            <p className="text-gray-700">
              We may share data with service professionals (for job fulfillment), payment processors, analytics providers, and to comply with the law. We do not sell personal data.
            </p>
          </section>

          <section id="retention" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">6) Retention</h2>
            <p className="text-gray-700">
              We retain data as required for operations, tax, and legal purposes, and delete or anonymize it thereafter.
            </p>
          </section>

          <section id="your-rights" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">7) Your Rights</h2>
            <p className="text-gray-700">
              You may request access, correction, deletion, and withdrawal of consent, and raise a grievance using the contact details below.
            </p>
          </section>

          <section id="children" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">8) Children</h2>
            <p className="text-gray-700">
              Our services are not intended for individuals under 18 without guardian consent.
            </p>
          </section>

          <section id="security" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">9) Security</h2>
            <p className="text-gray-700">
              We implement reasonable safeguards to protect information. However, no method of transmission or storage is 100% secure.
            </p>
          </section>

          <section id="cookies" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">10) Cookies</h2>
            <p className="text-gray-700">
              We use cookies for basic functionality and analytics. You can control cookies through your browser settings.
            </p>
          </section>

          <section id="third-party-links" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">11) Third-Party Links</h2>
            <p className="text-gray-700">
              Our website may contain links to external sites that have their own privacy policies.
            </p>
          </section>

          <section id="contact" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">12) Contact / Grievance Officer</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Name:</strong> Grievance Officer</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Phone:</strong> {phone}</p>
            </div>
          </section>

          <section id="changes" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">13) Changes</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. The new effective date will be reflected at the top of this page.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
