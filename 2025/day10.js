smallInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

sum = inp => inp.reduce((a, c) => a + c);

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

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));

parseRow = inp => {
    let all = inp.split(' ');
    lights = all.shift();
    jolts = all.pop();

    parsedLights = parseLight(lights);
    parsedButtons = all.map(b => parseButton(b));
    parsedJolts = parseJolts(jolts);

    return { lights: parsedLights, buttons: parsedButtons, jolts: parsedJolts };

}

parseLight = inp => {
    return inp.slice(1, -1);
};

parseButton = inp => {
    return inp.slice(1, -1).split(`,`).map(x => Number(x));
};


parseJolts = inp => {
    return inp.slice(1, -1);
};

unparse = inp => inp.map(x => x.join(``)).join(`\n`);




updateState = (state, button) => {
    const newState = [...state].map(x => x === '#' ? true : false);
    button.forEach(tog => {
        newState[tog] = !newState[tog];
    });
    const childState = newState.map(x => x ? '#' : '.').join('');

    return childState;
}

getChildStates = (state, buttons) => {
    const childStates = buttons.map(b => updateState(state, b));
    return childStates;
}


moddedDjikstra = (nodesOrig, start, end, buttons) => {
    let nodes = [...nodesOrig];
    let distances = new Map();
    let visited = new Set();

    nodes.forEach(node => {
        if (node === start) {
            distances[node] = 0;
            visited.add(node);
        } else {
            distances[node] = Infinity;
        }
    });

    // console.log('ndv', nodes, distances, visited);

    while (nodes.length) {
        // console.log(nodes.length);
        nodes.sort((a, b) => distances[a] - distances[b]);
        let closestNode = nodes.shift();
        if (distances[closestNode] === Infinity) {
            // console.log('broke')
            break;
        }
        visited.add(closestNode);

        // console.log(closestNode)
        const children = getChildStates(closestNode, buttons);

        for (let child of children) {

            if (!distances[child]) {
                distances[child] = Infinity;
                nodes = [...nodes, child]
            }

            // If the neighbor hasn't been visited yet
            if (!visited.has(child)) {

                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode] + 1;

                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[child]) {
                    // Update the shortest distance to this neighbor
                    distances[child] = newDistance;
                }
            }
        }

    }

    console.log('dend', distances[end])
    return distances[end]
}

solveRow = row => {
    let buttons = row.buttons;
    let goal = row.lights;
    let start = [...goal].map(x => '.').join('');

    let nodes = [start, goal];

    // console.log(buttons)
    // console.log(start)
    // console.log(goal)
    return moddedDjikstra(nodes, start, goal, buttons)


}

final = inp => {
    const rows = parseRows(inp);
    return sum(rows.map(r => solveRow(r)));
}

// final(smallInput);


// part 2 ----------------------------------------------------------------------

// updateState2 = (state, button) => {
//     // console.log('s', state)
//     const newState = state.split(',').map(x => Number(x));
//     button.forEach(tog => {
//         newState[tog] += 1;
//     });

//     // console.log('cs', newState)
//     return newState.join();
// }

// // TOO MANY JOLTS
// isInvalidState = (state, goal) => {
//     let goalArr = goal.split(',').map(x=>Number(x));
//     let stateArr = state.split(',').map(x=>Number(x));

//     bad = false;
//     goalArr.forEach((g, i) => {
//         if (stateArr[i] > g) {
//             bad = true;
//         }
//     });
//     return bad;
// }

// getChildStates2 = ([state, buttons, goal]) => {
//     const childStates = buttons.map(b => updateState2(state, b));
//     return childStates.filter(cs => !isInvalidState(cs, goal));
// }

// getChildStates2 = memoize(getChildStates2)


// moddedDjikstra2 = (nodesOrig, start, end, buttons) => {
//     let nodes = [...nodesOrig];
//     let distances = new Map();
//     let visited = new Set();

//     nodes.forEach(node => {
//         if (node === start) {
//             distances[node] = 0;
//             visited.add(node);
//         } else {
//             distances[node] = Infinity;
//         }
//     });

//     // console.log('ndv', nodes, distances, visited);

//     while (nodes.length) {
//         console.log('nodes', nodes.length);
//         nodes.sort((a, b) => distances[a] - distances[b]);
//         let closestNode = nodes.shift();
//         if (distances[closestNode] === Infinity) {
//             // console.log('broke')
//             break;
//         }
//         visited.add(closestNode);

//         // console.log(closestNode)
//         const children = getChildStates2([closestNode, buttons, end]);

//         for (let child of children) {

//             if (!distances[child]) {
//                 distances[child] = Infinity;
//                 nodes = [...nodes, child]
//             }

//             // If the neighbor hasn't been visited yet
//             if (!visited.has(child)) {

//                 // Calculate tentative distance to the neighboring node
//                 let newDistance = distances[closestNode] + 1;

//                 // If the newly calculated distance is shorter than the previously known distance to this neighbor
//                 if (newDistance < distances[child]) {
//                     // Update the shortest distance to this neighbor
//                     distances[child] = newDistance;
//                 }
//             }
//         }

//     }

//     console.log('dend', distances[end])
//     return distances[end]
// }

// solveRow2 = (row, i) => {
//     console.log('working on row', i)
//     let buttons = row.buttons;
//     let goal = row.jolts;
//     let start = goal.split(',').map(x => 0).join();

//     let nodes = [start, goal];

//     // console.log('b', buttons)
//     // console.log('s', start)
//     // console.log('g', goal)
//     return moddedDjikstra2(nodes, start, goal, buttons)


// }

// final2 = inp => {
//     const rows = parseRows(inp);
//     // return solveRow2(rows[0]);
//     console.log('number of rows', rows.length)
//     return sum(rows.map((r,i) => solveRow2(r, i)));
// }

// final2(smallInput);

// dijkstra had too many possible nodes.
// probably should do something with a system of equations, solve with matrix multiplication
// but I don't feel like doing it.