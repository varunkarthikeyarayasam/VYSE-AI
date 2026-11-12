export interface HackathonEvent {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  category: "AI & Systems" | "National Innovation" | "Web3 & Blockchain" | "Robotics & Hardware" | "State Public Tech" | "Cybersecurity";
  dates: string;
  registrationDeadline: string;
  mode: "On-Campus" | "Hybrid" | "Virtual & Lab";
  venue: string;
  prizePool: string;
  teamSizeMin: number;
  teamSizeMax: number;
  minAttendanceRequired: number;
  allowedYears: number[];
  allowedDepartments?: string[];
  prerequisiteRule?: string;
  tags: string[];
  description: string;
  rules: string[];
}

export const SATHYABAMA_HACKATHONS: HackathonEvent[] = [
  {
    id: "codesprint-2026",
    title: "CodeSprint 2026: 24-Hour National Hackathon",
    shortTitle: "CodeSprint 2026",
    tagline: "Flagship 24-Hour National AI & Systems Hackathon",
    category: "AI & Systems",
    dates: "Sept 18 - 19, 2026",
    registrationDeadline: "Sept 16, 2026 (11:59 PM)",
    mode: "Hybrid",
    venue: "Dr. Remibai Jeppiaar Central Auditorium, Sathyabama Campus",
    prizePool: "₹1,50,000 + Direct FAANG Interview Shortcuts",
    teamSizeMin: 2,
    teamSizeMax: 4,
    minAttendanceRequired: 75,
    allowedYears: [2, 3, 4],
    tags: ["Generative AI", "Full-Stack", "Autonomous Agents", "Cloud"],
    description:
      "Sathyabama's signature 24-hour hackathon bringing together 500+ top collegiate developers across India to build agentic AI tools and enterprise software.",
    rules: [
      "Official University Attendance must be >= 75% for On-Duty (OD) issuance.",
      "Open to B.E/B.Tech students in 2nd, 3rd, and 4th years.",
      "Hardware and cloud API credits sponsored by Google Cloud & AWS.",
      "University transport and food will be provided throughout the 24-hour hack.",
    ],
  },
  {
    id: "sih-2026",
    title: "Smart India Hackathon (SIH) 2026 - Institutional Pre-Qualifier",
    shortTitle: "SIH 2026 Pre-Qualifier",
    tagline: "Ministry of Education & AICTE National Innovation Screening",
    category: "National Innovation",
    dates: "Oct 3 - 4, 2026",
    registrationDeadline: "Sept 28, 2026",
    mode: "On-Campus",
    venue: "Block M Computing Complex & AI Labs",
    prizePool: "₹1,00,000 Nomination Grant + National Finals Direct Entry",
    teamSizeMin: 6,
    teamSizeMax: 6,
    minAttendanceRequired: 75,
    allowedYears: [1, 2, 3, 4],
    tags: ["SIH", "Government Problem Statements", "IoT", "CleanTech"],
    description:
      "Internal university screening to shortlist official Sathyabama team nominations for the Smart India Hackathon 2026 nationwide competition.",
    rules: [
      "Each team must comprise exactly 6 members with at least one female teammate (MHRD mandate).",
      "Attendance must be verified above 75% for all 6 members.",
      "Top 10 shortlisted teams receive faculty mentoring and prototyping funding.",
    ],
  },
  {
    id: "hacknova-2026",
    title: "HackNova 2026: Web3 & Decentralized Agents",
    shortTitle: "HackNova Web3",
    tagline: "Decentralized Protocols, Smart Contracts & Zero-Knowledge",
    category: "Web3 & Blockchain",
    dates: "Oct 14 - 15, 2026",
    registrationDeadline: "Oct 10, 2026",
    mode: "Virtual & Lab",
    venue: "Virtual Computing Lab (Block M 2nd Floor) & Online",
    prizePool: "$5,000 Grant Pool in USDC + Ecosystem Bounties",
    teamSizeMin: 1,
    teamSizeMax: 4,
    minAttendanceRequired: 75,
    allowedYears: [2, 3, 4],
    tags: ["Ethereum", "Solana", "ZK-Rollups", "DeFi", "AI Agents"],
    description:
      "Global Web3 hackathon partnered with leading blockchain foundations to build privacy-preserving decentralized applications and cryptographic protocols.",
    rules: [
      "Submissions must deploy on testnet or mainnet with public open-source repository.",
      "Students attending in-person at Virtual Computing Lab qualify for On-Duty (OD).",
    ],
  },
  {
    id: "nexus-robotics-2026",
    title: "Nexus AI Robotics & Autonomous Systems Symposium",
    shortTitle: "Nexus Robotics 2026",
    tagline: "Physical AI, Drone Navigation & Edge Micro-Controllers",
    category: "Robotics & Hardware",
    dates: "Oct 28, 2026",
    registrationDeadline: "Oct 22, 2026",
    mode: "On-Campus",
    venue: "Robotics & Mechatronics Lab Complex, Mech Block",
    prizePool: "₹75,000 + NVIDIA Jetson Nano Kits",
    teamSizeMin: 2,
    teamSizeMax: 4,
    minAttendanceRequired: 75,
    allowedYears: [2, 3, 4],
    prerequisiteRule: "Basic C/C++ or Python robotics familiarity",
    tags: ["ROS 2", "Edge AI", "Computer Vision", "Drones", "Arduino"],
    description:
      "Hands-on robotics hackathon where teams program autonomous rovers and computer vision aerial drones to navigate simulated obstacle mazes.",
    rules: [
      "Hardware components provided by Sathyabama Robotics Club.",
      "Mandatory attendance >= 75% for laboratory machinery safety protocol clearance.",
    ],
  },
  {
    id: "tnsc-hack-2026",
    title: "Tamil Nadu State Collegiate Hackathon (TNSC-Hack)",
    shortTitle: "TNSC-Hack 2026",
    tagline: "State e-Governance Citizen Tech & Public Systems Challenge",
    category: "State Public Tech",
    dates: "Nov 5 - 6, 2026",
    registrationDeadline: "Oct 30, 2026",
    mode: "On-Campus",
    venue: "Anna University Guindy Campus & Sathyabama Central Auditorium",
    prizePool: "₹2,00,000 + Government Pilot Incubation",
    teamSizeMin: 3,
    teamSizeMax: 5,
    minAttendanceRequired: 75,
    allowedYears: [3, 4], // Restricted to Upperclassmen!
    tags: ["TNeGA", "Public Health", "Traffic AI", "Tamil NLP"],
    description:
      "Joint statewide hackathon hosted by the Tamil Nadu e-Governance Agency for building digital public infrastructure and accessibility tools.",
    rules: [
      "Strictly open to 3rd and 4th Year engineering students.",
      "Institutional verification with min 75% attendance mandatory.",
    ],
  },
  {
    id: "cybersentinel-ctf",
    title: "CyberSentinel CTF: Inter-Collegiate Cybersecurity Contest",
    shortTitle: "CyberSentinel CTF",
    tagline: "Offensive Exploitation, Reverse Engineering & Defense",
    category: "Cybersecurity",
    dates: "Nov 18, 2026",
    registrationDeadline: "Nov 14, 2026",
    mode: "On-Campus",
    venue: "CSS Lab (Center for Software Systems, Block M)",
    prizePool: "₹80,000 + Certified Ethical Hacker (CEH) Exam Vouchers",
    teamSizeMin: 1,
    teamSizeMax: 3,
    minAttendanceRequired: 80, // Requires 80% attendance or specific security course
    allowedYears: [2, 3, 4],
    prerequisiteRule: "High Academic Standing (>= 80% Attendance) or Security Elective",
    tags: ["CTF", "Binary Exploitation", "Web Security", "Cryptography", "Forensics"],
    description:
      "Competitive Jeopardy-style capture-the-flag tournament testing memory safety, network packet analysis, cryptography, and secure code auditing.",
    rules: [
      "Requires attendance percentage >= 80% due to intensive lab equipment access.",
      "Strict anti-plagiarism and network isolation enforced in CSS Lab.",
    ],
  },
];
