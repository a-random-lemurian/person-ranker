create table person if not exists (
    id integer primary key,
    name text
);

create table run (
    id integer primary key
);

create table iteration if not exists (
    id integer primary key,
    run_id integer primary key,
    foreign key (run_id) references run(id)
);

create table ranking if not exists (
    id integer primary key,
    person_id integer,
    iteration_id integer,
    score integer,
    rank integer,

    foreign key (person_id) references person(id),
    foreign key (iteration_id) references iteration(id)
);

create index idx_person on person (name asc);
create index idx_ranking on ranking (person_id asc, score asc);
