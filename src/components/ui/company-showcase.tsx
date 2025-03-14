import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DotPattern } from "./dot-pattern";

const companies = [
  {
    name: "Marvel",
    logo: "https://jeffreylancaster.com/marvel/img/marvel-logo-2.png",
    slug: "marvel"
  },
  {
    name: "Star Wars",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Star_wars2.svg/768px-Star_wars2.svg.png?20190404020335",
    slug: "star-wars"
  },
  {
    name: "DC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/DC_Comics_logo.svg/900px-DC_Comics_logo.svg.png",
    slug: "dc"
  },
  {
    name: "Warner Bros",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Warner_Bros_logo.svg/532px-Warner_Bros_logo.svg.png",
    slug: "warner-bros"
  },
  {
    name: "Universal Studios",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Universal_Pictures_logo.svg/1200px-Universal_Pictures_logo.svg.png",
    slug: "universal"
  },
  {
    name: "Nickelodeon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nickelodeon_2023_logo_%28outline%29.svg/768px-Nickelodeon_2023_logo_%28outline%29.svg.png",
    slug: "nickelodeon"
  },
  {
    name: "Pixar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Pixar_new_logo.svg/1200px-Pixar_new_logo.svg.png?20230324131505",
    slug: "pixar"
  },
];

export function CompanyShowcase() {
  const navigate = useNavigate();

  return (
    <div className="py-24 relative overflow-hidden">
      <DotPattern
        className="absolute inset-0 w-full h-full opacity-50"
        cx={1}
        cy={1}
        cr={1}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Featured Studios
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
          {companies.map((company, index) => (
            <motion.button
              key={company.name}
              onClick={() => navigate(`/studio/${company.slug}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-4 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative aspect-[3/2] flex items-center justify-center p-6">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}