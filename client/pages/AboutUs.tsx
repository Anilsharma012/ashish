import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ShieldCheck, Zap, HeartHandshake, Award } from "lucide-react";
import Footer from "../components/Footer";

interface PublicSettings {
  success: boolean;
  data: {
    general?: {
      siteName?: string;
      siteDescription?: string;
      siteUrl?: string;
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

export default function AboutUs() {
  const [settings, setSettings] = useState<PublicSettings["data"] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const json: PublicSettings = await res.json();
        if (json?.success && json?.data) {
          setSettings(json.data);
          setLastUpdated(json.data.updatedAt || new Date().toISOString());
        }
      } catch {}
    };
    load();
  }, []);

  const siteName = settings?.general?.siteName || "Aashish Property";
  const address = settings?.contact?.address || settings?.general?.address || "Rohtak, Haryana";
  const phone = settings?.contact?.phone || settings?.general?.contactPhone || "+91 9876543210";
  const city = useMemo(() => {
    const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
    return parts[0] || "Rohtak";
  }, [address]);
  const state = useMemo(() => {
    const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
    return parts[1] || "Haryana";
  }, [address]);

  // Compute derived values
  const startedYear = 2021;
  const years = new Date().getFullYear() - startedYear;
  const customers = 1000; // conservative default
  const rating = 4.8;

  const whatsAppLink = useMemo(() => {
    const digits = (phone || "").replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : "https://wa.me/919876543210";
  }, [phone]);

  // SEO
  useEffect(() => {
    const title = `About ${siteName}`;
    const desc = `About ${siteName} in ${city}, ${state}. We help buyers, sellers, renters, and businesses with trusted property solutions and related services in ${city}.`;
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [siteName, city, state]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            About {siteName}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We help buyers, sellers, renters, and businesses with property needs and reliable home services in {city}.
          </p>
        </div>
      </header>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                {siteName} brings reliable property solutions and on-demand home services to homes and businesses across {city}. We focus on transparent pricing, punctual visits, and lasting fixes.
              </p>
              <p>
                Simple booking, upfront quotes, tracked jobs, and feedback-driven quality control keep your experience smooth and predictable.
              </p>
              <p>
                Background-verified professionals, standard checklists, and secure payments ensure trust and safety for every job.
              </p>
            </div>

            <ul className="mt-6 grid sm:grid-cols-3 gap-3">
              <li className="flex items-center text-gray-800">
                <Zap className="h-5 w-5 text-[#C70000] mr-2" /> Fast service
              </li>
              <li className="flex items-center text-gray-800">
                <ShieldCheck className="h-5 w-5 text-[#C70000] mr-2" /> Verified experts
              </li>
              <li className="flex items-center text-gray-800">
                <Award className="h-5 w-5 text-[#C70000] mr-2" /> Fair pricing
              </li>
            </ul>
          </div>

          {/* Numbers strip */}
          <aside className="bg-white rounded-lg shadow-sm p-6" aria-label="Key numbers">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">+{years}</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{customers}+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{rating}★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
            {lastUpdated && (
              <p className="mt-4 text-xs text-gray-500">Updated {new Date(lastUpdated).toLocaleDateString()}</p>
            )}
          </aside>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Integrity</h3>
              <p className="text-gray-700 text-sm">Honest guidance and transparent pricing every time.</p>
            </div>
            <div className="p-5 rounded-lg border bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Speed</h3>
              <p className="text-gray-700 text-sm">Prompt responses, quick scheduling, and on-time visits.</p>
            </div>
            <div className="p-5 rounded-lg border bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Quality</h3>
              <p className="text-gray-700 text-sm">Standard checklists and feedback-driven improvements.</p>
            </div>
            <div className="p-5 rounded-lg border bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Support</h3>
              <p className="text-gray-700 text-sm">Friendly help through phone and WhatsApp when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[#C70000]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Need help now?</h2>
            <p className="opacity-90">Talk to our team in {city}. We are here to help.</p>
          </div>
          <div className="flex gap-3">
            <a
              aria-label={`Call ${siteName}`}
              href={`tel:${phone}`}
              className="inline-flex items-center px-4 py-2 bg-white text-[#C70000] font-medium rounded-md hover:bg-gray-100 active:scale-98"
            >
              <Phone className="h-4 w-4 mr-2" /> Call
            </a>
            <a
              aria-label={`WhatsApp ${siteName}`}
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-white text-white font-medium rounded-md hover:bg-white hover:text-[#C70000] active:scale-98"
            >
              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
