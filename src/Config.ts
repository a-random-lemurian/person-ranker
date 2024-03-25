export class PersonRankerConfig {
    public refreshRateSeconds: number = 5;
    public ballotCoordinates: [number, number] = [-347, -97];
    public maxCharsPerSec: number = 512;
    public minimumRank: number = 40;

    public constructor(init?: Partial<PersonRankerConfig>) {
        Object.assign(this, init);
    }
};
