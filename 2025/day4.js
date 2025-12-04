smallInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};

padArray = inp => {
    parsed = parseRows(inp)
    padded = parsed.map(x => ['.', ...x, '.'])
    padRow = Array(parsed[0].length + 2)
    padRow.fill('.');
    return [padRow, ...padded, padRow];
};

unparse = inp => inp.map(x => x.join(``)).join(`\n`);


final = inp => {
    const padded = padArray(inp);
    console.log(unparse(padded));
    accessibleRolls = 0;
    padded.forEach((row, yi) => {
        row.forEach((x, xi) => {

            if (x === '@') {

                const north = padded[yi - 1][xi];
                const northeast = padded[yi - 1][xi + 1];
                const northwest = padded[yi - 1][xi - 1];
                const south = padded[yi + 1][xi];
                const southEast = padded[yi + 1][xi + 1];
                const southWest = padded[yi + 1][xi - 1];
                const east = padded[yi][xi + 1];
                const west = padded[yi][xi - 1];

                const adjacent = [
                    north,
                    northeast,
                    northwest,
                    south,
                    southEast,
                    southWest,
                    east,
                    west
                ];
                // console.log(adjacent);
                const fullSpaces = adjacent.filter(x => x === '@' || x === 'x').length;

                if (fullSpaces < 4) {
                    accessibleRolls += 1;
                    padded[yi][xi] = 'x';
                }
            }
        })
    });
    console.log(unparse(padded));
    return accessibleRolls;
}

final(smallInput);


// part2

removeStep = padded => {
    accessibleRolls = 0;
    padded.forEach((row, yi) => {
        row.forEach((x, xi) => {

            if (x === '@') {

                const north = padded[yi - 1][xi];
                const northeast = padded[yi - 1][xi + 1];
                const northwest = padded[yi - 1][xi - 1];
                const south = padded[yi + 1][xi];
                const southEast = padded[yi + 1][xi + 1];
                const southWest = padded[yi + 1][xi - 1];
                const east = padded[yi][xi + 1];
                const west = padded[yi][xi - 1];

                const adjacent = [
                    north,
                    northeast,
                    northwest,
                    south,
                    southEast,
                    southWest,
                    east,
                    west
                ];
                // console.log(adjacent);
                const fullSpaces = adjacent.filter(x => x === '@' || x === 'x').length;

                if (fullSpaces < 4) {
                    accessibleRolls += 1;
                    padded[yi][xi] = 'x';
                }
            }
        })
    });

    if (accessibleRolls > 0) {
        padded.forEach((row, yi) => {
            row.forEach((x, xi) => {
                if (x == 'x') {
                    padded[yi][xi] = '.';
                }
            })
        })

        return removeStep(padded);
    }

    return padded;
}

final2 = inp => {
    const padded = padArray(inp);
    const startCount = [...inp].filter(x => x === '@').length
    console.log(unparse(padded));

    const end = removeStep(padded);
    console.log(unparse(end));
    const endCount = end.flat().filter(x => x === '@').length

    return startCount - endCount;

}


final2(smallInput);


