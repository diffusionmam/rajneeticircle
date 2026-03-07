import { questions } from '../data/questions';

describe('questions data integrity', () => {
    it('has exactly 50 questions', () => {
        expect(questions).toHaveLength(50);
    });

    it('has no duplicate IDs', () => {
        const ids = questions.map((q) => q.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('has exactly 25 economic and 25 authority questions', () => {
        const economic = questions.filter((q) => q.axis === 'economic');
        const authority = questions.filter((q) => q.axis === 'authority');
        expect(economic).toHaveLength(25);
        expect(authority).toHaveLength(25);
    });

    it('every question has a valid schema', () => {
        for (const q of questions) {
            expect(typeof q.id).toBe('number');
            expect(typeof q.text).toBe('string');
            expect(q.text.length).toBeGreaterThan(0);
            expect(['economic', 'authority']).toContain(q.axis);
            expect([1, -1]).toContain(q.direction);
        }
    });

    it('IDs are sequential from 1 to 50', () => {
        const ids = questions.map((q) => q.id).sort((a, b) => a - b);
        for (let i = 0; i < 50; i++) {
            expect(ids[i]).toBe(i + 1);
        }
    });
});
