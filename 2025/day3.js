smallInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``).map(x => Number(x));
};

sum = inp => inp.reduce((a, c) => a + c);

final = inp => {
    const parsed = parseRows(inp);
    const joltages = [];
    parsed.forEach(bank => {
        biggest = 0;
        nextBiggest = 0
        bank.forEach((bat, i) => {
            if (i !== bank.length - 1) {
                if (bat > biggest) {
                    biggest = bat;
                    nextBiggest = 0;
                } else if (bat > nextBiggest) {
                    nextBiggest = bat;
                }
            } else {
                if (bat > nextBiggest) {
                    nextBiggest = bat;
                }
            }
        });

        joltages.push('' + biggest + nextBiggest);

    });
    return sum(joltages.map(x=>Number(x)));
}

final(smallInput);

// part 2
final2 = inp => {
    const parsed = parseRows(inp);
    const joltages = [];
    parsed.forEach(bank => {
        onBats = [];
        bank.forEach((bat) => {
            if (onBats.length < 12) {
                onBats.push(bat);
            } else {
                best = Number(onBats.join(``));
                onBats.forEach((b,i) => {
                    gnu = Number([...onBats.slice(0,i), ...onBats.slice(i+1), bat].join(``));
                    if (gnu > best) {
                        best = gnu;
                    }
                });
                onBats = String(best).split(``);
            }



        });

        // console.log(onBats.join(''));
        joltages.push(onBats.join(''));

    });
    return sum(joltages.map(x=>Number(x)));
}

final2(smallInput);