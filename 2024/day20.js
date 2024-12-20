smallInput = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


djikstra = (nodesOrig, start, end) => {
    let nodes = [...nodesOrig];
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
        nodes.length % 100 ? 0 : console.log('nodes left', nodes.length);
        nodes.sort((a, b) => distances[a.loc] - distances[b.loc]);
        let closestNode = nodes.shift();
        // console.log('CN', closestNode)
        if (distances[closestNode.loc] === Infinity) {
            // console.log('broke')
            break;
        }
        visited.add(closestNode.loc);

        // console.log(closestNode)


        let validChildren = [...closestNode.children];


        for (let child of validChildren) {
            // console.log('child', child)
            // If the neighbor hasn't been visited yet
            if (!visited.has(child)) {
                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode.loc] + 1;
                // console.log(newDistance, distances[child])
                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[child]) {
                    // Update the shortest distance to this neighbor
                    distances[child] = newDistance;
                }
            }
        }

    }

    // console.log(distances, visited)

    return distances;
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

            let childLocs = [nloc, sloc, eloc, wloc]
                .filter(loc => {
                    return marp?.[loc[1]]?.[loc[0]] === '.'
                        || marp?.[loc[1]]?.[loc[0]] === 'S'
                        || marp?.[loc[1]]?.[loc[0]] === 'E'
                })

            let node = {
                loc: [xi, yi],
                value: cell,
                children: childLocs,
            };
            nodes.push(node);


        })
    })
    return nodes;
}


final = inp => {
    const marp = parseRows(inp);

    let start;
    let end;
    marp.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell == 'S') {
                start = [xi, yi];
            }
            if (cell == 'E') {
                end = [xi, yi];
            }
        })
    })

    const nodes = buildNodes(marp);
    let normalNodes = nodes.filter(n => n.value !== '#');
    const forward = djikstra(normalNodes, start, end);
    const normalSpeed = forward[end];

    // console.log(forward)

    const cheatSpeeds = [];

    marp.forEach((row, yi) => {
        console.log('row', yi)
        row.forEach((cell, xi) => {
            if (!(xi === 0 || yi === 0 || xi === (row.length - 1) || (yi === marp.length - 1))) {

                if (cell === '#') {

                    const nloc = [xi, yi - 1]
                    const sloc = [xi, yi + 1]
                    const eloc = [xi + 1, yi]
                    const wloc = [xi - 1, yi]

                    let childLocs = [nloc, sloc, eloc, wloc]
                        .filter(loc => {
                            return marp?.[loc[1]]?.[loc[0]] === '.'
                                || marp?.[loc[1]]?.[loc[0]] === 'S'
                                || marp?.[loc[1]]?.[loc[0]] === 'E'
                        });

                    const pairs = new Set();
                    childLocs.forEach((n1, i1) => {
                        childLocs.forEach((n2, i2) => {
                            if (n1 !== n2 && i2 > i1) {
                                pairs.add(new Set([n1, n2]))
                            }
                        });
                    });

                    if (pairs.size) {


                        const cheatSpeed = Math.min(...[...pairs].map(pair => {
                            const [p1, p2] = [...pair];

                            const p1F = forward[p1];
                            const p2B = normalSpeed - forward[p2];
                            const pA = p1F + p2B + 2

                            const p1B = normalSpeed - forward[p1];
                            const p2F = forward[p2];
                            const pB = p1B + p2F + 2

                            return Math.min(pA, pB);
                        }));

                        cheatSpeeds.push(cheatSpeed)
                    }
                }
            }
        })
    })


    const diffs = cheatSpeeds.map(t => normalSpeed - t).filter(t => t > 0)
    // console.log(normalSpeed, diffs);
    // return Map.groupBy(diffs.sort((a, b) => a - b), x => x);
    return diffs.filter(s => s >= 100).length
}

final(smallInput);
