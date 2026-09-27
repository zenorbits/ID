import { useRef } from "react";
import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, Download, ArrowUpRight } from "lucide-react";
import useScrollBlur from "../effects/Usescrollblur";

const digits = (value) => value.replace(/\D/g, "");

// Escape characters that are special inside vCard text values.
const vcardText = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

const buildRows = (member) => {
  const whatsapp = digits(member.whatsapp || member.phone);
  return [
    member.linkedin && {
      icon: <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />,
      label: "LINKEDIN",
      href: member.linkedin,
    },
    member.instagram && {
      icon: <FaInstagram className="w-6 h-6 text-[#E1306C]" />,
      label: "INSTAGRAM",
      href: member.instagram,
    },
    whatsapp && {
      icon: <FaWhatsapp className="w-6 h-6 text-[#25D366]" />,
      label: "WHATSAPP",
      href: `https://wa.me/${whatsapp}`,
    },
    member.email && {
      icon: <Mail className="w-6 h-6 text-neutral-200" strokeWidth={1.6} />,
      label: "EMAIL",
      href: `mailto:${member.email}`,
    },
    member.phone && {
      icon: <Phone className="w-6 h-6 text-neutral-200" strokeWidth={1.6} />,
      label: "PHONE",
      href: `tel:${member.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: <Download className="w-6 h-6 text-green-400" strokeWidth={1.6} />,
      label: "SAVE TO CONTACTS",
      subtitle: "MES College Committee",
      isDownload: true,
    },
  ].filter(Boolean);
};

export default function SocialMedia({ member }) {
  const sectionRef = useRef(null);
  useScrollBlur(sectionRef);
  const rows = buildRows(member);

  const handleSaveContact = () => {
    // Generate vCard for quick contact saving
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${vcardText(member.name)}`,
      `TITLE:${vcardText(member.role)}`,
      `ORG:${vcardText(member.committee)};${vcardText(member.college)}`,
      member.email && `EMAIL:${vcardText(member.email)}`,
      member.phone && `TEL:${vcardText(member.phone)}`,
      "NOTE:Official TPC Digital Pass 2026-2027",
      "END:VCARD",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${member.name.replace(/[^\w]+/g, "_")}_TPC.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={sectionRef}
      className="w-full flex justify-center py-2 px-4 scroll-blur-container"
    >
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        <div className="text-center mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-1">
            TRAIN POTENTIAL • PROMOTE SKILLS
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
