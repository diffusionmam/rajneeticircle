import type { QuizSession } from '../logic/types';

export interface ScoreResult {
    title: string;
    description: string;
    x: number;
    y: number;
}

export function calculateResult(session: QuizSession): ScoreResult {
    const scores = session.scores;
    const a = scores['A'] || 0;
    const b = scores['B'] || 0;
    const c = scores['C'] || 0;
    const d = scores['D'] || 0;

    const total = Object.values(scores).reduce((sum, val) => sum + val, 0) || 1; // avoid div by 0

    // X Axis: Right = 'A' + 'D', Left = 'B' + 'C'
    const rightScore = a + d;
    const leftScore = b + c;
    const rightPercent = (rightScore / total) * 100;
    const leftPercent = (leftScore / total) * 100;

    // Y Axis: Auth = 'A' + 'C', Lib = 'B' + 'D'
    const authScore = a + c;
    const libScore = b + d;
    const authPercent = (authScore / total) * 100;
    const libPercent = (libScore / total) * 100;

    // Scale X to 0-100 where 50 is center
    let x = 50 + (rightPercent - leftPercent) / 2;
    // Scale Y to 0-100 where 0 is bottom (Lib), 100 is top (Auth)
    let y = 50 - (authPercent - libPercent) / 2; // Subtract to move Auth up towards top (lower Y in flex terms, wait, usually in CSS bottom = 0 is Lib, bottom = 100 is Auth)
    // Actually, mathematically if Auth is top: y should be authPercent. 
    // x = (x% from Left to Right), y = (y% from Top to Bottom) or Bottom to Top.
    // If we use bottom: y%; then 0% is bottom (Lib), 100% is top (Auth).
    // Center is 50. Auth score pulls it UP. Lib score pulls it DOWN.
    y = 50 + (authPercent - libPercent) / 2;

    let maxScore = Math.max(a, b, c, d);
    let tiedTraits: string[] = [];

    if (a === maxScore) tiedTraits.push('A');
    if (b === maxScore) tiedTraits.push('B');
    if (c === maxScore) tiedTraits.push('C');
    if (d === maxScore) tiedTraits.push('D');

    if (tiedTraits.length > 1) {
        if (tiedTraits.length === 2) {
            if (tiedTraits.includes('A') && tiedTraits.includes('C')) {
                return {
                    title: "The Paternalistic State Advocate (Authoritarian Centrist)",
                    description: "You believe the state exists to guide and protect its citizens through strong central authority, balancing nationalistic cultural values with collective economic organization.\n\nSocietal & Cultural Posture: You favor order, discipline, and community cohesion over extreme individual liberty. You believe that both the market and individual impulses need strict governance to prevent cultural decay and economic exploitation.",
                    x, y
                };
            }
            if (tiedTraits.includes('B') && tiedTraits.includes('D')) {
                return {
                    title: "The Civil Libertarian (Libertarian Centrist)",
                    description: "You believe in maximum freedom both socially and economically. Individual liberty is your primary value, rejecting both corporate monopolies and state overreach.\n\nSocietal & Cultural Posture: You support absolute freedom in personal choices like marriage and family structure. You embrace social change and modernity, believing it should happen naturally through free association rather than state mandates.",
                    x, y
                };
            }
            if (tiedTraits.includes('A') && tiedTraits.includes('D')) {
                return {
                    title: "The Conservative Capitalist (Right-Wing Populist)",
                    description: "You blend cultural conservatism with capitalist economics. You favor a strong cultural identity but prefer free markets and deregulation to drive national growth.\n\nSocietal & Cultural Posture: You strongly prefer traditional family units, view marriage as a stabilizing cultural institution, and want to preserve national heritage against rapid globalized changes while letting the economy run free.",
                    x, y
                };
            }
            if (tiedTraits.includes('B') && tiedTraits.includes('C')) {
                return {
                    title: "The Democratic Socialist (Left-Wing Populist)",
                    description: "You combine a strong belief in economic redistribution and state welfare with a commitment to social justice and human rights, aiming to uplift the working class and marginalized groups.\n\nSocietal & Cultural Posture: You are socially progressive, championing new definitions of family and culture. You view traditions critically if they enforce inequality, and believe society must actively reform to ensure equitable outcomes for everyone.",
                    x, y
                };
            }
            if ((tiedTraits.includes('A') && tiedTraits.includes('B')) || (tiedTraits.includes('C') && tiedTraits.includes('D'))) {
                return {
                    title: "The Radical Centrist (Unorthodox Thinker)",
                    description: "Your political compass pulls from directly opposing corners of traditional political thought. You hold highly specific, sometimes contradictory views that don't fit neatly into right/left or authoritarian/libertarian boxes.\n\nSocietal & Cultural Posture: You evaluate traditionalism and progressivism on a strict case-by-case basis. You might believe in radical social freedom but extreme economic control, or vice versa, treating culture and statecraft as distinct, independent levers.",
                    x, y
                };
            }
        }

        return {
            title: "The Blended Pragmatist (Total Centrist)",
            description: "Your views are highly balanced across the spectrum, taking ideas from all across the political landscape depending entirely on pragmatic necessity rather than ideological purity.\n\nSocietal & Cultural Posture: Your approach to culture, family, and social change is moderate and hyper-situational. You respect tradition but are constantly open to practical modernization, valuing whatever keeps society stable and prosperous at any given moment.",
            x, y
        };
    }

    const primary = tiedTraits[0];
    switch (primary) {
        case 'A':
            return {
                title: "The Nationalist Realist (Authoritarian / Strong State)",
                description: "**Domestic Posture:** You believe in a strong, centralized state that enforces cultural cohesion, national security, and rapid development, even at the cost of individual liberties or regional autonomy.\n**Economic Posture:** State-directed capitalism. The government actively guides big business to build national strength.\n**Geopolitical Posture:** Hard power and realism. You view the world as a ruthless hierarchy where India must project military and economic dominance to survive and secure its interests.\n**Societal & Cultural Posture:** You hold deep reverence for tradition, traditional family structures, and cultural heritage. You likely view the institution of marriage as a foundational building block of society rather than just a personal contract, and believe raising kids with strong civilizational values is crucial. You are skeptical of rapid liberal social changes, preferring that society evolves slowly without discarding the wisdom of the past.",
                x, y
            };
        case 'B':
            return {
                title: "The Social Liberal (Libertarian Left / Idealist)",
                description: "**Domestic Posture:** You prioritize individual human rights, social justice, and pluralism. You view the state's primary role as a protector of marginalized communities and the environment.\n**Economic Posture:** Democratic socialism or a strong welfare state. You believe the excesses of capitalism must be curbed to ensure equitable wealth distribution and baseline survival for all.\n**Geopolitical Posture:** Idealism and soft power. You believe India should lead through moral authority, diplomacy, democratic values, and multilateral cooperation.\n**Societal & Cultural Posture:** You are socially progressive and highly open to change. You view family and marriage as flexible concepts that should accommodate diverse individual choices. You believe culture should constantly evolve to correct historical injustices and embrace new, egalitarian norms. You prioritize raising children to be open-minded, tolerant, and critical thinkers who question traditional dogma.",
                x, y
            };
        case 'C':
            return {
                title: "The State Socialist (Collectivist / Radical Left)",
                description: "**Domestic Posture:** You view society primarily through the lens of class struggle. You favor radical decentralization of social structures but absolute centralization of economic resources to dismantle historical hierarchies.\n**Economic Posture:** Command economy. You advocate for massive wealth redistribution, state ownership of critical industries, and the elimination of private monopolies.\n**Geopolitical Posture:** Anti-imperialist. You are highly skeptical of Western capitalist alliances and prefer solidarity with the Global South or alternative non-Western blocs to challenge US/Western hegemony.\n**Societal & Cultural Posture:** You view traditional social structures—including traditional marriage and nuclear families—as inherently tied to capitalist and patriarchal property relations. You champion radical social reorganization and community-based living. For you, culture is an active battleground; you support dismantling oppressive traditions and rapidly engineering society toward collective equality.",
                x, y
            };
        case 'D':
            return {
                title: "The Free Market Libertarian (Libertarian Right / Pragmatist)",
                description: "**Domestic Posture:** You believe in maximum individual liberty and minimal government interference. You view state bureaucracy as the primary obstacle to human progress and freedom.\n**Economic Posture:** Laissez-faire capitalism. You support radical deregulation, privatization, and free trade, believing the free market solves problems better than state planning.\n**Geopolitical Posture:** Hyper-pragmatism. You view foreign policy as purely transactional—driven by trade, capital flows, and economic advantage, devoid of moral crusades or emotional historical baggage.\n**Societal & Cultural Posture:** You are socially permissive but highly individualistic. You believe people should be free to define marriage, family, and culture however they see fit, as long as they don't infringe on others' rights or demand state funding. You are indifferent to whether society is traditional or progressive, so long as interactions remain voluntary. Your focus for the future is on individual autonomy rather than collective social engineering.",
                x, y
            };
        default:
            return { title: "Unknown", description: "", x: 50, y: 50 };
    }
}
