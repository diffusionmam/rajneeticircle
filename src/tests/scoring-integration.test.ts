import { questions } from '../data/questions';
import { calculateResult } from '../logic/scoring';
import type { QuizSession } from '../logic/types';

/**
 * Simulate a full quiz session: iterate through all questions,
 * apply the given Likert value to each, accumulate scores,
 * then run calculateResult.
 */
function simulateQuiz(likertValueFn: (questionIndex: number) => number) {
    const session: QuizSession = {
        currentQuestionIndex: 0,
        economicScore: 0,
        authorityScore: 0,
        completed: false,
    };

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const likertValue = likertValueFn(i);
        const weightedScore = likertValue * q.direction;

        if (q.axis === 'economic') {
            session.economicScore += weightedScore;
        } else {
            session.authorityScore += weightedScore;
        }
        session.currentQuestionIndex = i + 1;
    }

    session.completed = true;
    return calculateResult(session);
}

describe('scoring integration — full quiz simulation', () => {
    it('all Neutral (0) → exact center (50, 50), Moderate Center', () => {
        const result = simulateQuiz(() => 0);
        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.title).toContain('Moderate Center');
    });

    it('all Strongly Agree (+2) → valid ScoreResult with x,y in [0,100]', () => {
        const result = simulateQuiz(() => 2);
        expect(result.x).toBeGreaterThanOrEqual(0);
        expect(result.x).toBeLessThanOrEqual(100);
        expect(result.y).toBeGreaterThanOrEqual(0);
        expect(result.y).toBeLessThanOrEqual(100);
        expect(result.title.length).toBeGreaterThan(0);
        expect(result.description.length).toBeGreaterThan(0);
    });

    it('all Strongly Disagree (-2) → valid ScoreResult with x,y in [0,100]', () => {
        const result = simulateQuiz(() => -2);
        expect(result.x).toBeGreaterThanOrEqual(0);
        expect(result.x).toBeLessThanOrEqual(100);
        expect(result.y).toBeGreaterThanOrEqual(0);
        expect(result.y).toBeLessThanOrEqual(100);
        expect(result.title.length).toBeGreaterThan(0);
    });

    it('mixed responses produce a well-formed result', () => {
        // Pattern: alternate Agree/Disagree for some variety
        const result = simulateQuiz((i) => (i % 2 === 0 ? 1 : -1));
        expect(result.x).toBeGreaterThanOrEqual(0);
        expect(result.x).toBeLessThanOrEqual(100);
        expect(result.y).toBeGreaterThanOrEqual(0);
        expect(result.y).toBeLessThanOrEqual(100);
        expect(result.title.length).toBeGreaterThan(0);
        expect(result.description.length).toBeGreaterThan(0);
    });

    it('result contains all required fields', () => {
        const result = simulateQuiz(() => 1);
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('description');
        expect(result).toHaveProperty('x');
        expect(result).toHaveProperty('y');
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(typeof result.title).toBe('string');
        expect(typeof result.description).toBe('string');
    });
});
