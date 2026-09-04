import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, Download, ArrowUpRight } from "lucide-react";
import useScrollBlur from "../effects/Usescrollblur";

const rows = [
  {
    icon: <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />,
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/chirayu-durgude/",
  },
  {
    icon: <FaInstagram className="w-6 h-6 text-[#E1306C]" />,
    label: "INSTAGRAM",
    href: "https://www.instagram.com/",
  },
  {
    icon: <FaWhatsapp className="w-6 h-6 text-[#25D366]" />,
    label: "WHATSAPP",
    href: "https://wa.me/",
  },
  {
    icon: <Mail className="w-6 h-6 text-neutral-200" strokeWidth={1.6} />,
    label: "EMAIL",
    href: "mailto:chirayudurgude@gmail.com",
  },
  {
    icon: <Phone className="w-6 h-6 text-neutral-200" strokeWidth={1.6} />,
    label: "PHONE",
    href: "tel:+919876543210",
  },
  {
    icon: <Download className="w-6 h-6 text-green-400" strokeWidth={1.6} />,
    label: "SAVE TO CONTACTS",
    subtitle: "MES College Committee",
    isDownload: true,
  },
];

export default function SocialMedia() {
  const isScrolling = useScrollBlur(150);

  const handleSaveContact = () => {
    // Generate vCard for quick contact saving
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Chirayu Durgude
TITLE:Technical Head
ORG:Training & Placement Cell; MES College of Engineering
EMAIL:chirayudurgude@gmail.com
NOTE:Official TPC Digital Pass 2026-2027
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Chirayu_Durgude_TPC.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`w-full flex justify-center py-6 px-4 transition-[filter] duration-300 ease-out ${
        isScrolling ? "blur-sm" : "blur-0"
      }`}
    >
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        <div className="text-center mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-1">
            Connect &amp; Verification
          </span>
        </div>

        {rows.map((row) => (
          <div key={row.label}>
            {row.isDownload ? (
              <button
                type="button"
                onClick={handleSaveContact}
                className="btn-3d w-full flex items-center gap-4 p-3.5 rounded-2xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-green-500/50 backdrop-blur-md group text-left cursor-pointer transition-all duration-300 shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {row.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-[14px] tracking-wide group-hover:text-green-400 transition-colors">
                    {row.label}
                  </div>
                  {row.subtitle && (
                    <div className="text-gray-400 text-[12px] mt-0.5">
                      {row.subtitle}
                    </div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-800/60 border border-neutral-700/50 group-hover:border-green-500/40 transition-colors">
                  <ArrowUpRight
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    strokeWidth={2}
                  />
                </div>
              </button>
            ) : (
              <a
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="btn-3d w-full flex items-center gap-4 p-3.5 rounded-2xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-green-500/50 backdrop-blur-md group text-left cursor-pointer transition-all duration-300 shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {row.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-[14px] tracking-wide group-hover:text-green-400 transition-colors">
                    {row.label}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-800/60 border border-neutral-700/50 group-hover:border-green-500/40 transition-colors">
                  <ArrowUpRight
                    className="w-4 h-4 text-gray-400 group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    strokeWidth={2}
                  />
                </div>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}