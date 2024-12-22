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
    const [x, y, z] = state;
    //directional inputs
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
            throw Error('bad state')
    }
}


djikstra = (nodesOrig, start, end) => {
    let nodes = [...nodesOrig];
    let distances = new Map();
    let paths = new Map();
    let visited = new Set();

    nodes.forEach(node => {
        if (node.loc.join() === start.join()) {
            distances[node.loc] = 0;
            paths[node.loc] = '';
            visited.add(node.loc);
        } else {
            paths[node.loc] = '';
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
                }
            }
        }

    }

    return [distances[end], paths[end]]
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

    return total;
}


final = inp => {
    const rows = parseRows(inp);
    const nodes = buildNodes();

    const solvedRows = rows.map(row => {
        console.log('============', row)
        const solved = solve(row, nodes);
        const code = Number(row.join(``).slice(0,3));
        console.log(code, solved);
        return solved * code;
    })


    return sum(solvedRows);
}

final(smallInput);



// part 2


