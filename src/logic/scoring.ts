import type { QuizSession } from '../logic/types';

export interface ScoreResult {
    title: string;
    description: string;
}

export function calculateResult(session: QuizSession): ScoreResult {
    const scores = session.scores;
    const a = scores['A'] || 0;
    const b = scores['B'] || 0;
    const c = scores['C'] || 0;
    const d = scores['D'] || 0;

    let maxScore = Math.max(a, b, c, d);
    let tiedTraits: string[] = [];

    if (a === maxScore) tiedTraits.push('A');
    if (b === maxScore) tiedTraits.push('B');
    if (c === maxScore) tiedTraits.push('C');
    if (d === maxScore) tiedTraits.push('D');

    if (tiedTraits.length > 1) {
        if (tiedTraits.includes('A') && tiedTraits.includes('D')) {
            return {
                title: "The Right-Wing Populist",
                description: "You blend cultural conservatism with capitalist economics. You favor a strong cultural identity but prefer free markets."
            };
        }
        if (tiedTraits.includes('B') && tiedTraits.includes('D')) {
            return {
                title: "The Classical Liberal",
                description: "You believe in maximum freedom both socially and economically. Individual liberty is your primary value."
            };
        }
        return {
            title: "The Blended Pragmatist",
            description: "Your views are highly balanced across the spectrum, taking ideas from multiple ideologies based on the situation."
        };
    }

    const primary = tiedTraits[0];
    switch (primary) {
        case 'A':
            return {
                title: "The Nationalist Realist (Authoritarian / Strong State)",
                description: "Domestic Posture: You believe in a strong, centralized state that enforces cultural cohesion, national security, and rapid development, even at the cost of individual liberties or regional autonomy.\nEconomic Posture: State-directed capitalism. The government actively guides big business to build national strength.\nGeopolitical Posture: Hard power and realism. You view the world as a ruthless hierarchy where India must project military and economic dominance to survive and secure its interests."
            };
        case 'B':
            return {
                title: "The Social Liberal (Libertarian Left / Idealist)",
                description: "Domestic Posture: You prioritize individual human rights, social justice, and pluralism. You view the state's primary role as a protector of marginalized communities and the environment.\nEconomic Posture: Democratic socialism or a strong welfare state. You believe the excesses of capitalism must be curbed to ensure equitable wealth distribution and baseline survival for all.\nGeopolitical Posture: Idealism and soft power. You believe India should lead through moral authority, diplomacy, democratic values, and multilateral cooperation."
            };
        case 'C':
            return {
                title: "The State Socialist (Collectivist / Radical Left)",
                description: "Domestic Posture: You view society primarily through the lens of class struggle. You favor radical decentralization of social structures but absolute centralization of economic resources to dismantle historical hierarchies.\nEconomic Posture: Command economy. You advocate for massive wealth redistribution, state ownership of critical industries, and the elimination of private monopolies.\nGeopolitical Posture: Anti-imperialist. You are highly skeptical of Western capitalist alliances and prefer solidarity with the Global South or alternative non-Western blocs to challenge US/Western hegemony."
            };
        case 'D':
            return {
                title: "The Free Market Libertarian (Libertarian Right / Pragmatist)",
                description: "Domestic Posture: You believe in maximum individual liberty and minimal government interference. You view state bureaucracy as the primary obstacle to human progress and freedom.\nEconomic Posture: Laissez-faire capitalism. You support radical deregulation, privatization, and free trade, believing the free market solves problems better than state planning.\nGeopolitical Posture: Hyper-pragmatism. You view foreign policy as purely transactional—driven by trade, capital flows, and economic advantage, devoid of moral crusades or emotional historical baggage."
            };
        default:
            return { title: "Unknown", description: "" };
    }
}
