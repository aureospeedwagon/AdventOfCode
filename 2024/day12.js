smallInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;


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
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);

memoize = fn => {
    memo = new Map();

    return function (n) {

        if (memo.has(JSON.stringify(n))) {
            return memo.get(JSON.stringify(n));
        }
        result = fn(n);
        memo.set(JSON.stringify(n), result);
        return result;
    }
};

sum = inp => inp.reduce((a, c) => a + c);


getRegions = inp => {

    const clone = [...inp.map(y => y.map(x => ({ ...x })))];

    clone.forEach((y, yi) => {
        y.forEach((cell, xi) => {
            if (cell.veg !== '.') {
                const north = clone[yi - 1][xi];
                const west = clone[yi][xi - 1];
                const east = clone[yi][xi + 1];
                const south = clone[yi + 1][xi];

                if (cell.veg !== north.veg) {
                    cell.fence.north = 1;
                } else {
                    const union = regionUnion(cell, north);
                    cell.regions = union;
                    north.regions = union;
                }

                if (cell.veg !== east.veg) {
                    cell.fence.east = 1;
                } else {
                    const union = regionUnion(cell, east)
                    cell.regions = union;
                    east.regions = union;
                }

                if (cell.veg !== south.veg) {
                    cell.fence.south = 1;
                } else {
                    const union = regionUnion(cell, south)
                    cell.regions = union;
                    south.regions = union;
                }

                if (cell.veg !== west.veg) {
                    cell.fence.west = 1;
                } else {
                    const union = regionUnion(cell, west)
                    cell.regions = union;
                    west.regions = union;
                }

            }



        });
    });

    return clone;
}

getRegions = memoize(getRegions);

regionUnion = (a, b) => [...new Set([...a.regions, ...b.regions].sort())]


getFences = reg => {
    return sum(reg.map(x => sum([x.fence.north, x.fence.south, x.fence.east, x.fence.west])))
}

final = inp => {
    const parsed = padArray(inp);

    const newMap = [...parsed.map((y, yi) => y.map(
        (cell, xi) => (
            {
                veg: cell,
                fence: { north: 0, south: 0, east: 0, west: 0 },
                regions: [`${xi},${yi}`]
            })
    ))];

    let current = newMap;
    for (let i = 0; i < 150; i++) {
        console.log(i);
        current = getRegions(current);
    }

    const plots = current.flat().filter(x => x.veg !== '.');

    const regions = [...Map.groupBy(plots, x => [...x.regions].join(`|`)).values()]

    console.log("number of regions", regions.length);

    return sum(regions.map(reg => reg.length * getFences(reg)));

    // const regions = new Set(current.flat().filter(x => x.veg !== '.').map(x => [x.veg, [...x.regions].join(`|`)].join('+')))
    // return [...regions].map(x => `${x[0]}+${[...x].filter(c => c === '|').length + 1}`)
}

final(smallInput);