export interface Option {
    id: string;      // 'A', 'B', 'C', 'D'
    text: string;
    value: string;   // Maps to the tallied category
}

export interface Question {
    id: number;
    text: string;
    options: Option[];
}

export type ViewState = 'landing' | 'quiz' | 'result';

export interface QuizSession {
    currentQuestionIndex: number;
    scores: Record<string, number>;
    completed: boolean;
}
