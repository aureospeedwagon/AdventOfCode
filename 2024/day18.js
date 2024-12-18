smallInput = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;


parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(`,`);
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

mod = (x, mod) => {
    return (x % mod + mod) % mod;
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


buildMap = (inp, size) => {
    let marp = new Array(size + 1);
    marp.fill([])
    marp = marp.map(x => (new Array(size + 1)).fill('.'))

    inp.forEach(([xi, yi]) => {
        marp[yi][xi] = '#';
    })
    return marp;
}



buildNodes = marp => {
    const nodes = [];
    // console.log(marp)
    // console.log(unparse(marp))
    marp.forEach((row, yi) => {
        row.forEach((cell, xi) => {

            const nloc = [xi, yi - 1]
            const sloc = [xi, yi + 1]
            const eloc = [xi + 1, yi]
            const wloc = [xi - 1, yi]

            // console.log([nloc, sloc, eloc, wloc]);
            // console.log([nloc, sloc, eloc, wloc].map(x=> marp?.[loc[1]]?.[loc[0]]));

            if (cell === '.') {

                childLocs = [nloc, sloc, eloc, wloc]
                    .filter(loc => marp?.[loc[1]]?.[loc[0]] === '.')


                let node = {
                    loc: [xi, yi],
                    value: cell,
                    children: childLocs
                };
                nodes.push(node);
            }

        })
    })
    return nodes;
}

djikstra = (nodes, start, end) => {
    let distances = new Map();
    let visited = new Set();

    nodes.forEach(node => {
        if (node.loc[0] === start[0] && node.loc[1] === start[1]) {
            distances[node.loc] = 0;
            visited.add(node.loc);
        } else {
            distances[node.loc] = Infinity;
        }
    });

    // console.log('ndv', nodes, distances, visited);

    while (nodes.length) {
        // console.log(nodes.length);
        nodes.sort((a, b) => distances[a.loc] - distances[b.loc]);
        let closestNode = nodes.shift();
        if (distances[closestNode.loc] === Infinity) {
            // console.log('broke')
            break;
        }
        visited.add(closestNode.loc);

        // console.log(closestNode)
        for (let child of closestNode.children) {
            // If the neighbor hasn't been visited yet
            if (!visited.has(child)) {
                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode.loc] + 1;

                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[child]) {
                    // Update the shortest distance to this neighbor
                    distances[child] = newDistance;
                }
            }
        }

    }

    return distances[end]
}



final = (inp, size, bytes) => {
    const parsed = parseRows(inp).slice(0, bytes + 1);
    // console.log(parsed);
    const marp = buildMap(parsed, size);
    const nodes = buildNodes(marp);
    // console.log(unparse(marp))
    return djikstra(nodes, [0, 0], [size, size])
}


// Part 2

//// original solution, runs at speed of smell
// final2x = (inp, size) => {
//     const parsed = parseRows(inp);


//     for (let i = 0; i < parsed.length; i++) {
//         // console.log('================')
//         console.log(i)
//         if (final(inp, size, i) 0== Infinity) {
//             return parsed[i]
//         }

//     }
// }

final2 = (inp, size) => {
    const parsed = parseRows(inp);


    // counting down is faster than counting up since there are fewer nodes to djikstra
    // probably also could have done a binary search instead
    for (let i = parsed.length; i > 0; i--) {
        // console.log('================')
        console.log(i)
        if (final(inp, size, i) !== Infinity) {
            return parsed[i + 1]
        }

    }
}


// better solution
final2b = (inp, size) => {
    const parsed = parseRows(inp);

    let min = 0;
    let max = parsed.length;

    while (max - min > 1) {
        console.log (min, max)
        let current = Math.floor((max + min) / 2);
        if (final(inp, size, current) === Infinity) {
            max = current;
        } else {
            min = current;
        }
    }
    console.log (min, max)
    return parsed[max]
}


final2b(smallInput, 6)
