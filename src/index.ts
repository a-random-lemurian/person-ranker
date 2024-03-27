import { Person } from "./Person";
import { Ranker } from "./Ranker";
import * as SOB from "simple-owot-bot";

/* Config */
import personsJson_ from "../persons.json";
type PersonList = { [key: string]: number };
const personsJson: PersonList = personsJson_;

import { PersonRankerConfig } from "./Config";
import * as fs from "fs";
const cfg: PersonRankerConfig = new PersonRankerConfig(
    JSON.parse(fs.readFileSync("config.json", { encoding: 'utf8' }))
);

/* Ranker */
const ranker = new Ranker();

Object.keys(personsJson).forEach(p => {
    ranker.addPerson(new Person(p, personsJson[p], true))
})

interface LeaderboardData {
    totalVotes: number,
    rankStrLens: number[],
    ranker: Ranker,
    updateTs: Date,
    persons: Array<Person>
}

let previousLd: LeaderboardData;
let currentLd: LeaderboardData;

function preprocessLeaderboard(ranker: Ranker): LeaderboardData {
    let obj: LeaderboardData = {
        totalVotes: ranker.totalScore(),
        ranker: ranker,
        updateTs: new Date(),
        rankStrLens: ranker.persons.map(p => p.name.length),
        persons: ranker.persons,
    };

    return obj;
}

function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function emptyLine(n: number): string {
    return ` `.padEnd(n, " ") + `\n`;
}

function createLeaderboardString(ld: LeaderboardData): string {
    let leaderboard = `----[ BALLOT ]----[ CERTIFIED 100% DEMOCRATIC ]----\n`;

    let botTimeString = `last update: ${ld.updateTs
        .toISOString()
        .replace(/T/g, " ")
        .replace(/Z/g, " UTC")}`;

    leaderboard += botTimeString + emptyLine(90) + emptyLine(90);

    leaderboard += ld.persons.slice(0, cfg.minimumRank)
        .map((person: Person, idx: number): string => {
            let spaces: number = 49;
            if (previousLd) {
                let s = previousLd.rankStrLens[idx] + 3;
                spaces = s;
            }

            const votes: string = numberWithCommas(person.score).padStart(12, " ");
            const rank: string = `${idx + 1}`.padStart(3, "0");
            return `(${rank}) [ ${votes} ] ${person.name.padEnd(spaces + 1, " ")}`;
        }).join("\n");

    leaderboard += emptyLine(90) + emptyLine(90);

    leaderboard += `TOTAL VOTES: ${numberWithCommas(ranker.totalScore())}`
        .padEnd(60, " ") + "\n";

    leaderboard += (ranker.persons.length > cfg.minimumRank)
        ? `Only showing first ${cfg.minimumRank} of ${ranker.persons.length} persons due to ratelimits being too slow.`
        : ``;
    leaderboard += `\nRun your own ballot bot! https://github.com/a-random-lemurian/person-ranker`
    return leaderboard;
}

/* Bot */
const bot = new SOB.Bot("wss://ourworldoftext.com/ws/?hide=1");

setInterval(() => {
    for (let i = 0; i < cfg.refreshRateSeconds; i++) ranker.mutateAll();

    previousLd = currentLd;
    currentLd = preprocessLeaderboard(ranker);
    const leaderboard = createLeaderboardString(currentLd);
    bot.writeText(
        ...cfg.ballotCoordinates,
        leaderboard
    );

    if ((cfg.refreshRateSeconds * cfg.maxCharsPerSec) < leaderboard.length) {
        console.log(
            `WARNING: refresh rate is too fast for ratelimit (${cfg.maxCharsPerSec}/s)!` +
            ` required write rate would be ${leaderboard.length / cfg.refreshRateSeconds}` +
            `\ntry using a refresh rate of ${Math.ceil(leaderboard.length / cfg.maxCharsPerSec)}`
        );
    }

}, cfg.refreshRateSeconds * 1000);

previousLd = preprocessLeaderboard(ranker);

console.log("ready")
