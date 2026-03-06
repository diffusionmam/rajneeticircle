import type { LikertQuestion } from '../logic/types';

export const questions: LikertQuestion[] = [
  // --- ECONOMIC AXIS (25 questions) ---
  // direction: +1 means "Agree" pushes towards Economic Right (free market)
  // direction: -1 means "Agree" pushes towards Economic Left (state control / redistribution)

  {
    id: 1,
    text: "The government should mandate caste-based reservations in the private sector to correct historical injustices.",
    axis: "economic",
    direction: -1
  },
  {
    id: 2,
    text: "All major industries like railways, banks, and defense manufacturing should remain under government ownership.",
    axis: "economic",
    direction: -1
  },
  {
    id: 3,
    text: "India's labor laws are too rigid; companies should have more freedom to hire and fire workers.",
    axis: "economic",
    direction: 1
  },
  {
    id: 4,
    text: "The Minimum Support Price (MSP) for crops should be made a legal right for all farmers across all crops.",
    axis: "economic",
    direction: -1
  },
  {
    id: 5,
    text: "Wealth inequality is best solved by aggressive taxation of the ultra-rich and nationalization of monopoly industries.",
    axis: "economic",
    direction: -1
  },
  {
    id: 6,
    text: "Government \"freebies\" like free electricity and bus travel are reckless electoral bribery that destroy state finances.",
    axis: "economic",
    direction: 1
  },
  {
    id: 7,
    text: "Healthcare should be entirely privatized; the government's role should be limited to subsidizing insurance, not running hospitals.",
    axis: "economic",
    direction: 1
  },
  {
    id: 8,
    text: "India should aggressively join all major global free trade agreements, even if domestic industries face tough foreign competition.",
    axis: "economic",
    direction: 1
  },
  {
    id: 9,
    text: "Taxation is fundamentally an overreach; the government takes too much from productive citizens to fund inefficient welfare programs.",
    axis: "economic",
    direction: 1
  },
  {
    id: 10,
    text: "The state must take complete control of agricultural production and distribution to ensure food security for the masses.",
    axis: "economic",
    direction: -1
  },
  {
    id: 11,
    text: "All import tariffs should be abolished so Indian consumers can access the cheapest goods from around the world.",
    axis: "economic",
    direction: 1
  },
  {
    id: 12,
    text: "Wealthier states should be required to subsidize poorer states through central tax redistribution to ensure national parity.",
    axis: "economic",
    direction: -1
  },
  {
    id: 13,
    text: "Slum dwellers should be provided free, in-situ rehabilitation before any urban development project displaces them.",
    axis: "economic",
    direction: -1
  },
  {
    id: 14,
    text: "The government should completely exit all businesses and sell off every loss-making public sector undertaking to private buyers.",
    axis: "economic",
    direction: 1
  },
  {
    id: 15,
    text: "Education should be entirely privatized; the state shouldn't fund or regulate any schools, letting parents choose in a free market.",
    axis: "economic",
    direction: 1
  },
  {
    id: 16,
    text: "Environmental regulations, even if they slow GDP growth, are essential and must be strictly enforced to protect the poorest citizens.",
    axis: "economic",
    direction: -1
  },
  {
    id: 17,
    text: "All government-mandated minimum wages should be abolished; the employer-employee relationship should be a purely private contract.",
    axis: "economic",
    direction: 1
  },
  {
    id: 18,
    text: "Urban land should be controlled by the state to build massive, affordable public housing rather than left to private developers.",
    axis: "economic",
    direction: -1
  },
  {
    id: 19,
    text: "A strong welfare state with free universal healthcare and education is more important than keeping taxes low.",
    axis: "economic",
    direction: -1
  },
  {
    id: 20,
    text: "India's space program is a luxury; its funding should be redirected to solving immediate problems like poverty and infrastructure.",
    axis: "economic",
    direction: -1
  },
  {
    id: 21,
    text: "Private charity and economic growth alone can replace all government welfare programs if the state gets out of the way.",
    axis: "economic",
    direction: 1
  },
  {
    id: 22,
    text: "The state should heavily subsidize and protect domestic industries with tariffs to build national champions before opening up to global competition.",
    axis: "economic",
    direction: -1
  },
  {
    id: 23,
    text: "Land rights should be fully privatized and legally titled to individual tribals, allowing them to negotiate directly with corporations.",
    axis: "economic",
    direction: 1
  },
  {
    id: 24,
    text: "Electoral funding should come entirely from the state; all private and corporate donations to political parties must be banned.",
    axis: "economic",
    direction: -1
  },
  {
    id: 25,
    text: "Alcohol production and sale should be entirely deregulated; negative social consequences are a matter of personal responsibility.",
    axis: "economic",
    direction: 1
  },

  // --- AUTHORITY AXIS (25 questions) ---
  // direction: +1 means "Agree" pushes towards Authoritarian (strong state, tradition, order)
  // direction: -1 means "Agree" pushes towards Libertarian (individual freedom, decentralization)

  {
    id: 26,
    text: "A strong, centralized leader is essential for a developing nation to bypass bureaucratic paralysis and execute rapid reforms.",
    axis: "authority",
    direction: 1
  },
  {
    id: 27,
    text: "The Hindi language should be aggressively promoted by the central government as the primary language of national communication.",
    axis: "authority",
    direction: 1
  },
  {
    id: 28,
    text: "Laws requiring state oversight of inter-faith marriages are necessary to protect the cultural integrity of the majority community.",
    axis: "authority",
    direction: 1
  },
  {
    id: 29,
    text: "Complete freedom of speech, even if offensive or anti-establishment, is non-negotiable in a free society.",
    axis: "authority",
    direction: -1
  },
  {
    id: 30,
    text: "The Armed Forces Special Powers Act (AFSPA) is a necessary tool, even if it restricts civil liberties in certain regions.",
    axis: "authority",
    direction: 1
  },
  {
    id: 31,
    text: "The state has the right to use strict population control measures, including denying benefits to families that exceed a two-child norm.",
    axis: "authority",
    direction: 1
  },
  {
    id: 32,
    text: "The government must have absolute digital surveillance capabilities to preempt terrorism, even if it means breaking encryption.",
    axis: "authority",
    direction: 1
  },
  {
    id: 33,
    text: "Renaming cities and reclaiming historical sites is a vital project of civilizational reclamation and decolonization.",
    axis: "authority",
    direction: 1
  },
  {
    id: 34,
    text: "The right to protest and disrupt the status quo is the lifeblood of democracy, regardless of economic disruption it causes.",
    axis: "authority",
    direction: -1
  },
  {
    id: 35,
    text: "Same-sex couples must be immediately granted full marriage, adoption, and inheritance rights by the state.",
    axis: "authority",
    direction: -1
  },
  {
    id: 36,
    text: "The elected government, not unelected judges, should have the final say in judicial appointments.",
    axis: "authority",
    direction: 1
  },
  {
    id: 37,
    text: "A Uniform Civil Code replacing personal religious laws is essential for a unified national identity.",
    axis: "authority",
    direction: 1
  },
  {
    id: 38,
    text: "Traditional family structures and cultural heritage must be actively preserved by the state against rapid liberal social changes.",
    axis: "authority",
    direction: 1
  },
  {
    id: 39,
    text: "Power should be radically decentralized to local municipalities and panchayats rather than concentrated in the Prime Minister's office.",
    axis: "authority",
    direction: -1
  },
  {
    id: 40,
    text: "India has a civilizational duty to provide sanctuary specifically to persecuted Hindu minorities from neighboring countries.",
    axis: "authority",
    direction: 1
  },
  {
    id: 41,
    text: "The state should have absolutely no involvement in defining who can marry whom, regardless of religion, caste, or gender.",
    axis: "authority",
    direction: -1
  },
  {
    id: 42,
    text: "Individuals who undermine national security or public harmony through speech should be dealt with severely using laws like UAPA.",
    axis: "authority",
    direction: 1
  },
  {
    id: 43,
    text: "Women's bodily autonomy and gender equality must be enforced by the state, overriding any religious or cultural sensitivities.",
    axis: "authority",
    direction: -1
  },
  {
    id: 44,
    text: "The right to absolute privacy and encrypted communication must be legally protected against all state intrusion.",
    axis: "authority",
    direction: -1
  },
  {
    id: 45,
    text: "India must maintain an aggressive, hyper-militarized posture and prepare for decisive military confrontation to settle border disputes permanently.",
    axis: "authority",
    direction: 1
  },
  {
    id: 46,
    text: "Minority educational institutions should retain absolute autonomy over their admissions and cultural curriculum.",
    axis: "authority",
    direction: -1
  },
  {
    id: 47,
    text: "The state should actively use the education system to foster a unified national consciousness, even if it means suppressing regional or religious identities.",
    axis: "authority",
    direction: 1
  },
  {
    id: 48,
    text: "India should adopt a No First Use nuclear policy and pursue regional denuclearization through diplomacy rather than deterrence.",
    axis: "authority",
    direction: -1
  },
  {
    id: 49,
    text: "The state must launch a massive, centrally planned initiative to build sovereign AI models and heavily regulate foreign AI imports.",
    axis: "authority",
    direction: 1
  },
  {
    id: 50,
    text: "Graduates from state-subsidized premier institutes should be required to serve a mandatory national service period before emigrating.",
    axis: "authority",
    direction: 1
  }
];
