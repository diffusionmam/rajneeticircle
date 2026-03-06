import type { Question, Option, ViewState, QuizSession } from '../logic/types';
import type { ScoreResult } from '../logic/scoring';

export class UIRenderer {
    private viewLanding: HTMLElement;
    private viewQuiz: HTMLElement;
    private viewResult: HTMLElement;

    private progressText: HTMLElement;
    private progressBar: HTMLElement;
    private questionText: HTMLElement;
    private optionsContainer: HTMLElement;

    private resultTitle: HTMLElement;
    private resultDesc: HTMLElement;

    constructor() {
        this.viewLanding = document.getElementById('view-landing') as HTMLElement;
        this.viewQuiz = document.getElementById('view-quiz') as HTMLElement;
        this.viewResult = document.getElementById('view-result') as HTMLElement;

        this.progressText = document.getElementById('progress-text') as HTMLElement;
        this.progressBar = document.getElementById('progress-bar') as HTMLElement;
        this.questionText = document.getElementById('question-text') as HTMLElement;
        this.optionsContainer = document.getElementById('options-container') as HTMLElement;

        this.resultTitle = document.getElementById('result-title') as HTMLElement;
        this.resultDesc = document.getElementById('result-desc') as HTMLElement;
    }

    public switchView(view: ViewState) {
        // Hide all
        this.viewLanding.classList.remove('active');
        this.viewLanding.classList.add('hidden');
        this.viewQuiz.classList.remove('active');
        this.viewQuiz.classList.add('hidden');
        this.viewResult.classList.remove('active');
        this.viewResult.classList.add('hidden');

        // Show target with slight animation reset
        if (view === 'landing') {
            this.viewLanding.classList.remove('hidden');
            setTimeout(() => this.viewLanding.classList.add('active'), 10);
        } else if (view === 'quiz') {
            this.viewQuiz.classList.remove('hidden');
            setTimeout(() => this.viewQuiz.classList.add('active'), 10);
        } else if (view === 'result') {
            this.viewResult.classList.remove('hidden');
            setTimeout(() => this.viewResult.classList.add('active'), 10);
        }
    }

    public renderQuestion(
        question: Question,
        currentIndex: number,
        totalQuestions: number,
        onOptionSelect: (value: string) => void
    ) {
        // Update Progress
        this.progressText.innerText = `Question ${currentIndex + 1} of ${totalQuestions}`;
        const percent = ((currentIndex) / totalQuestions) * 100;
        this.progressBar.style.width = `${percent}%`;

        // Add fade out effect to card
        const quizCard = document.getElementById('quiz-card');
        quizCard?.classList.remove('fade-in');

        // Quick timeout for micro-animation
        setTimeout(() => {
            // Update text
            this.questionText.innerText = `${question.id}. ${question.text}`;

            // Clear old options
            this.optionsContainer.innerHTML = '';

            // Render new options
            question.options.forEach((opt: Option) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<strong>${opt.id})</strong>&nbsp;&nbsp;${opt.text}`;

                btn.onclick = () => {
                    // Visual feedback before proceeding
                    btn.style.transform = 'scale(0.98)';
                    btn.style.backgroundColor = 'var(--option-border)';
                    setTimeout(() => {
                        onOptionSelect(opt.value);
                        // reset progress width if advancing
                        const newPercent = ((currentIndex + 1) / totalQuestions) * 100;
                        this.progressBar.style.width = `${newPercent}%`;
                    }, 150);
                };

                this.optionsContainer.appendChild(btn);
            });

            // trigger reflow to restart animation
            void quizCard?.offsetWidth;
            quizCard?.classList.add('fade-in');
        }, 150);
    }

    public renderResult(result: ScoreResult) {
        this.progressBar.style.width = '100%'; // max out progress
        this.resultTitle.innerText = result.title;
        this.resultDesc.innerText = result.description;
    }
}
