smallInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``).map(x => Number(x));
};

padArray = inp => {
    parsed = parseRows(inp)
    padded = parsed.map(x => ['.', ...x, '.'])
    padRow = Array(parsed[0].length + 2)
    padRow.fill('.');
    return [padRow, ...padded, padRow];
}
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);

memoize = fn => {
    memo = new Map();

    return function (n) {

        if (memo.has(n)) {
            return memo.get(n);
        }
        result = fn(n);
        memo.set(n, result);
        return result;
    }
}

sum = inp => inp.reduce((a, c) => a + c);

parsedSmall = padArray(smallInput);

// NOT USEFUL
// simplifyMap = inp => {

//     const newMap = [...inp.map(y => [...y])];

//     inp.forEach((y, yi) => {
//         y.forEach((cell, xi) => {
//             if (cell !== '.') {

//                 const north = inp[yi - 1][xi];
//                 const south = inp[yi + 1][xi];
//                 const east = inp[yi][xi + 1];
//                 const west = inp[yi][xi - 1];

//                 const neighbors = new Set([north, south, east, west]);

//                 let isValid = true;
//                 if (cell === 0) {
//                     const necessaryNeighbors = new Set([1]);
//                     isValid = neighbors.intersection(necessaryNeighbors).size === 1;
//                     // console.log(neighbors, necessaryNeighbors, isValid)
//                 } else if (cell === 9) {
//                     const necessaryNeighbors = new Set([8]);
//                     isValid = neighbors.intersection(necessaryNeighbors).size === 1;
//                 } else {
//                     const necessaryNeighbors = new Set([cell - 1, cell + 1]);
//                     isValid = neighbors.intersection(necessaryNeighbors).size === 2;
//                 }

//                 if (!isValid) {
//                     newMap[yi][xi] = '.'
//                 }

//             }



//         });
//     });

//     return newMap;
// }



/// PART 1

//inefficient, could be improved by using similar logic to part 2 by going height based, but I don't feel like doing it.
scoreMap = inp => {
    inp.forEach((y, yi) => {
        y.forEach((cell, xi) => {
            if (cell.height !== '.') {

                const north = inp[yi - 1][xi];
                const south = inp[yi + 1][xi];
                const east = inp[yi][xi + 1];
                const west = inp[yi][xi - 1];

                const neighbors = [north, south, east, west];

                neighbors.forEach(n => {
                    if (n.height === cell.height + 1) {
                        cell.score = cell.score.union(n.score);
                    }
                })
            }


        });
    });

    return inp;
}

loopScoring = inp => {
    let scoringMap = [...inp.map((y, yi) => y.map((x, xi) => ({ height: x, score: x === 9 ? new Set([`${xi},${yi}`]) : new Set() })))];

    for (let i = 0; i < 10; i++) {
        scoringMap = scoreMap(scoringMap)
    }

    return scoringMap;
}


final = inp => {
    const padded = padArray(inp);
    const finalScore = loopScoring(padded);
    return sum(finalScore.flat().filter(x => x.height === 0).map(x => x.score.size))
}



/// PART 2

scoreMap2 = (inp, height) => {


    inp.forEach((y, yi) => {
        y.forEach((cell, xi) => {
            if (cell.height === height) {

                const north = inp[yi - 1][xi];
                const south = inp[yi + 1][xi];
                const east = inp[yi][xi + 1];
                const west = inp[yi][xi - 1];

                const neighbors = [north, south, east, west];

                neighbors.forEach(n => {
                    if (n.height === cell.height + 1) {
                        cell.score += n.score;
                    }
                })
            }


        });
    });

    return inp;
}

loopScoring2 = inp => {
    let scoringMap = [...inp.map(y => y.map(x => ({ height: x, score: x === 9 ? 1 : 0 })))];

    for (let i = 8; i >= 0; i--) {
        scoringMap = scoreMap2(scoringMap, i)
    }

    return scoringMap;
}


final2 = inp => {
    const padded = padArray(inp);
    const finalScore = loopScoring2(padded);
    console.log((finalScore.flat().filter(x => x.height === 0).map(x => x.score)))
    return sum(finalScore.flat().filter(x => x.height === 0).map(x => x.score))
}



// Part 1 again, but better
// probably more clean and efficient than original
scoreMapB = (inp, height) => {
    inp.forEach((y, yi) => {
        y.forEach((cell, xi) => {
            if (cell.height === height) {

                const north = inp[yi - 1][xi];
                const south = inp[yi + 1][xi];
                const east = inp[yi][xi + 1];
                const west = inp[yi][xi - 1];

                const neighbors = [north, south, east, west];

                neighbors.forEach(n => {
                    if (n.height === cell.height + 1) {
                        cell.score = cell.score.union(n.score);
                    }
                })
            }


        });
    });

    return inp;
}

loopScoringB = inp => {
    let scoringMap = [...inp.map((y, yi) => y.map((x, xi) => ({ height: x, score: x === 9 ? new Set([`${xi},${yi}`]) : new Set() })))];

    for (let i=8; i >= 0; i--) {
        scoringMap = scoreMapB(scoringMap, i)
    }

    return scoringMap;
}

finalB = inp => {
    const padded = padArray(inp);
    const finalScore = loopScoringB(padded);
    return sum(finalScore.flat().filter(x => x.height === 0).map(x => x.score.size))
}
