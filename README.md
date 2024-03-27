# person-ranker
Your own ballot, with RNG!

# Run
Built for Linux but it COULD work on Windows and Mac.

Generate config files:
```sh
cp persons.json.example persons.json
cp config.json.example config.json
```
* In `config.json`, edit the coordinates to avoid overwriting Lemuria's ballot.
* In `persons.json`, add any name, whether it's you, your alt, someone you're
obsessed with, or really, anything. Or for fun, political candidates - watch
people complain about pigged rolls and election fraud!

Now run:
```sh
yarn install
yarn node build/src/index.js &
disown
```

`&` to run as background process, `disown` to keep it running even when the
terminal is closed (duh).

# Disclaimer
Use responsibly.
