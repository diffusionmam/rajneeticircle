import type { QuizSession } from '../logic/types';

export interface ScoreResult {
    title: string;
    description: string;
    x: number;  // 0-100, Left to Right
    y: number;  // 0-100, Lib (bottom) to Auth (top)
}

/**
 * Likert scale scoring:
 * Each question contributes to one axis (economic or authority).
 * The user's response is a value from -2 to +2:
 *   Strongly Disagree = -2, Disagree = -1, Neutral = 0, Agree = +1, Strongly Agree = +2
 *
 * This value is multiplied by the question's `direction`:
 *   direction = +1: "Agree" pushes Right (economic) or Authoritarian (authority)
 *   direction = -1: "Agree" pushes Left (economic) or Libertarian (authority)
 *
 * Final scores are normalized to a 0-100 % scale for plotting on the spectrum.
 */

export function calculateResult(session: QuizSession): ScoreResult {
    const { economicScore, authorityScore } = session;

    // Each axis has 25 questions. Max possible per axis = 25 * 2 = 50, Min = -50.
    // Normalize from [-50, +50] to [0, 100]
    const x = ((economicScore + 50) / 100) * 100;  // 0 = hard left, 100 = hard right
    const y = ((authorityScore + 50) / 100) * 100;  // 0 = hard libertarian, 100 = hard authoritarian

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    const title = getTitle(clampedX, clampedY);
    const description = getDescription(clampedX, clampedY);

    return { title, description, x: clampedX, y: clampedY };
}

function getTitle(x: number, y: number): string {
    // Determine zone based on where user falls on the grid
    const isRight = x > 60;
    const isLeft = x < 40;
    const isAuth = y > 60;
    const isLib = y < 40;

    // Strong corners (outer 25%)
    if (isAuth && isRight) return "The Nationalist Realist (Authoritarian Right)";
    if (isAuth && isLeft) return "The State Socialist (Authoritarian Left)";
    if (isLib && isRight) return "The Free Market Libertarian (Libertarian Right)";
    if (isLib && isLeft) return "The Social Liberal (Libertarian Left)";

    // Edge cases: strong on one axis, centrist on another
    if (isAuth) return "The Paternalistic State Advocate (Authoritarian Centrist)";
    if (isLib) return "The Civil Libertarian (Libertarian Centrist)";
    if (isRight) return "The Conservative Capitalist (Right-Wing Centrist)";
    if (isLeft) return "The Democratic Socialist (Left-Wing Centrist)";

    // True center
    return "The Blended Pragmatist (Centrist)";
}

function getDescription(x: number, y: number): string {
    const isRight = x > 60;
    const isLeft = x < 40;
    const isAuth = y > 60;
    const isLib = y < 40;

    if (isAuth && isRight) {
        return "**Domestic Posture:** You believe in a strong, centralized state that enforces cultural cohesion, national security, and rapid development, even at the cost of individual liberties or regional autonomy.\n**Economic Posture:** State-directed capitalism. The government actively guides big business to build national strength.\n**Geopolitical Posture:** Hard power and realism. You view the world as a ruthless hierarchy where India must project military and economic dominance.\n**Societal & Cultural Posture:** You hold deep reverence for tradition, traditional family structures, and cultural heritage. You view marriage as a foundational building block of society, believe raising kids with strong civilizational values is crucial, and are skeptical of rapid liberal social changes.";
    }
    if (isAuth && isLeft) {
        return "**Domestic Posture:** You view society primarily through the lens of class struggle. You favor radical decentralization of social structures but absolute centralization of economic resources to dismantle historical hierarchies.\n**Economic Posture:** Command economy. You advocate for massive wealth redistribution, state ownership of critical industries, and the elimination of private monopolies.\n**Geopolitical Posture:** Anti-imperialist. You are highly skeptical of Western capitalist alliances and prefer solidarity with the Global South.\n**Societal & Cultural Posture:** You view traditional social structures—including traditional marriage and nuclear families—as inherently tied to capitalist and patriarchal property relations. You champion radical social reorganization and community-based living, supporting the dismantling of oppressive traditions.";
    }
    if (isLib && isRight) {
        return "**Domestic Posture:** You believe in maximum individual liberty and minimal government interference. You view state bureaucracy as the primary obstacle to human progress and freedom.\n**Economic Posture:** Laissez-faire capitalism. You support radical deregulation, privatization, and free trade, believing the free market solves problems better than state planning.\n**Geopolitical Posture:** Hyper-pragmatism. You view foreign policy as purely transactional—driven by trade, capital flows, and economic advantage.\n**Societal & Cultural Posture:** You are socially permissive but highly individualistic. You believe people should be free to define marriage, family, and culture however they see fit, as long as they don't infringe on others' rights. Your focus is on individual autonomy rather than collective social engineering.";
    }
    if (isLib && isLeft) {
        return "**Domestic Posture:** You prioritize individual human rights, social justice, and pluralism. You view the state's primary role as a protector of marginalized communities and the environment.\n**Economic Posture:** Democratic socialism or a strong welfare state. You believe the excesses of capitalism must be curbed to ensure equitable wealth distribution.\n**Geopolitical Posture:** Idealism and soft power. You believe India should lead through moral authority, diplomacy, democratic values, and multilateral cooperation.\n**Societal & Cultural Posture:** You are socially progressive and highly open to change. You view family and marriage as flexible concepts that should accommodate diverse individual choices. You believe culture should constantly evolve to correct historical injustices and embrace new, egalitarian norms.";
    }

    if (isAuth) {
        return "You believe the state exists to guide and protect its citizens through strong central authority, balancing different cultural and economic values under a firm governance framework.\n\n**Societal & Cultural Posture:** You favor order, discipline, and community cohesion over extreme individual liberty. You believe that both the market and individual impulses need strict governance to prevent cultural decay and economic exploitation.";
    }
    if (isLib) {
        return "You believe in maximum freedom both socially and economically. Individual liberty is your primary value, rejecting both corporate monopolies and state overreach.\n\n**Societal & Cultural Posture:** You support absolute freedom in personal choices like marriage and family structure. You embrace social change and modernity, believing it should happen naturally through free association rather than state mandates.";
    }
    if (isRight) {
        return "You blend cultural flexibility with capitalist economics. You favor free markets and deregulation to drive national growth, while remaining moderate on social questions.\n\n**Societal & Cultural Posture:** You tend to prefer traditional family units and view marriage as a stabilizing cultural institution, but you're pragmatic about social change when it doesn't threaten economic freedom.";
    }
    if (isLeft) {
        return "You combine a belief in economic redistribution and state welfare with a commitment to social justice and human rights, aiming to uplift the working class and marginalized groups.\n\n**Societal & Cultural Posture:** You are socially progressive, championing new definitions of family and culture. You view traditions critically if they enforce inequality, and believe society must actively reform for equitable outcomes.";
    }

    return "Your views are highly balanced across the spectrum, taking ideas from all across the political landscape depending entirely on pragmatic necessity rather than ideological purity.\n\n**Societal & Cultural Posture:** Your approach to culture, family, and social change is moderate and hyper-situational. You respect tradition but are constantly open to practical modernization, valuing whatever keeps society stable and prosperous.";
}
