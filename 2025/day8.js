smallInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(`,`).map(x => Number(x));
};

sum = inp => inp.reduce((a, c) => a + c);
mul = inp => inp.reduce((a, c) => a * c);

distance = (nodeA, nodeB) => {
    dx = Math.abs(nodeA[0] - nodeB[0])
    dy = Math.abs(nodeA[1] - nodeB[1])
    dz = Math.abs(nodeA[2] - nodeB[2])

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}


mergeClusters = (clusters, maxDepth) => {

    if (clusters.length === 1 || maxDepth === 0) {
        return clusters;
    }

    let c0 = clusters.shift();
    let clusterSomething = false;
    let newClusters = clusters.map(c => {
        if (c.intersection(c0).size > 0) {
            clusterSomething = true;
            return c.union(c0);
        } else {
            return c;
        }
    });

    if (clusterSomething) {
        return mergeClusters(newClusters, newClusters.length);
    } else {
        return mergeClusters([...newClusters, c0], maxDepth - 1);
    }

}


final = (inp, connections) => {
    const nodes = parseRows(inp);

    const distances = [];

    nodes.forEach((nodeA, ia) => {
        nodes.forEach((nodeB, ib) => {
            if (ia < ib) {
                dist = distance(nodeA, nodeB)
                distances.push([ia, ib, dist])
            }
        });
    });
    console.log('distances', distances)
    const sortedDistances = distances.toSorted((a, b) => a[2] - b[2]).slice(0, connections);
    console.log('sd', sortedDistances);
    const pairs = sortedDistances.map(x => [x[0], x[1]]).toSorted((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : a[1] - b[1]);

    console.log('pairs', pairs)


    let directConnectionMap = new Map();

    pairs.forEach((pair, pi) => {
        if (directConnectionMap.has(pair[0])) {
            let curr = directConnectionMap.get(pair[0]);
            directConnectionMap.set(pair[0], new Set([...curr, pair[1]]));
        } else {
            directConnectionMap.set(pair[0], new Set([pair[0], pair[1]]))
        }

        if (directConnectionMap.has(pair[1])) {
            let curr = directConnectionMap.get(pair[1]);
            directConnectionMap.set(pair[1], new Set([...curr, pair[0]]));
        } else {
            directConnectionMap.set(pair[1], new Set([pair[1], pair[0]]))
        }

    });

    console.log('dircon', directConnectionMap);

    let clusters = Array.from(directConnectionMap.values());
    console.log('clusters', clusters);
    let merged = mergeClusters(clusters, clusters.length);

    console.log('M', merged.map(x => Array.from(x)));


    let unique = Array.from(new Set(merged.map(x => Array.from(x).toSorted().join()))).map(x => x.split(',').map(x => Number(x))).toSorted((a, b) => b.length - a.length);
    console.log('unique', unique)
    let circuitSizes = unique.map(x => x.length).toSorted((a, b) => b - a);
    console.log('sizes', circuitSizes);

    return mul(circuitSizes.slice(0, 3));
}

// final(smallInput, 10);


// 4320 is wrong
// 5202 is wrong
// 4352 is wrong
// 648 is wrong
// 95760 is wrong
// 97384 is right



// part 2

final2a = (inp, connections) => {
    const nodes = parseRows(inp);

    const distances = [];

    nodes.forEach((nodeA, ia) => {
        nodes.forEach((nodeB, ib) => {
            if (ia < ib) {
                dist = distance(nodeA, nodeB)
                distances.push([ia, ib, dist])
            }
        });
    });

    console.log('d', distances.length);
    const sortedDistances = distances.toSorted((a, b) => a[2] - b[2]).slice(0, connections);
    console.log('sd', sortedDistances);
    const pairs = sortedDistances.map(x => [x[0], x[1]]).toSorted((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : a[1] - b[1]);

    console.log('pairs', pairs)


    let directConnectionMap = new Map();

    pairs.forEach((pair, pi) => {
        if (directConnectionMap.has(pair[0])) {
            let curr = directConnectionMap.get(pair[0]);
            directConnectionMap.set(pair[0], new Set([...curr, pair[1]]));
        } else {
            directConnectionMap.set(pair[0], new Set([pair[0], pair[1]]))
        }

        if (directConnectionMap.has(pair[1])) {
            let curr = directConnectionMap.get(pair[1]);
            directConnectionMap.set(pair[1], new Set([...curr, pair[0]]));
        } else {
            directConnectionMap.set(pair[1], new Set([pair[1], pair[0]]))
        }

    });

    console.log('dircon', directConnectionMap);

    let clusters = Array.from(directConnectionMap.values());
    // console.log('clusters', clusters);
    let merged = mergeClusters(clusters, clusters.length);

    console.log('M', merged.map(x => Array.from(x)));

    let unique = Array.from(new Set(merged.map(x => Array.from(x).toSorted().join()))).map(x => x.split(',').map(x => Number(x))).toSorted((a, b) => b.length - a.length);

    return unique.length;
}


// There's definitely a better way of doing this. 
// Should probably come up with a general solution, 
// probably something with memoizing or doing something fancy with looping through distances and updating clusters at each connection,
// but it's 2am and I don't care anymore.
// bruteforce search using final2a shows two clusters at 5000 connections with 998 in one and 2 in the other, total 1000 nodes, so no singleton clusters hidden somewhere.
// nodes in smaller cluster are ids 273 and 720

final2 = inp => {
    const nodes = parseRows(inp);
    const distances = [];

    const node1 = nodes[273];
    const node2 = nodes[720];

    nodes.forEach((nodeA, ia) => {
        if (ia !== 720 && ia !== 273) {
            dist1 = distance(nodeA, node1)
            distances.push([ia, 273, dist1])
            dist2 = distance(nodeA, node2)
            distances.push([ia, 720, dist2])
        }
    });

    distances.sort((a, b) => a[2] - b[2])

    console.log(distances);
    const shortest = distances[0];
    console.log(shortest);

    const short0 = nodes[shortest[0]];
    const short1 = nodes[shortest[1]];


    return short0[0] * short1[0];
}


/// For reference, the necessary connection ends up being at connection 129403

// 36380850 is too low
// 9003685096 is right

