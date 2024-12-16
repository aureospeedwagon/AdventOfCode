smallInput = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;


smallInput2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

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
sum = inp => inp.reduce((a, c) => a + c);

gcd = (a, b) => {
    for (let temp = b; b !== 0;) {
        b = a % b;
        a = temp;
        temp = b;
    }
    return a;
}

lcm = (a, b) => {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
}

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

final = inp => {
    const parsed = parseRows(inp);

    const map3d = JSON.parse(JSON.stringify(parsed));

    let start;
    let end;
    const nodesMap = map3d.map((row, yi) => {

        return row.map((cell, xi) => {

            if (cell === 'S') {
                start = [xi, yi];
                return [
                    {
                        loc: [xi, yi, 0],
                        heading: '^',
                        value: '.',
                        children: [
                            [[xi, yi, 1], 1000],
                            [[xi, yi, 3], 1000],
                            [[xi, yi - 1, 0], 1],
                        ]
                    },
                    {
                        loc: [xi, yi, 1],
                        heading: '>',
                        value: cell,
                        children: [
                            [[xi, yi, 0], 1000],
                            [[xi, yi, 2], 1000],
                            [[xi + 1, yi, 1], 1],
                        ]
                    },
                    {
                        loc: [xi, yi, 2],
                        heading: 'v',
                        value: '.',
                        children: [
                            [[xi, yi, 1], 1000],
                            [[xi, yi, 3], 1000],
                            [[xi, yi + 1, 2], 1],
                        ]
                    },
                    {
                        loc: [xi, yi, 3],
                        heading: '<',
                        value: '.',
                        children: [
                            [[xi, yi, 0], 1000],
                            [[xi, yi, 2], 1000],
                            [[xi - 1, yi, 3], 1],
                        ]
                    }
                ]
            }
            if (cell === 'E') {
                end = [xi, yi];
                return [
                    {
                        loc: [xi, yi, 0],
                        heading: '^',
                        value: cell,
                        children: []
                    },
                    {
                        loc: [xi, yi, 1],
                        heading: '>',
                        value: cell,
                        children: []
                    },
                    {
                        loc: [xi, yi, 2],
                        heading: 'v',
                        value: cell,
                        children: []
                    },
                    {
                        loc: [xi, yi, 3],
                        heading: '<',
                        value: cell,
                        children: []
                    }
                ]
            }


            return [
                {
                    loc: [xi, yi, 0],
                    heading: '^',
                    value: cell,
                    children: [
                        [[xi, yi, 1], 1000],
                        [[xi, yi, 3], 1000],
                        [[xi, yi - 1, 0], 1],
                    ]
                },
                {
                    loc: [xi, yi, 1],
                    heading: '>',
                    value: cell,
                    children: [
                        [[xi, yi, 0], 1000],
                        [[xi, yi, 2], 1000],
                        [[xi + 1, yi, 1], 1],
                    ]
                },
                {
                    loc: [xi, yi, 2],
                    heading: 'v',
                    value: cell,
                    children: [
                        [[xi, yi, 1], 1000],
                        [[xi, yi, 3], 1000],
                        [[xi, yi + 1, 2], 1],
                    ]
                },
                {
                    loc: [xi, yi, 3],
                    heading: '<',
                    value: cell,
                    children: [
                        [[xi, yi, 0], 1000],
                        [[xi, yi, 2], 1000],
                        [[xi - 1, yi, 3], 1],
                    ]
                }
            ]
        })
    })


    const nodes = nodesMap.flat(2).filter(x => x.value !== '#');

    // console.log(nodes);

    let distances = new Map();
    let visited = new Set();

    nodes.forEach(node => {
        if (node.value === 'S') {
            distances[node.loc] = 0;
            visited.add(node.loc);
        } else {
            distances[node.loc] = Infinity;
        }
    });

    while (nodes.length) {
        nodes.sort((a, b) => distances[a.loc] - distances[b.loc]);
        let closestNode = nodes.shift();
        if (distances[closestNode.loc] === Infinity) {
            break;
        }
        visited.add(closestNode.loc);

        // console.log(closestNode)
        for (let child of closestNode.children) {
            // console.log('c',child);
            let [neighborId, cost] = child;
            // console.log(nodesMap);
            const neighbor = nodesMap[neighborId[1]][neighborId[0]][neighborId[2]];
            // console.log(neighbor);
            if (neighbor.value === '#') {
                break;
            }


            // If the neighbor hasn't been visited yet
            if (!visited.has(neighbor.loc)) {
                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode.loc] + cost;
                
                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[neighbor.loc]) {
                    // Update the shortest distance to this neighbor
                    distances[neighbor.loc] = newDistance;
                }
            }
        }

    }

    
    // return Object.entries(distances);
    const ends =  Object.entries(distances).filter(x=> x[0].startsWith(`${end.join()},`)).map(x=>x[1]);
    return Math.min(...ends);

}

