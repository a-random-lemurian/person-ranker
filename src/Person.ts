export const MUTATION_LIMIT = 500;

function randint(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min)) + min;
}

export class Person {
    name: string;
    score: number;
    increase: boolean;
    sameMutationCount: number = 0;

    constructor(
        name: string,
        score: number = 0,
        increase: boolean = true) {
        this.name = name;
        this.score = score;
        this.increase = increase;
    };

    shouldChangeTrend(threshold: number = 260): boolean {
        const i = randint(1, 10000);
        threshold += (this.sameMutationCount > 600) ? 3100 : 0;

        return i < threshold;
    }

    mutate(): void {
        /*
         * Scores can change by anywhere from 40 to N where N is anywhere
         * from 0.1% to 2% of its previous score.
         * 
         * Here we determine N.
         */
        let newScoreMaxChange = Math.ceil(
            randint(40, 400) +
            Math.ceil(
                (this.score / 100) * 0.1 + (Math.random() * 2)
            )
        );

        // Determine the score change, duh.
        let newScore = randint(1, newScoreMaxChange);

        // Persons with an increasing score trend can sometimes get their
        // score multiplied. 1 in 100 chance.
        if (randint(1, 100) == 5 && this.increase) {
            newScore = Math.ceil(newScore * (Math.random() * 3.3));
        }

        let _increase: boolean = this.increase;
        if (randint(1, 100) > this.trendDeviancePossibility) _increase = -_increase;
        // Apply the new score change.
        this.score += _increase ? newScore : -newScore;

        // Cap the score at 0 or 99 million.
        if (this.score < 0) this.score = 0;
        if (this.score > 99999999) this.score = 99999999;


        // Change trend (whether score goes up or down) and do so more
        // frequently if the score is too close to the limits,
        let threshold = 260;
        if (this.score < 5000 || this.score > 95000000)
        if (this.shouldChangeTrend(threshold)) {
            this.increase = !this.increase;
            this.sameMutationCount = 0;
            return;
        }

        this.sameMutationCount++;
        return;
    }
}
