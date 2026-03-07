# Raajneeti Circle

A political compass quiz tailored for the Indian political landscape. 50 Likert-scale questions measure where you fall on a two-axis spectrum: **Economic Left–Right** and **Authoritarian–Libertarian**.

## How It Works

### Questions

50 declarative statements split evenly across two axes:

- **Economic (25 questions)** — covers MSP, privatization, reservations, freebies, trade policy, taxation, welfare, and labor law.
- **Authority (25 questions)** — covers AFSPA, UCC, Hindi imposition, inter-faith marriage laws, surveillance, decentralization, LGBTQ+ rights, and free speech.

Each question has a `direction` (+1 or -1) that determines which end of the axis an "Agree" response pushes towards.

### Response Scale

Users respond on a 5-point Likert scale:

| Response | Value |
|---|---|
| Strongly Agree | +2 |
| Agree | +1 |
| Neutral | 0 |
| Disagree | -1 |
| Strongly Disagree | -2 |

### Scoring

1. Each response value is multiplied by the question's `direction` and accumulated into a raw score per axis (range: -50 to +50).
2. A **stretch multiplier** (1.8x) is applied to counteract natural score clustering near zero, then clamped to [-50, +50].
3. Raw scores are normalized to a 0–100 logical scale for plotting.
4. A **Moderate Center** circle (radius 23 logical units, centered at 50,50) catches centrist users. Users inside the circle receive a "leaning towards..." qualifier if their offset exceeds a threshold of 3 units.
5. Users outside the circle are classified into one of **8 ideologies** based on a 4-column × 2-row grid:

| | Far Left (0–25) | Center Left (25–50) | Center Right (50–75) | Far Right (75–100) |
|---|---|---|---|---|
| **Authoritarian** (y > 50) | Marxist-Leninist State Socialism | Social Democracy | Totalitarian Nationalism | Traditional Conservatism |
| **Libertarian** (y ≤ 50) | Anarcho-Communism | Eco-Socialism | Anarcho-Capitalism | Classical Liberalism / Minarchism |

### Spectrum Image

The result dot is plotted on a background spectrum image (`spectrum-3.png`). The image's colored area spans 12%–88% of the container (76% total). Logical coordinates are mapped to image coordinates via:

```
imageCoord = 12 + (logical / 100) * 76
```

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Project Structure

```
src/
  data/questions.ts    — 50 Likert-scale question definitions
  logic/types.ts       — TypeScript interfaces (LikertQuestion, QuizSession)
  logic/scoring.ts     — Score calculation, ideology classification, leaning detection
  ui/render.ts         — DOM rendering for landing, quiz, and result views
  main.ts              — App entry point, quiz flow controller
```

## License

See [LICENSE](./LICENSE).
