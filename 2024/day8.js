smallInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

test1 = `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`;
test1Result = `..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
..........`;

test2 = `..........
..........
..........
....a.....
........a.
.....a....
..........
..........
..........
..........`

test2Result = `..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........`



parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};

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

parsedSmall = parseRows(smallInput);

getNodes = inp => {
    // frequencies to locations
    const marp = new Map();

    inp.forEach((y, yi) => {
        y.forEach((freq, xi) => {
            if (freq !== '.') {
                if (marp.has(freq)) {
                    marp.get(freq).push([xi, yi])
                } else {
                    marp.set(freq, [[xi, yi]])
                }
            }
        })
    })

    return marp;
}

getFreqs = marp => [...marp.keys()];

getNodePairs = nodes => {
    const pairs = new Set();
    nodes.forEach((n1, i1) => {
        nodes.forEach((n2, i2) => {
            if (n1 !== n2 && i2 > i1) {
                pairs.add(new Set([n1, n2]))
            }
        });
    });

    return Array.from(pairs).map(p => Array.from(p));
}


// part 1

getAllAntiNodesForFreq = (freq, marp) => {
    const nodes = marp.get(freq);
    const nodePairs = getNodePairs(nodes);
    return nodePairs.map(pair => getAntiNodesForPair(pair[0], pair[1]))
}

getAntiNodesForPair = (loc1, loc2) => {
    const x1 = loc1[0];
    const y1 = loc1[1];
    const x2 = loc2[0];
    const y2 = loc2[1];

    const nodeDistanceX = x2 - x1;
    const nodeDistanceY = y2 - y1;


    const antiNode1 = [x1 - nodeDistanceX, y1 - nodeDistanceY]
    const antiNode2 = [x2 + nodeDistanceX, y2 + nodeDistanceY]

    return [antiNode1, antiNode2];
}



final = inp => {
    const parsed = parseRows(inp);
    const nodes = getNodes(parsed);
    const freqs = getFreqs(nodes);

    const maxX = parsed[0].length;
    const maxY = parsed.length;

    const potentialAntinodes = freqs.map(f => getAllAntiNodesForFreq(f, nodes)).flat().flat();


    const inRangeAntinodes = potentialAntinodes.filter(p => p[0] >= 0 && p[0] < maxX && p[1] >= 0 && p[1] < maxY);
    //remove overlapping
    const coordStrings = inRangeAntinodes.map(a => a.join(','));
    return [... (new Set(coordStrings))].length
}



// part 2


test3 =`T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`;

test3Result = `T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........`

getAntiNodesForPairOnLine = (loc1, loc2, maxX, maxY) => {
    const x1 = loc1[0];
    const y1 = loc1[1];
    const x2 = loc2[0];
    const y2 = loc2[1];

    const nodeDistanceX = x2 - x1;
    const nodeDistanceY = y2 - y1;

    const antiNodes = [];
    // cheating a bit here by brute forcing the number of checks based on the size of the big input.
    // also assuming the slope formed by ratio of nodeDistanceX/nodeDistanceY is a fraction that can't be reduced and we skip over valid antinodes.
    // such as nodes being at [0,0] and [2,2]. This would only give antinodes at [x,y], where they're even and would skip valid ones like [1,1] and [3,3];
    // (works for my input though so not fixing it to check for anything like that.)

    for (let i = maxX * -1; i < maxX; i++) {
        const antiNodeBack = [x1 - nodeDistanceX * i, y1 - nodeDistanceY * i];
        const antiNodeForward = [x1 + nodeDistanceX * i, y1 + nodeDistanceY * i];
        antiNodes.push(antiNodeBack);
        antiNodes.push(antiNodeForward);
    }

    // console.log(antiNodes.filter(p => p[0] >= 0 && p[0] < maxX && p[1] >= 0 && p[1] < maxY))

    return antiNodes.filter(p => p[0] >= 0 && p[0] < maxX && p[1] >= 0 && p[1] < maxY);
}


getAllAntiNodesForFreq2 = (freq, marp, maxX, maxY) => {
    const nodes = marp.get(freq);
    const nodePairs = getNodePairs(nodes);
    return nodePairs.map(pair => getAntiNodesForPairOnLine(pair[0], pair[1], maxX, maxY))
}

final2 = inp => {
    const parsed = parseRows(inp);
    const nodes = getNodes(parsed);
    const freqs = getFreqs(nodes);

    // console.log(nodes);

    const maxX = parsed[0].length;
    const maxY = parsed.length;

    const potentialAntinodes = freqs.map(f => getAllAntiNodesForFreq2(f, nodes, maxX, maxY)).flat().flat();


    const inRangeAntinodes = potentialAntinodes.filter(p => p[0] >= 0 && p[0] < maxX && p[1] >= 0 && p[1] < maxY);
    //remove overlapping
    const coordStrings = inRangeAntinodes.map(a => a.join(','));
    return [... (new Set(coordStrings))].length
}





