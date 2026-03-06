import './styles/style.css';
import { questions } from './data/questions';
import type { QuizSession } from './logic/types';
import { calculateResult } from './logic/scoring';
import { UIRenderer } from './ui/render';
import { inject } from '@vercel/analytics';

class App {
  private session: QuizSession;
  private renderer: UIRenderer;

  constructor() {
    this.session = this.getInitialSession();
    this.renderer = new UIRenderer();
    this.init();
  }

  private getInitialSession(): QuizSession {
    return {
      currentQuestionIndex: 0,
      economicScore: 0,
      authorityScore: 0,
      completed: false
    };
  }

  private init() {
    // Bind Start Button
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startAssessment();
      });
    }

    // Bind Restart Button
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.session = this.getInitialSession();
        this.startAssessment(); // Jump straight back into quiz
      });
    }

    // Initialize View
    this.renderer.switchView('landing');
  }

  private startAssessment() {
    this.renderer.switchView('quiz');
    this.showCurrentQuestion();
  }

  private showCurrentQuestion() {
    if (this.session.currentQuestionIndex >= questions.length) {
      this.finishAssessment();
      return;
    }

    const currentQ = questions[this.session.currentQuestionIndex];
    this.renderer.renderQuestion(
      currentQ,
      this.session.currentQuestionIndex,
      questions.length,
      (likertValue: number) => this.handleOptionSelect(likertValue)
    );
  }

  private handleOptionSelect(likertValue: number) {
    const currentQ = questions[this.session.currentQuestionIndex];

    // Multiply the Likert response by the question's direction
    // direction = +1: Agree pushes Right/Auth
    // direction = -1: Agree pushes Left/Lib
    const weightedScore = likertValue * currentQ.direction;

    if (currentQ.axis === 'economic') {
      this.session.economicScore += weightedScore;
    } else {
      this.session.authorityScore += weightedScore;
    }

    // Advance
    this.session.currentQuestionIndex++;
    this.showCurrentQuestion();
  }

  private finishAssessment() {
    this.session.completed = true;
    const result = calculateResult(this.session);
    this.renderer.renderResult(result);
    this.renderer.switchView('result');
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  inject();
  new App();
});
