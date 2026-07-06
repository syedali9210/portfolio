import Image from "next/image";
import FooterWave from "@/components/FooterWave";

const CONTACT_INFO = [
  { label: "Call", icon: "/images/icon.svg", value: "776 586 3700" },
  { label: "Email", icon: "/images/icon-1.svg", value: "syedwali9286@gmail.com" },
  { label: "Linkedin", icon: "/images/frame-47.svg", value: "Syed_ali" },
];

// Soft top-to-bottom silver gradient shared by every label in the footer.
const LABEL =
  "bg-gradient-to-b from-[#d1d1d1] to-[#6b6b6b] bg-clip-text font-body tracking-[0.8px] text-transparent";

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-24 sm:px-10">
      <div className="relative mx-auto flex max-w-[1320px] flex-col overflow-hidden rounded-2xl border-[0.5px] border-white/26 bg-gradient-to-b from-white/10 to-[#999999]/10 px-6 pt-10 shadow-[0px_10px_5px_rgba(0,0,0,0.15)] backdrop-blur-[48px] sm:px-[90px] sm:pt-[46px]">
        {/* top: contact details on the left, a closing note on the right */}
        <div className="flex flex-col gap-10 border-b border-[#5f5f5f] pb-6 md:flex-row md:justify-between md:gap-[116px]">
          <div className="flex flex-col gap-12 sm:gap-[84px]">
            <p className={`${LABEL} text-lg sm:text-xl`}>Syed Ali</p>

            <div className="flex flex-wrap gap-8 sm:gap-[63px]">
              {CONTACT_INFO.map((item) => (
                <div key={item.label} className="flex flex-col gap-2.5">
                  <p className={`${LABEL} text-lg sm:text-xl`}>{item.label}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="relative size-4 shrink-0">
                      <Image src={item.icon} alt="" fill />
                    </div>
                    <p className="font-pixel text-base tracking-[0.8px] text-[#d1d1d1] sm:text-xl">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 md:h-[132px] md:items-end md:justify-between md:text-right">
            <p className={`${LABEL} text-lg sm:text-xl`}>Design Engineer</p>
            <p className={`${LABEL} max-w-[353px] text-lg leading-relaxed sm:text-xl`}>
              You have been here till the end of the journey, lets have a conversation now.
            </p>
          </div>
        </div>

        {/* "CONTACT" rides the hills of the wave beneath it, so this needs
            headroom above the wave's own box for the letters to rise into
            without getting clipped by the panel's rounded corners. */}
        <div className="-mx-6 mt-6 sm:-mx-[90px]">
          <FooterWave />
        </div>
      </div>
    </section>
  );
}
