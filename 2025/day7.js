smallInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};
unparse = inp => inp.map(x => x.join(`,`)).join(`\n`);


final = inp => {
    const parsed = parseRows(inp);
    splitHit = 0;
    parsed.forEach((row, ri) => {
        row.forEach((val, ci) => {

            if (ri !== 0) {
                const above = parsed[ri - 1][ci];
                if (above === '|' || above === 'S') {
                    if (val === '.') {
                        parsed[ri][ci] = '|';
                    } else if (val === '^') {
                        parsed[ri][ci - 1] = '|';
                        parsed[ri][ci + 1] = '|';
                        splitHit++;
                    }
                }
            }
        })
    });
    console.log(unparse(parsed));

    return splitHit;
}

// final(smallInput);


//part 2

sum = inp => inp.reduce((a, c) => a + c);

parseRows2 = inp => inp.split(`\n`).map(x => parseRow2(x));
parseRow2 = inp => {
    return inp.split(``).map(x => x === '.' ? 0 : x).map(x => x === 'S' ? 1 : x);
};

final2 = inp => {
    const parsed = parseRows2(inp);
    splitHit = 0;
    parsed.forEach((row, ri) => {
        row.forEach((val, ci) => {

            if (ri !== 0) {
                const above = parsed[ri - 1][ci];
                if (above > 0) {
                    if (typeof val === 'number') {
                        parsed[ri][ci] += above;
                    } else if (val === '^') {
                        parsed[ri][ci - 1] += above;
                        parsed[ri][ci + 1] += above;
                    }
                }
            }
        })
    })
    // console.log(unparse(parsed));
    return sum(parsed.at(-1));
}

final2(smallInput);
