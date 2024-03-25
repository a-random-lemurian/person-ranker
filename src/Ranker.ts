import { Person } from "./Person"

export class Ranker {
    persons: Array<Person>;

    constructor(
        persons: Array<Person> = []
    ) {
        this.persons = persons;
    }

    public mutateAll() : void {
        this.persons.forEach(person => {
            person.mutate();
        })
        this.persons.sort((a, b) => { return b.score - a.score })
    }

    public makeJSON(): { [key: string]: number } {
        let obj: { [key: string]: number } = {};
        this.persons.forEach(person => {
            obj[person.name] = person.score;
        })
        return obj;
    }

    public totalScore(): number {
        return this.persons.reduce((sum, p) => sum + p.score, 0);
    }

    public addPerson(person: Person) : void {
        this.persons.push(person);
    }
}
