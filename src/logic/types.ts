export interface LikertQuestion {
    id: number;
    text: string;           // Single declarative statement
    axis: 'economic' | 'authority';  // Which axis this statement measures
    direction: 1 | -1;     // +1 means "Agree" pushes Right/Auth, -1 means "Agree" pushes Left/Lib
}

export type ViewState = 'landing' | 'quiz' | 'result';

export interface QuizSession {
    currentQuestionIndex: number;
    economicScore: number;   // negative = Left, positive = Right
    authorityScore: number;  // negative = Libertarian, positive = Authoritarian
    completed: boolean;
}
