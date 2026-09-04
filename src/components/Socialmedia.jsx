import { FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, Download, ArrowUpRight } from "lucide-react";

const rows = [
  { icon: <FaLinkedin className="w-7 h-7 text-[#0A66C2]" />, label: "LINKEDIN" },
  { icon: <FaInstagram className="w-7 h-7 text-[#E1306C]" />, label: "INSTAGRAM" },
  { icon: <FaWhatsapp className="w-7 h-7 text-[#25D366]" />, label: "WHATSAPP" },
  { icon: <Mail className="w-7 h-7 text-neutral-200" strokeWidth={1.6} />, label: "EMAIL" },
  { icon: <Phone className="w-7 h-7 text-neutral-200" strokeWidth={1.6} />, label: "PHONE" },
  {
    icon: <Download className="w-7 h-7 text-neutral-200" strokeWidth={1.6} />,
    label: "SAVE TO CONTACTS",
    subtitle: "MES College Committee",
  },
];

export default function SocialMedia() {
  return (
    <div className=" w-full bg-black flex justify-center py-4 pt-20   px-3 ">
      <div className="w-full max-w-sm">
        {rows.map((row, i) => (
          <div key={row.label}>
            <button
              type="button"
              className="w-full flex items-center gap-4 py-4 group"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {row.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-bold text-[15px] tracking-wide">
                  {row.label}
                </div>
                {row.subtitle && (
                  <div className="text-gray-400 text-[13px] mt-0.5">
                    {row.subtitle}
                  </div>
                )}
              </div>
              <ArrowUpRight
                className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-gray-300 transition-colors"
                strokeWidth={1.8}
              />
            </button>
            {i < rows.length - 1 && <div className="h-px w-full bg-neutral-800" />}
          </div>
        ))}
      </div>
    </div>
  );
}