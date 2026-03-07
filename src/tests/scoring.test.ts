import { calculateResult } from '../logic/scoring';
import type { QuizSession } from '../logic/types';

/** Helper: create a QuizSession with given raw scores */
function session(economicScore: number, authorityScore: number): QuizSession {
    return { currentQuestionIndex: 50, economicScore, authorityScore, completed: true };
}

// ──────────────────────────────────────────────────
// Score Normalization & Clamping
// ──────────────────────────────────────────────────

describe('calculateResult — score normalization', () => {
    it('dead-center session (0, 0) → x=50, y=50', () => {
        const result = calculateResult(session(0, 0));
        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
    });

    it('maximum left + libertarian scores → clamped at (0, 0)', () => {
        const result = calculateResult(session(-50, -50));
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('maximum right + authoritarian scores → clamped at (100, 100)', () => {
        const result = calculateResult(session(50, 50));
        expect(result.x).toBe(100);
        expect(result.y).toBe(100);
    });

    it('moderate positive scores are stretched by 1.8× then normalized', () => {
        // economicScore = 10  →  10 * 1.8 = 18  →  (18+50)/100*100 = 68
        // authorityScore = 5  →  5 * 1.8 = 9    →  (9+50)/100*100 = 59
        const result = calculateResult(session(10, 5));
        expect(result.x).toBeCloseTo(68, 0);
        expect(result.y).toBeCloseTo(59, 0);
    });

    it('all results have x and y in [0, 100]', () => {
        const extremes = [-100, -50, -25, 0, 25, 50, 100];
        for (const e of extremes) {
            for (const a of extremes) {
                const result = calculateResult(session(e, a));
                expect(result.x).toBeGreaterThanOrEqual(0);
                expect(result.x).toBeLessThanOrEqual(100);
                expect(result.y).toBeGreaterThanOrEqual(0);
                expect(result.y).toBeLessThanOrEqual(100);
            }
        }
    });
});

// ──────────────────────────────────────────────────
// Moderate Center Detection
// ──────────────────────────────────────────────────

describe('calculateResult — moderate center detection', () => {
    it('dead-center (0, 0) → Moderate Center', () => {
        const result = calculateResult(session(0, 0));
        expect(result.title).toContain('Moderate Center');
    });

    it('point just inside the moderate circle is still Moderate Center', () => {
        // We need (x, y) close to 50 but within radius 23.
        // economicScore = 5 → 5 * 1.8 = 9 → x = 59  (distance from 50 = 9, inside r=23)
        // authorityScore = 5 → y = 59
        const result = calculateResult(session(5, 5));
        expect(result.title).toContain('Moderate Center');
    });

    it('point outside the moderate circle gets a grid ideology', () => {
        // economicScore = -20 → -20 * 1.8 = -36 → x = 14  (distance from 50 = 36, >> 23)
        const result = calculateResult(session(-20, 20));
        expect(result.title).not.toContain('Moderate Center');
    });
});

// ──────────────────────────────────────────────────
// 8-Zone Ideology Grid
// ──────────────────────────────────────────────────

describe('calculateResult — 8-zone ideology classification', () => {
    // We need scores extreme enough to land outside the moderate center circle
    // and in the correct quadrant after the 1.8× stretch.

    it('far-left authoritarian → Marxist-Leninist State Socialism', () => {
        // economic = -28 → -28*1.8 = -50 (clamped) → x = 0  |  auth = 28 → 50 (clamped) → y = 100
        const result = calculateResult(session(-28, 28));
        expect(result.title).toContain('Marxist-Leninist State Socialism');
    });

    it('center-left authoritarian → Social Democracy', () => {
        // economic = -8 → -8*1.8 = -14.4 → x = 35.6  |  auth = 20 → 36 → y = 86
        const result = calculateResult(session(-8, 20));
        expect(result.title).toContain('Social Democracy');
    });

    it('center-right authoritarian → Totalitarian Nationalism', () => {
        // economic = 8 → 14.4 → x = 64.4  |  auth = 20 → 36 → y = 86
        const result = calculateResult(session(8, 20));
        expect(result.title).toContain('Totalitarian Nationalism');
    });

    it('far-right authoritarian → Traditional Conservatism', () => {
        // economic = 28 → 50 (clamped) → x = 100  |  auth = 28 → 50 (clamped) → y = 100
        const result = calculateResult(session(28, 28));
        expect(result.title).toContain('Traditional Conservatism');
    });

    it('far-left libertarian → Anarcho-Communism', () => {
        const result = calculateResult(session(-28, -28));
        expect(result.title).toContain('Anarcho-Communism');
    });

    it('center-left libertarian → Eco-Socialism', () => {
        const result = calculateResult(session(-8, -20));
        expect(result.title).toContain('Eco-Socialism');
    });

    it('center-right libertarian → Anarcho-Capitalism', () => {
        const result = calculateResult(session(8, -20));
        expect(result.title).toContain('Anarcho-Capitalism');
    });

    it('far-right libertarian → Classical Liberalism / Minarchism', () => {
        const result = calculateResult(session(28, -28));
        expect(result.title).toContain('Classical Liberalism');
    });
});

// ──────────────────────────────────────────────────
// Leaning Detection (Moderate Center only)
// ──────────────────────────────────────────────────

describe('calculateResult — leaning qualifier', () => {
    it('dead-center has no leaning', () => {
        const result = calculateResult(session(0, 0));
        expect(result.leaning).toBeUndefined();
    });

    it('non-Moderate-Center ideologies have no leaning', () => {
        const result = calculateResult(session(-28, 28));
        expect(result.title).not.toContain('Moderate Center');
        expect(result.leaning).toBeUndefined();
    });

    it('moderate center with economic lean → mentions "economic views"', () => {
        // economic = 4 → 4*1.8 = 7.2 → x = 57.2 (dx=7.2 > threshold=3)
        // authority = 0 → y = 50 (dy=0 ≤ threshold=3)
        const result = calculateResult(session(4, 0));
        expect(result.title).toContain('Moderate Center');
        expect(result.leaning).toContain('economic views');
    });

    it('moderate center with authority lean → mentions "social views"', () => {
        // economic = 0 → x = 50 (dx=0)
        // authority = 4 → 4*1.8 = 7.2 → y = 57.2 (dy=7.2 > 3)
        const result = calculateResult(session(0, 4));
        expect(result.title).toContain('Moderate Center');
        expect(result.leaning).toContain('social views');
    });

    it('moderate center with both axes lean → mentions "economic and social views"', () => {
        const result = calculateResult(session(4, 4));
        expect(result.title).toContain('Moderate Center');
        expect(result.leaning).toContain('economic and social views');
    });
});

// ──────────────────────────────────────────────────
// Description Coverage
// ──────────────────────────────────────────────────

describe('calculateResult — description for every ideology', () => {
    const cases: Array<{ economic: number; authority: number; keyword: string }> = [
        { economic: -28, authority: 28, keyword: 'Marxist-Leninist' },
        { economic: -8, authority: 20, keyword: 'Social Democracy' },
        { economic: 8, authority: 20, keyword: 'Totalitarian Nationalism' },
        { economic: 28, authority: 28, keyword: 'Traditional Conservatism' },
        { economic: -28, authority: -28, keyword: 'Anarcho-Communism' },
        { economic: -8, authority: -20, keyword: 'Eco-Socialism' },
        { economic: 8, authority: -20, keyword: 'Anarcho-Capitalism' },
        { economic: 28, authority: -28, keyword: 'Classical Liberalism' },
        { economic: 0, authority: 0, keyword: 'Moderate Center' },
    ];

    it.each(cases)(
        'description for $keyword is non-empty',
        ({ economic, authority }) => {
            const result = calculateResult(session(economic, authority));
            expect(result.description.length).toBeGreaterThan(50);
        }
    );
});
