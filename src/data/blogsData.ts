import onionImg from '../assets/products/onion.avif';
import shipImg from '../assets/process/ship-delivery.jpg';
import documentingImg from '../assets/process/documenting.avif';

export interface BlogSection {
  sectionTitle?: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  sections: BlogSection[];
  createdAt?: string;
}

export const blogsData: BlogPost[] = [
  {
    slug: 'why-indian-red-onions-dominate-asian-import-markets',
    title: 'Why Indian Red Onions Dominate Asian Import Markets',
    description:
      "India accounts for over 65% of Asia's onion import volumes — a figure that has held remarkably stable through years of price volatility and shifting trade policy.",
    image: onionImg,
    imageAlt: 'Fresh export quality red onions packed in crates',
    sections: [
      {
        sectionTitle: 'The Lasalgaon Advantage',
        description:
          "Nashik's Lasalgaon is the single largest onion trading platform in Asia by volume. On a typical October morning, over 8,000 MT changes hands before noon. This concentration of supply creates price discovery that is globally benchmarked — traders in Colombo, Dubai, and Kuala Lumpur monitor Lasalgaon rates daily.",
      },
      {
        sectionTitle: 'Varietal Diversity',
        description:
          'India exports at least 14 distinct onion varieties ranging from mild, sweet Puna white to the pungent Nashik red. This range allows Indian exporters to serve a wide spectrum of culinary markets — from the mild-flavour preference of Singaporean buyers to the high-pungency requirements of South Asian communities across the Middle East.',
      },
      {
        sectionTitle: 'Cold Chain Maturity',
        description:
          "Since 2018, the National Horticulture Mission has funded over 340 cold storage facilities in Maharashtra's onion belt. Pre-cooling within 6 hours of harvest has reduced post-harvest loss from a historical 35% to under 12% for export lots.",
      },
      {
        sectionTitle: 'What This Means for Importers',
        description:
          "For buyers looking to reduce supply chain risk, India's depth of supply means you are unlikely to face genuine scarcity — only price volatility during seasonal transitions. Working with a reliable Indian exporter who can lock in pricing across seasons is the single most effective risk-mitigation strategy.",
      },
    ],
  },
  {
    slug: 'export-documentation-checklist-for-first-time-importers',
    title: 'Export Documentation Checklist for First-Time Importers',
    description:
      'A clear guide to the paperwork trail between an Indian exporter and an overseas port — phytosanitary certificates, bills of lading, COOs, and buyer-side requirements.',
    image: shipImg,
    imageAlt: 'Cargo container ship and shipping port terminal cranes',
    sections: [
      {
        sectionTitle: 'Core Export Documentation Set',
        description:
          'Every sea freight shipment leaving India requires a mandatory set of compliance and title documents. These include the Commercial Invoice, Packing List, Bill of Lading (B/L) issued by the shipping line, and Certificate of Origin (COO) verified by the authorized Chamber of Commerce.',
      },
      {
        sectionTitle: 'Phytosanitary & Quarantine Clearance',
        description:
          'Fresh agricultural exports undergo stringent inspection by the Plant Quarantine Organization of India (PQOI). An official Phytosanitary Certificate guarantees that produce is free from quarantine pests, noxious weeds, and meets target country phytosanitary regulations.',
      },
      {
        sectionTitle: 'Customs & Port Handover',
        description:
          'Pre-shipment verification and custom clearance at Indian gateways such as JNPT (Nhava Sheva) and Cochin Port ensure that container seals and temperature monitoring data loggers are locked and documented before vessel departure.',
      },
      {
        sectionTitle: 'Best Practices for First-Time Buyers',
        description:
          'Always verify draft documents prior to sailing to prevent destination demurrage. Establishing direct communication channels with your exporter ensures continuous tracking and prompt release of original documents via courier or electronic telex release.',
      },
    ],
  },
  {
    slug: 'understanding-apeda-certification-a-buyers-guide',
    title: 'Understanding APEDA Certification: A Buyer’s Guide',
    description:
      'APEDA — the Agricultural and Processed Food Products Export Development Authority — is the Indian government body mandated under the APEDA Act, 1985 to develop and promote the export of scheduled products.',
    image: documentingImg,
    imageAlt: 'Business partners reviewing and signing export certification documents',
    sections: [
      {
        sectionTitle: 'The Role of APEDA in Agro-Exports',
        description:
          'Operating under the Ministry of Commerce and Industry, APEDA enforces rigorous quality benchmarks, traceability systems (like HortiNet and Peanut.net), and infrastructure standards across registered packhouses, processing units, and merchant exporters.',
      },
      {
        sectionTitle: 'Pesticide Residue & Laboratory Protocols',
        description:
          'APEDA-recognized laboratories test export consignments against global Maximum Residue Limits (MRLs). Products destined for stringent markets like the EU, GCC, and ASEAN undergo accredited testing to certify compliance with importing nation food safety directives.',
      },
      {
        sectionTitle: 'Packhouse Accreditation & Grading',
        description:
          'Certified export packhouses must comply with strict hygiene, sorting, sizing, and post-harvest handling guidelines. This structural compliance guarantees uniform carton weights, proper ventilation, and reduced microbial risk throughout ocean transit.',
      },
      {
        sectionTitle: 'Why Working With APEDA-Registered Exporters Matters',
        description:
          'Partnering with an APEDA-registered exporter gives foreign buyers institutional assurance of legitimate trade credentials, prompt customs processing, and adherence to international agri-food standards.',
      },
    ],
  },
];
