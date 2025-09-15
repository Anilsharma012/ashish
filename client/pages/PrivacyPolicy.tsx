import React, { useEffect } from "react";
import OLXStyleHeader from "../components/OLXStyleHeader";
import CategoryBar from "../components/CategoryBar";
import BottomNavigation from "../components/BottomNavigation";
import StaticFooter from "../components/StaticFooter";

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null;
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
      "How Ashish Property collects, uses, and safeguards your data. Read our privacy practices and your rights."
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <OLXStyleHeader />
      <main className="pb-16">
        <CategoryBar />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-6">Last Updated: 15 September 2025</p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                This Privacy Policy explains how Ashish Property (“we”, “us”, “our”) collects, uses, and protects information when you use our website, services, and communication channels in India.
              </p>

              <Section title="Information We Collect">
                <ul className="list-disc pl-6 space-y-1">
                  <li><span className="font-medium">Provided by you:</span> Name, phone, email, requirements, location preferences, budget, and property details.</li>
                  <li><span className="font-medium">Automatic:</span> Device info, cookies, and basic analytics for improving experience.</li>
                  <li><span className="font-medium">From third parties:</span> Lead portals, banking partners (with consent), and public records for verification.</li>
                </ul>
              </Section>

              <Section title="How We Use Information">
                <ul className="list-disc pl-6 space-y-1">
                  <li>To provide and improve services, share curated listings, schedule site visits, and close transactions.</li>
                  <li>To communicate updates, offers, and service notifications via call/SMS/WhatsApp/email.</li>
                  <li>For fraud prevention, legal compliance, and analytics.</li>
                </ul>
              </Section>

              <Section title="Legal Basis/Consent">
                <p>We process data based on your consent, to perform a contract (service request), our legitimate interests, and compliance with applicable laws.</p>
              </Section>

              <Section title="Sharing of Information">
                <ul className="list-disc pl-6 space-y-1">
                  <li>With property owners, buyers/tenants, service partners, banks, and legal/documentation teams for fulfilling your request.</li>
                  <li>With analytics and hosting providers to operate our website.</li>
                  <li>We do not sell your personal data.</li>
                </ul>
              </Section>

              <Section title="Retention">
                <p>We keep data as long as necessary for services, legal, and tax compliance, then delete/ anonymize it.</p>
              </Section>

              <Section title="Your Rights">
                <p>Access, correction, deletion, and withdrawal of consent (subject to legal limits). To exercise rights, contact our Grievance Officer.</p>
              </Section>

              <Section title="Security">
                <p>We use reasonable safeguards but no method is 100% secure. Share sensitive data with caution.</p>
              </Section>

              <Section title="Cookies">
                <p>We use essential and analytics cookies. You can manage cookies in your browser settings.</p>
              </Section>

              <Section title="Third-Party Links">
                <p>External sites have their own policies; we’re not responsible for their practices.</p>
              </Section>

              <Section title="Children’s Privacy">
                <p>Services are intended for individuals 18+ or under guardian supervision.</p>
              </Section>

              <Section title="Changes to Policy">
                <p>We may update this Policy; the “Last Updated” date will change accordingly.</p>
              </Section>

              <Section title="Contact / Grievance Officer">
                <p>
                  Name: 📌 Officer Name<br />
                  Email: privacy@ashishproperty.in<br />
                  Phone: +91-XXXXXXXXXX<br />
                  Address: 📌 Full postal address
                </p>
                <p className="text-xs text-gray-500 mt-2">Note: This is general information, not legal advice. For strict compliance (e.g., DPDP Act 2023), consult your legal advisor.</p>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
