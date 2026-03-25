import { motion } from "framer-motion";

const logos = [
  { src: "/logos/northbridge-gc.svg", alt: "Northbridge GC" },
  { src: "/logos/civicworks.svg", alt: "CivicWorks" },
  { src: "/logos/summit-build.svg", alt: "Summit Build" },
  { src: "/logos/ironclad-industrial.svg", alt: "Ironclad Industrial" },
  { src: "/logos/metroline-contractors.svg", alt: "Metroline Contractors" },
];

export default function LogoStrip() {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex items-center gap-10 md:gap-14"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div key={`${logo.alt}-${i}`} className="h-10 md:h-12 opacity-80 hover:opacity-100 transition-opacity">
            <img src={logo.src} alt={logo.alt} className="h-full w-auto" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
