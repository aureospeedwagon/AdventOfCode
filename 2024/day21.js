smallInput = `029A
980A
179A
456A
379A`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);

sum = inp => inp.reduce((a, c) => a + c);

memoize = fn => {
    const memo = new Map();

    return function (n) {

        if (memo.has(JSON.stringify(n))) {
            return memo.get(JSON.stringify(n));
        }
        result = fn(n);
        memo.set(JSON.stringify(n), result);
        return result;
    }
};


const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const A = 'A';

const INVALID = null;

const C_STATES = [UP, DOWN, LEFT, RIGHT, A];
const K_STATES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A];
// [rc1, rc2, nc]

buildNodes = () => {

    const nodes = [];

    // Robot
    C_STATES.forEach(x => {
        C_STATES.forEach(y => {
            K_STATES.forEach(z => {
                let loc = [x, y, z];
                let children = getChildNodes(loc);
                let node = {
                    loc,
                    children
                }
                nodes.push(node);
            })
        })

    })
    return nodes;

}

getChildNodes = state => {
    let upChild = updateStateForInput(state, UP);
    let downChild = updateStateForInput(state, DOWN);
    let leftChild = updateStateForInput(state, LEFT);
    let rightChild = updateStateForInput(state, RIGHT);
    let aChild = updateStateForInput(state, A);

    return [
        { loc: upChild, cost: UP },
        { loc: downChild, cost: DOWN },
        { loc: leftChild, cost: LEFT },
        { loc: rightChild, cost: RIGHT },
        { loc: aChild, cost: A }
    ].filter(c => !c.loc.includes(null))
}

updateStateForInput = (state, input) => {
    const [x, y, z] = state;
    if (input === A) {
        if (x === A) {
            if (y === A) {
                return [x, y, z]
            } else {
                return [x, y, getUpdatedKeyPadState(z, y)]
            }
        } else {
            return [x, getUpdatedControllerState(y, x), z]
        }
    } else {
        return [getUpdatedControllerState(x, input), y, z]
    }
}

getUpdatedControllerState = (currentState, input) => {
    switch (currentState) {
        case UP:
            switch (input) {
                case UP:
                    return INVALID;
                case LEFT:
                    return INVALID;
                case DOWN:
                    return DOWN
                case RIGHT:
                    return A;
                case A:
                    return UP;
                default:
                    throw Error('bad input')
            }
        case DOWN:
            switch (input) {
                case UP:
                    return UP;
                case DOWN:
                    return INVALID;
                case LEFT:
                    return LEFT;
                case RIGHT:
                    return RIGHT;
                case A:
                    return DOWN;
                default:
                    throw Error('bad input')
            }
        case LEFT:
            switch (input) {
                case UP:
                    return INVALID;
                case DOWN:
                    return INVALID;
                case LEFT:
                    return INVALID;
                case RIGHT:
                    return DOWN;
                case A:
                    return LEFT;
                default:
                    throw Error('bad input')
            }
        case RIGHT:
            switch (input) {
                case UP:
                    return A;
                case DOWN:
                    return INVALID;
                case LEFT:
                    return DOWN
                case RIGHT:
                    return INVALID;
                case A:
                    return RIGHT;
                default:
                    throw Error('bad input')
            }
        case A:
            switch (input) {
                case UP:
                    return INVALID;
                case DOWN:
                    return RIGHT;
                case LEFT:
                    return UP;
                case RIGHT:
                    return INVALID
                case A:
                    return A;
                default:
                    throw Error('bad input')
            }
        default:
            console.log('bad state:', currentState)
            throw Error('bad state')
    }
}

getUpdatedKeyPadState = (currentState, input) => {
    switch (currentState) {
        case 0:
            switch (input) {
                case UP:
                    return 2;
                case LEFT:
                    return INVALID;
                case DOWN:
                    return INVALID
                case RIGHT:
                    return A;
                case A:
                    return 0;
                default:
                    throw Error('bad input')
            }
        case 1:
            switch (input) {
                case UP:
                    return 4;
                case LEFT:
                    return INVALID;
                case DOWN:
                    return INVALID
                case RIGHT:
                    return 2;
                case A:
                    return 1;
                default:
                    throw Error('bad input')
            }
        case 2:
            switch (input) {
                case UP:
                    return 5;
                case LEFT:
                    return 1;
                case DOWN:
                    return 0;
                case RIGHT:
                    return 3;
                case A:
                    return 2;
                default:
                    throw Error('bad input')
            }
        case 3:
            switch (input) {
                case UP:
                    return 6;
                case LEFT:
                    return 2;
                case DOWN:
                    return A
                case RIGHT:
                    return INVALID;
                case A:
                    return 3;
                default:
                    throw Error('bad input')
            }
        case 4:
            switch (input) {
                case UP:
                    return 7;
                case LEFT:
                    return INVALID;
                case DOWN:
                    return 1
                case RIGHT:
                    return 5;
                case A:
                    return 4;
                default:
                    throw Error('bad input')
            }
        case 5:
            switch (input) {
                case UP:
                    return 8;
                case LEFT:
                    return 4;
                case DOWN:
                    return 2
                case RIGHT:
                    return 6;
                case A:
                    return 5;
                default:
                    throw Error('bad input')
            }
        case 6:
            switch (input) {
                case UP:
                    return 9;
                case LEFT:
                    return 5;
                case DOWN:
                    return 3
                case RIGHT:
                    return INVALID;
                case A:
                    return 6;
                default:
                    throw Error('bad input')
            }
        case 7:
            switch (input) {
                case UP:
                    return INVALID;
                case LEFT:
                    return INVALID;
                case DOWN:
                    return 4
                case RIGHT:
                    return 8;
                case A:
                    return 7;
                default:
                    throw Error('bad input')
            }
        case 8:
            switch (input) {
                case UP:
                    return INVALID;
                case LEFT:
                    return 7;
                case DOWN:
                    return 5
                case RIGHT:
                    return 9;
                case A:
                    return 8;
                default:
                    throw Error('bad input')
            }
        case 9:
            switch (input) {
                case UP:
                    return INVALID;
                case LEFT:
                    return 8;
                case DOWN:
                    return 6
                case RIGHT:
                    return INVALID;
                case A:
                    return 9;
                default:
                    throw Error('bad input')
            }
        case A:
            switch (input) {
                case UP:
                    return 3;
                case LEFT:
                    return 0;
                case DOWN:
                    return INVALID
                case RIGHT:
                    return INVALID;
                case A:
                    return A;
                default:
                    throw Error('bad input')
            }
        default:
            console.log('bad state:', currentState)
            throw Error('bad state')
    }
}


djikstra = (nodesOrig, start, end) => {
    let nodes = [...nodesOrig];
    let distances = new Map();
    let paths = new Map();
    let nodesOnPath = new Map();
    let visited = new Set();

    nodes.forEach(node => {
        if (node.loc.join() === start.join()) {
            distances[node.loc] = 0;
            paths[node.loc] = '';
            nodesOnPath[node.loc] = [node.loc];
            visited.add(node.loc);
        } else {
            paths[node.loc] = '';
            nodesOnPath[node.loc] = [];
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
            if (!visited.has(child.loc)) {
                // Calculate tentative distance to the neighboring node
                let newDistance = distances[closestNode.loc] + 1;

                // If the newly calculated distance is shorter than the previously known distance to this neighbor
                if (newDistance < distances[child.loc]) {
                    // Update the shortest distance to this neighbor
                    distances[child.loc] = newDistance;
                    paths[child.loc] = paths[closestNode.loc] + child.cost
                    // console.log(nodesOnPath[closestNode.loc], closestNode, nodesOnPath)
                    nodesOnPath[child.loc] = [...nodesOnPath[closestNode.loc], child.loc]
                }
            }
        }

    }

    return [distances[end], paths[end], nodesOnPath[end]]
}

solve = (row, nodes) => {
    const init = [A, A, A]
    const waypoints = row.map(r => [A, A, r]);

    let total = 0;
    let path = '';
    waypoints.forEach((w, wi) => {
        let start = waypoints[wi - 1] ?? init;
        // let start = init;
        let end = w;
        // console.log(start, end);
        let d = djikstra(nodes, start, end)[0];
        let p = djikstra(nodes, start, end)[1];
        total += d + 1;
        path += p + A;
    })
    // console.log(total, path);

    return [total, path];
}


final = inp => {
    const rows = parseRows(inp);
    const nodes = buildNodes();

    const solvedRows = rows.map(row => {
        console.log('============', row)
        const solved = solve(row, nodes)[0];
        const code = Number(row.join(``).slice(0, 3));
        console.log(code, solved);
        return solved * code;
    })


    return sum(solvedRows);
}



// part 2 -------------------------------------------------------------------
// 142305813645828 is too low
// 1423058136458280 is too high
// 341269544654012 is not right;
// 261513880944684 is not right;
// 195554470873450 is not right;

// buildNodes2 = (n) => {

//     if (n === 2) {
//         return buildNodes().map(x => x.loc);
//     }
//     let baseNodes = buildNodes2(n - 1);

//     let newNodes = [];
//     C_STATES.forEach(x => {
//         baseNodes.forEach(c => newNodes.push([x, ...c]));
//     });

//     return newNodes;

// }

// buildNodes2 = memoize(buildNodes2);

// getChildNodes2 = state => {
//     //directional inputs
//     let upChild = updateStateForInputRecursively([state, UP]);
//     let downChild = updateStateForInputRecursively([state, DOWN]);
//     let leftChild = updateStateForInputRecursively([state, LEFT]);
//     let rightChild = updateStateForInputRecursively([state, RIGHT]);
//     let aChild = updateStateForInputRecursively([state, A]);

//     return [
//         { loc: upChild, cost: UP },
//         { loc: downChild, cost: DOWN },
//         { loc: leftChild, cost: LEFT },
//         { loc: rightChild, cost: RIGHT },
//         { loc: aChild, cost: A }
//     ].filter(c => !c.loc.includes(null))
// }

// updateStateForInputRecursively = ([state, input]) => {
//     const [x, y, ...rest] = state;
//     if (state.length > 3) {

//         if (input === A) {
//             return [x, ...updateStateForInputRecursively([[y, ...rest], x])];
//         } else {
//             return [getUpdatedControllerState(x, input), y, ...rest]
//         }
//     } else {
//         return updateStateForInput(state, input);
//     }

// }

// updateStateForInputRecursively = memoize(updateStateForInputRecursively);

// solveForRow = (row, robots) => {
//     const init = new Array(robots + 1).fill(A);
//     const waypoints = row.map(r => new Array(robots + 1).fill(A).with(-1, r));

//     let nodes = buildNodes2(robots).map(cn => ({ loc: cn, children: getChildNodes2(cn) }));

//     console.log(nodes);

//     let total = 0;
//     let path = '';
//     let nodesOnPath = new Set();
//     waypoints.forEach((w, wi) => {
//         let start = waypoints[wi - 1] ?? init;
//         // let start = init;
//         let end = w;
//         // console.log(start, end);
//         let dj = djikstra(nodes, start, end)
//         let d = dj[0];
//         let p = dj[1];
//         let pn = dj[2];
//         total += d + 1;
//         path += p + A;
//         nodesOnPath = nodesOnPath.union(new Set(pn));
//     })

//     return total;

// }

// solveForRow2 = (row, robots) => {

//     let nodes = buildNodes();
//     const init = [A, A, A]
//     const waypoints = row.map(r => [A, A, r]);
//     const nodesForWaypoints = new Map();
//     waypoints.forEach((w, wi) => {
//         let start = waypoints[wi - 1] ?? init;
//         let end = w;
//         let dj = djikstra(nodes, start, end);
//         let relevantNodes = dj[2];
//         let newNodes = [];
//         C_STATES.forEach(x => {

//             let nerNodes = relevantNodes.map(rn => {
//                 return {
//                     loc: [x, ...rn],
//                     children: getChildNodes2(rn)
//                 }
//             })

//             nerNodes.forEach(c => newNodes.push(c));
//         });
//         nodesForWaypoints.set(w.at(-1), newNodes);
//     })

//     for (let robotCount = 3; robotCount < robots; robotCount++) {
//         const initR = new Array(robotCount + 1).fill(A);
//         const waypointsR = row.map(r => new Array(robotCount + 1).fill(A).with(-1, r));
//         waypointsR.forEach((w, wi) => {
//             let start = waypointsR[wi - 1] ?? initR;
//             let end = w;
//             let nodesForW = nodesForWaypoints.get(w.at(-1));
//             console.log('nersds', nodesForW, start, end)
//             let dj = djikstra(nodesForW, start, end);
//             console.log('dj', dj)
//             let relevantNodes = dj[2];
//             let newNodes = [];
//             C_STATES.forEach(x => {
//                 let nerNodes = relevantNodes.map(rn => {
//                     return {
//                         loc: [x, ...rn],
//                         children: getChildNodes2(rn)
//                     }
//                 })
//                 console.log('ner', nerNodes)
//                 nerNodes.forEach(c => newNodes.push(c));
//             });
//             console.log('new', newNodes)
//             nodesForWaypoints.set(w.at(-1), newNodes);
//         })
//     }

//     return 0;

// }





// final2 = (inp, robots) => {
//     const rows = parseRows(inp);
//     const solvedRows = rows.map(row => {
//         console.log('============', row)
//         const solved = solveForRow2(row, robots);
//         const code = Number(row.join(``).slice(0, 3));
//         console.log(code, solved);
//         return solved * code;
//     })


//     return sum(solvedRows);
// }


// final2(smallInput, 5);


// previously pointing at prev, want to press next
getParentMoves = (prev, next) => {
    switch (prev) {
        case UP:
            switch (next) {
                case UP:
                    return [A];
                case DOWN:
                    return [DOWN, A]
                case LEFT:
                    return [DOWN, LEFT, A];
                case RIGHT:
                    return [DOWN, RIGHT, A];
                case A:
                    return [RIGHT, A];
                default:
                    console.log('bad next:', next)
                    throw Error('bad next')
            }
        case DOWN:
            switch (next) {
                case UP:
                    return [UP, A];
                case DOWN:
                    return [A];
                case LEFT:
                    return [LEFT, A];
                case RIGHT:
                    return [RIGHT, A];
                case A:
                    return [UP, RIGHT, A];
                default:
                    console.log('bad next:', next)
                    throw Error('bad next')
            }
        case LEFT:
            switch (next) {
                case UP:
                    return [UP, RIGHT, A];
                case DOWN:
                    return [RIGHT, A];
                case LEFT:
                    return [A];
                case RIGHT:
                    return [RIGHT, RIGHT, A];
                case A:
                    return [UP, RIGHT, RIGHT, A];
                default:
                    console.log('bad next:', next)
                    throw Error('bad next')
            }
        case RIGHT:
            switch (next) {
                case UP:
                    return [LEFT, UP, A];
                case DOWN:
                    return [LEFT, A];
                case LEFT:
                    return [LEFT, LEFT, A]
                case RIGHT:
                    return [A];
                case A:
                    return [UP, A];
                default:
                    console.log('bad next:', next)
                    throw Error('bad next')
            }
        case A:
            switch (next) {
                case UP:
                    return [LEFT, A];
                case DOWN:
                    return [LEFT, DOWN, A];
                case LEFT:
                    return [DOWN, LEFT, LEFT, A];
                case RIGHT:
                    return [DOWN, A]
                case A:
                    return [A];
                default:
                    console.log('bad next:', next)
                    throw Error('bad next')
            }
        default:
            console.log('bad prev:', prev)
            throw Error('bad state')
    }
}

getNParentsMoves = ([seq, N, firstChar]) => {
    console.log('level', N, seq, firstChar)
    if (N === 1) {
        console.log(`N=1`)
        return [...seq].map((x, xi) => {
            let prev = seq[xi - 1] ?? firstChar;
            let next = x;
            const parentMoves = getParentMoves(prev, next);
            return parentMoves.join(``);

        }).join(``).length;

    } else {
        let tot = 0;
        // let newSeq = '';
        [...seq].forEach((c, ci) => {
            let prev = seq[ci - 1] ?? firstChar;
            let par = getParentMoves(prev, c).join(``);
            // console.log('par', N, prev, par)
            let moves = getNParentsMoves([par, N - 1, A]);
            // console.log('moves', N, moves)
            tot += moves
            // newSeq += moves[0]
        })
        return tot;
    }

}

getNParentsMoves = memoize(getNParentsMoves);

loadMemo = () => {
    C_STATES.forEach(x => {
        getNParentsMoves([`${x}`, 23, A])
        C_STATES.forEach(y => {
            getNParentsMoves([`${x}${y}`, 23, A])
        })
    })
}



final2 = inp => {
    const rows = parseRows(inp);
    const nodes = buildNodes();

    loadMemo();

    const solvedRows = rows.map(row => {
        console.log('============', row)
        const solvedSeq = solve(row, nodes)[1];
        const solvedSeqCost = getNParentsMoves([solvedSeq, 23, A]);

        const code = Number(row.join(``).slice(0, 3));
        console.log(code, solvedSeqCost);
        return solvedSeqCost * code;
    })


    return sum(solvedRows);
}

final2(bigInput)

// getNParentsMoves(['<>^vA', 4, A])