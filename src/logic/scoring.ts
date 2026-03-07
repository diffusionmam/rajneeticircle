import type { QuizSession } from '../logic/types';

export interface ScoreResult {
    title: string;
    description: string;
    x: number;   // 0-100, Left to Right
    y: number;   // 0-100, Lib (bottom) to Auth (top)
    leaning?: string;  // e.g. "Leaning towards Social Democracy in terms of economic views"
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
    let { economicScore, authorityScore } = session;

    // Stretch scores outward — real-world scores cluster in [-15, +15],
    // but the grid needs them spread across [0, 100].
    const STRETCH = 1.5;
    economicScore = Math.max(-50, Math.min(50, economicScore * STRETCH));
    authorityScore = Math.max(-50, Math.min(50, authorityScore * STRETCH));

    // Each axis has 25 questions. Max possible per axis = 25 * 2 = 50, Min = -50.
    // Normalize from [-50, +50] to [0, 100]
    const x = ((economicScore + 50) / 100) * 100;  // 0 = hard left, 100 = hard right
    const y = ((authorityScore + 50) / 100) * 100;  // 0 = hard libertarian, 100 = hard authoritarian

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    const title = getTitle(clampedX, clampedY);
    const description = getDescription(title);
    const leaning = getLeaning(clampedX, clampedY, title);

    return { title, description, x: clampedX, y: clampedY, leaning };
}

/*
 * Image coordinate system (from spectrum-3.png analysis):
 *
 * The colored area occupies 12%-88% of the image (76% span).
 * Logical 0-100 maps to image 12%-88%.
 *
 * Image grid splits:
 *   Vertical columns at X = 31%, 50%, 69%  →  logical 25, 50, 75
 *   Horizontal row at Y = 50%              →  logical 50
 *   Moderate Center circle: center (50,50), radius 18%  →  logical radius ~23.7
 *
 * Conversion: imgCoord = 12 + (logical / 100) * 76
 *   logical 25 → img 31%  ✓
 *   logical 50 → img 50%  ✓
 *   logical 75 → img 69%  ✓
 *
 * Moderate Center radius in logical space:
 *   18% image radius / 76% span * 100 = ~23.7 logical units
 */

const MODERATE_CENTER_RADIUS = 23;

/**
 * Check if a point falls inside the Moderate Center circle.
 * Circle center is at logical (50, 50), radius ~23.7 in logical units.
 */
function isModerateCenter(x: number, y: number): boolean {
    const dx = x - 50;
    const dy = y - 50;
    return (dx * dx + dy * dy) <= (MODERATE_CENTER_RADIUS * MODERATE_CENTER_RADIUS);
}

type Ideology =
    | 'Marxist-Leninist State Socialism'
    | 'Social Democracy'
    | 'Totalitarian Nationalism'
    | 'Traditional Conservatism'
    | 'Anarcho-Communism'
    | 'Eco-Socialism'
    | 'Anarcho-Capitalism'
    | 'Classical Liberalism / Minarchism'
    | 'The Blended Pragmatist (Moderate Center)';

/**
 * Determine the 8-zone ideology based on the grid.
 * Does NOT check moderate center — caller should check that first.
 *
 * Grid in logical space:
 *   Columns: [0-25] Far-Left, [25-50] Center-Left, [50-75] Center-Right, [75-100] Far-Right
 *   Rows: y > 50 = Authoritarian (top), y ≤ 50 = Libertarian (bottom)
 */
function getGridIdeology(x: number, y: number): Ideology {
    const isAuth = y > 50;
    const isFarLeft = x < 25;
    const isCenterLeft = x >= 25 && x < 50;
    const isCenterRight = x >= 50 && x < 75;
    // isFarRight = x >= 75

    if (isAuth) {
        if (isFarLeft) return 'Marxist-Leninist State Socialism';
        if (isCenterLeft) return 'Social Democracy';
        if (isCenterRight) return 'Totalitarian Nationalism';
        return 'Traditional Conservatism';
    } else {
        if (isFarLeft) return 'Anarcho-Communism';
        if (isCenterLeft) return 'Eco-Socialism';
        if (isCenterRight) return 'Anarcho-Capitalism';
        return 'Classical Liberalism / Minarchism';
    }
}

function getTitle(x: number, y: number): string {
    // First check: Moderate Center circle
    if (isModerateCenter(x, y)) {
        return 'The Blended Pragmatist (Moderate Center)';
    }

    // Outside the circle — classify into 8 ideologies
    const ideology = getGridIdeology(x, y);

    switch (ideology) {
        case 'Marxist-Leninist State Socialism':
            return 'The State Socialist (Marxist-Leninist State Socialism)';
        case 'Social Democracy':
            return 'The Social Democrat (Social Democracy)';
        case 'Totalitarian Nationalism':
            return 'The Nationalist Realist (Totalitarian Nationalism)';
        case 'Traditional Conservatism':
            return 'The Traditionalist (Traditional Conservatism)';
        case 'Anarcho-Communism':
            return 'The Communalist (Anarcho-Communism)';
        case 'Eco-Socialism':
            return 'The Eco-Socialist (Eco-Socialism)';
        case 'Anarcho-Capitalism':
            return 'The Free Market Libertarian (Anarcho-Capitalism)';
        case 'Classical Liberalism / Minarchism':
            return 'The Classical Liberal (Classical Liberalism / Minarchism)';
        default:
            return 'The Blended Pragmatist (Moderate Center)';
    }
}

/**
 * For Moderate Center users, detect which quadrant they lean towards
 * and generate a "leaning towards" qualifier.
 */
function getLeaning(x: number, y: number, title: string): string | undefined {
    if (!title.includes('Moderate Center')) return undefined;

    const dx = x - 50;
    const dy = y - 50;
    const LEAN_THRESHOLD = 3; // minimum deviation to count as a lean

    // If truly dead-center, no leaning
    if (Math.abs(dx) <= LEAN_THRESHOLD && Math.abs(dy) <= LEAN_THRESHOLD) {
        return undefined;
    }

    // Determine the quadrant they lean towards and the closest sub-ideology
    const leanIdeology = getGridIdeology(x, y);

    // Determine which axis/axes they lean on
    const leanEcon = Math.abs(dx) > LEAN_THRESHOLD;
    const leanAuth = Math.abs(dy) > LEAN_THRESHOLD;

    let axisLabel: string;
    if (leanEcon && leanAuth) {
        axisLabel = 'economic and social views';
    } else if (leanEcon) {
        axisLabel = 'economic views';
    } else {
        axisLabel = 'social views';
    }

    return `Leaning towards ${leanIdeology} in terms of ${axisLabel}`;
}

function getDescription(title: string): string {
    if (title.includes('Marxist-Leninist State Socialism')) {
        return "**Domestic Posture:** You view society primarily through the lens of class struggle. You favor radical decentralization of social structures but absolute centralization of economic resources to dismantle historical hierarchies.\n**Economic Posture:** Command economy. You advocate for massive wealth redistribution, state ownership of critical industries, and the elimination of private monopolies.\n**Geopolitical Posture:** Anti-imperialist. You are highly skeptical of Western capitalist alliances and prefer solidarity with the Global South.\n**Societal & Cultural Posture:** You view traditional social structures—including traditional marriage and nuclear families—as inherently tied to capitalist and patriarchal property relations. You champion radical social reorganization and community-based living, supporting the dismantling of oppressive traditions.";
    }
    if (title.includes('Social Democracy')) {
        return "**Domestic Posture:** You believe in a strong democratic state that provides comprehensive welfare, healthcare, and education while maintaining political freedoms. You see the state as a guardian of the people's well-being.\n**Economic Posture:** Regulated capitalism with a strong welfare state. You support progressive taxation, robust public services, and strategic government intervention to reduce inequality within a market framework.\n**Geopolitical Posture:** Multilateral cooperation with a focus on human development indices. You believe India should lead through diplomacy and development partnerships.\n**Societal & Cultural Posture:** You are socially progressive, supporting gradual reforms that expand individual rights and social safety nets. You value both cultural heritage and modernization, seeking a balanced path forward.";
    }
    if (title.includes('Totalitarian Nationalism')) {
        return "**Domestic Posture:** You believe in a strong, centralized state that enforces cultural cohesion, national security, and rapid development, even at the cost of individual liberties or regional autonomy.\n**Economic Posture:** State-directed capitalism. The government actively guides big business to build national strength and strategic self-sufficiency.\n**Geopolitical Posture:** Hard power and realism. You view the world as a ruthless hierarchy where India must project military and economic dominance.\n**Societal & Cultural Posture:** You hold deep reverence for tradition, cultural uniformity, and national identity. You view marriage as a foundational building block of society. You are skeptical of rapid liberal social changes and prioritize order and discipline.";
    }
    if (title.includes('Traditional Conservatism')) {
        return "**Domestic Posture:** You value hierarchical order, institutional continuity, and civilizational identity. You believe in governance guided by time-tested traditions and cultural wisdom rather than radical ideological experiments.\n**Economic Posture:** Free enterprise guided by moral obligation. You support market freedom but believe economic activity should serve the common good and be tempered by social responsibility.\n**Geopolitical Posture:** Civilizational realism. You view India's foreign policy through the lens of cultural heritage and strategic interests, prioritizing relationships that reinforce India's civilizational standing.\n**Societal & Cultural Posture:** You hold deep reverence for traditional family structures, religious institutions, and cultural heritage. You believe raising children with strong civilizational values is crucial and view marriage as a sacred institution central to societal stability.";
    }
    if (title.includes('Anarcho-Communism')) {
        return "**Domestic Posture:** You envision a stateless, classless society organized through voluntary, decentralized communities. You oppose all forms of hierarchy — political, economic, and social.\n**Economic Posture:** Communal ownership and mutual aid. You reject both capitalist markets and state socialism, advocating for grassroots collective decision-making over resources.\n**Geopolitical Posture:** Global solidarity without borders. You oppose nationalism and imperialism, believing in a world where communities cooperate freely without the coercive apparatus of nation-states.\n**Societal & Cultural Posture:** You champion radical individual and collective freedom. You view traditional institutions as tools of oppression and support the complete reimagining of family, culture, and community on egalitarian principles.";
    }
    if (title.includes('Eco-Socialism')) {
        return "**Domestic Posture:** You prioritize environmental sustainability and social justice as inseparable goals. You believe the state should actively protect both the planet and marginalized communities through progressive policy.\n**Economic Posture:** Democratic socialism with a green mandate. You support public ownership of key industries, especially energy, combined with strong environmental regulations and community-led development.\n**Geopolitical Posture:** Climate diplomacy and South-South cooperation. You believe India should lead the Global South in demanding climate justice from industrialized nations.\n**Societal & Cultural Posture:** You are socially progressive and environmentally conscious. You support diversity, pluralism, and cultural evolution, believing culture should serve ecological harmony and social equity.";
    }
    if (title.includes('Anarcho-Capitalism')) {
        return "**Domestic Posture:** You believe in maximum individual liberty and minimal government interference. You view state bureaucracy as the primary obstacle to human progress and freedom.\n**Economic Posture:** Laissez-faire capitalism. You support radical deregulation, privatization, and free trade, believing the free market solves problems better than state planning.\n**Geopolitical Posture:** Hyper-pragmatism. You view foreign policy as purely transactional—driven by trade, capital flows, and economic advantage.\n**Societal & Cultural Posture:** You are socially permissive but highly individualistic. You believe people should be free to define marriage, family, and culture however they see fit, as long as they don't infringe on others' rights. Your focus is on individual autonomy rather than collective social engineering.";
    }
    if (title.includes('Classical Liberalism')) {
        return "**Domestic Posture:** You believe in a night-watchman state that protects individual rights, enforces contracts, and maintains the rule of law — but does little else. You are skeptical of government overreach in any direction.\n**Economic Posture:** Free markets with minimal regulation. You support low taxes, sound money, property rights, and free trade as the foundations of prosperity.\n**Geopolitical Posture:** Strategic non-interventionism. You believe India should engage with the world through trade and diplomacy rather than military adventurism, maintaining a strong defense but avoiding entangling alliances.\n**Societal & Cultural Posture:** You value individual freedom and personal responsibility. You believe social change should happen organically through voluntary choice and civil society rather than government mandates.";
    }

    // Moderate Center
    return "Your views are highly balanced across the spectrum, taking ideas from all across the political landscape depending entirely on pragmatic necessity rather than ideological purity.\n\n**Societal & Cultural Posture:** Your approach to culture, family, and social change is moderate and hyper-situational. You respect tradition but are constantly open to practical modernization, valuing whatever keeps society stable and prosperous.";
}
