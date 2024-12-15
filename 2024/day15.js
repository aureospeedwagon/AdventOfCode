smallInputMap = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########`;

smallInputDir = `<^^>>>vv<v>>v<<`;


mediumInputMap = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########`

mediumInputDir = `<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`


parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};

parseDir = inp => inp.split(`\n`).join(``).split(``)

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


/// part 1

step = (marp, dir, curX, curY) => {

    let updated = JSON.parse(JSON.stringify(marp));

    const n = updated[curY - 1][curX];
    const s = updated[curY + 1][curX];
    const e = updated[curY][curX + 1];
    const w = updated[curY][curX - 1];

    switch (dir) {
        case '^':
            switch (n) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY - 1][curX] = '@';
                    return [updated, curX, curY - 1]
                case '#':
                    return [updated, curX, curY]
                case 'O':
                    return pushO(updated, dir, curX, curY);
                default:
                    console.log('^ bad cell???', dir, n);
                    break;
            }
            break;
        case 'v':
            switch (s) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY + 1][curX] = '@';
                    return [updated, curX, curY + 1]
                case '#':
                    return [updated, curX, curY]
                case 'O':
                    return pushO(updated, dir, curX, curY);
                default:
                    console.log('v bad cell???', dir, s);
                    break;
            }
            break;
        case '<':
            switch (w) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY][curX - 1] = '@';
                    return [updated, curX - 1, curY]
                case '#':
                    return [updated, curX, curY]
                case 'O':
                    return pushO(updated, dir, curX, curY);
                default:
                    console.log('< bad cell???', dir, w);
                    break;

            }
            break;
        case '>':
            switch (e) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY][curX + 1] = '@';
                    return [updated, curX + 1, curY]
                case '#':
                    return [updated, curX, curY]
                case 'O':
                    return pushO(updated, dir, curX, curY);
                default:
                    console.log('> bad cell???', dir, e);
                    break;
            }
            break;
        default:
            console.log('bad dir???', dir);
            break;
    }

    console.log("=========================")
    console.log('how did i get here?')
    console.log(unparse(marp), dir, curX, curY, n, s, e, w)
    console.log("=========================")
    return [updated, curX, curY]
}

pushO = (marp, dir, curX, curY) => {
    let updated = JSON.parse(JSON.stringify(marp));


    let newX = curX;
    let newY = curY;
    switch (dir) {
        case '^':

            const columnUp = [];
            for (let yi = curY; yi >= 0; yi--) {
                columnUp.push(updated[yi][curX])
            }
            const pushedUp = simplify(columnUp);
            console.log('uuu', columnUp);
            console.log('uuu', pushedUp);

            for (let yi = curY; yi >= 0; yi--) {
                const upd = pushedUp.shift();
                if (upd === '@') {
                    newY = yi;
                }
                updated[yi][curX] = upd;
            }

            return [updated, newX, newY]

        case 'v':
            const columnDown = [];
            for (let yi = curY; yi < marp.length; yi++) {
                columnDown.push(updated[yi][curX])
            }
            const pushedDown = simplify(columnDown)
            console.log('ddd', columnDown);
            console.log('ddd', pushedDown);

            for (let yi = curY; yi < marp.length; yi++) {
                const upd = pushedDown.shift();
                if (upd === '@') {
                    newY = yi;
                }
                updated[yi][curX] = upd;
            }

            return [updated, newX, newY]
        case '<':
            const columnLeft = [];
            for (let xi = curX; xi >= 0; xi--) {
                columnLeft.push(updated[curY][xi])
            }
            const pushedLeft = simplify(columnLeft);
            console.log('lll', columnLeft);
            console.log('lll', pushedLeft);


            for (let xi = curX; xi >= 0; xi--) {
                const upd = pushedLeft.shift();
                if (upd === '@') {
                    newX = xi;
                }
                updated[curY][xi] = upd;
            }

            return [updated, newX, newY]
        case '>':
            const columnRight = [];
            for (let xi = curX; xi < marp[0].length; xi++) {
                columnRight.push(updated[curY][xi])
            }
            const pushedRight = simplify(columnRight);
            console.log('rrr', columnRight);
            console.log('rrr', pushedRight);

            for (let xi = curX; xi < marp[0].length; xi++) {
                const upd = pushedRight.shift();
                if (upd === '@') {
                    newX = xi;
                }
                updated[curY][xi] = upd;
            }
            return [updated, newX, newY]
    }
}

simplify = row => {
    const statuses = row.map(x => {
        return {
            val: x,
            pushing: null,
            pushable: null,
        }
    });

    statuses.forEach((x, i) => {
        switch (x.val) {
            case '@':
                x.pushing = true;
                break;
            case '#':
                x.pushing = false;
                break;
            case '.':
                x.pushing = statuses[i - 1].pushing === true ? 'E' : false;
                break;
            case 'O':
                x.pushing = statuses[i - 1].pushing === true;
                break;
        }
    })

    statuses.reverse();
    statuses.forEach((x, i) => {
        switch (x.val) {
            case '@':
            case 'O':
                x.pushable = !!statuses[i - 1].pushable;
                break;
            case '#':
                x.pushable = false;
                break;
            case '.':
                x.pushable = 'E';
                break;
        }
    });

    statuses.reverse();

    console.log('statuses', statuses);

    if (!statuses[0].pushable) {
        return row;
    } else {
        const newRow = ['.'];
        statuses.forEach((s, si) => {
            if (s.pushing && s.pushable === true) {
                newRow.push(s.val);
            } else if (s.pushing === 'E' && s.pushable === 'E') {
                // do nothing;
            } else {
                newRow.push(s.val);
            }
        })

        return newRow;
    }

}


final = (inpMap, inpDir) => {
    const parsedMap = parseRows(inpMap);
    const parsedDir = parseDir(inpDir);

    let curX;
    let curY;
    parsedMap.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell === '@') {
                curX = xi;
                curY = yi;
            }
        })
    })

    let current = parsedMap;
    parsedDir.forEach(d => {
        console.log('----------------------');
        console.log(d);
        [current, curX, curY] = step(current, d, curX, curY);
        console.log(unparse(current))
    })


    let coordSum = 0;
    current.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell === 'O') {
                coordSum += 100 * yi + xi
            }
        })
    })

    return coordSum;
}


/// part 2

resizeMap = inpMap => {
    return inpMap.map(row => {
        newRow = row.map(cell => {
            switch (cell) {
                case '.':
                    return ['.', '.']
                case 'O':
                    return ['[', ']']
                case '#':
                    return ['#', '#']
                case '@':
                    return ['@', '.']
            }
        })

        return newRow.flat();
    });
}

console.log(unparse(resizeMap(parseRows(mediumInputMap))))


step2 = (marp, dir, curX, curY) => {

    let updated = JSON.parse(JSON.stringify(marp));

    const n = updated[curY - 1][curX];
    const s = updated[curY + 1][curX];
    const e = updated[curY][curX + 1];
    const w = updated[curY][curX - 1];

    switch (dir) {
        case '^':
            switch (n) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY - 1][curX] = '@';
                    return [updated, curX, curY - 1]
                case '#':
                    return [updated, curX, curY]
                case '[':
                case ']':
                    return pushO2(updated, dir, curX, curY);
                default:
                    console.log('^ bad cell???', curX, curY, dir, n);
                    throw Error('bad cell')
                    break;
            }
            break;
        case 'v':
            switch (s) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY + 1][curX] = '@';
                    return [updated, curX, curY + 1]
                case '#':
                    return [updated, curX, curY]
                case '[':
                case ']':
                    return pushO2(updated, dir, curX, curY);
                default:
                    console.log('v bad cell???', curX, curY, dir, s);
                    throw Error('bad cell')
                    break;
            }
            break;
        case '<':
            switch (w) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY][curX - 1] = '@';
                    return [updated, curX - 1, curY]
                case '#':
                    return [updated, curX, curY]
                case '[':
                case ']':
                    return pushO2(updated, dir, curX, curY);
                default:
                    console.log('< bad cell???', curX, curY, dir, w);
                    throw Error('bad cell')
                    break;

            }
            break;
        case '>':
            switch (e) {
                case '.':
                    updated[curY][curX] = '.';
                    updated[curY][curX + 1] = '@';
                    return [updated, curX + 1, curY]
                case '#':
                    return [updated, curX, curY]
                case '[':
                case ']':
                    return pushO2(updated, dir, curX, curY);
                default:
                    console.log('> bad cell???', curX, curY, dir, e);
                    throw Error('bad cell')
                    break;
            }
            break;
        default:
            console.log('bad dir???', dir);
            break;
    }

    console.log("=========================")
    console.log('how did i get here?')
    console.log(unparse(marp), dir, curX, curY, n, s, e, w)
    console.log("=========================")
    throw Error('bad dir')
    return [updated, curX, curY]
}

pushO2 = (marp, dir, curX, curY) => {
    let updated = JSON.parse(JSON.stringify(marp));


    let newX = curX;
    let newY = curY;
    switch (dir) {
        case '^':

            updated = simplifyVert(marp.toReversed()).toReversed();

            updated.forEach((row, yi) => {
                row.forEach((cell, xi) => {
                    if (cell === '@') {
                        newX = xi;
                        newY = yi;
                    }
                })
            })

            return [updated, newX, newY]

        case 'v':

            updated = simplifyVert(marp);

            updated.forEach((row, yi) => {
                row.forEach((cell, xi) => {
                    if (cell === '@') {
                        newX = xi;
                        newY = yi;
                    }
                })
            })

            return [updated, newX, newY]


        case '<':
            const columnLeft = [];
            for (let xi = curX; xi >= 0; xi--) {
                columnLeft.push(updated[curY][xi])
            }
            const pushedLeft = simplifyHoriz(columnLeft);
            console.log('lll', columnLeft);
            console.log('lll', pushedLeft);


            for (let xi = curX; xi >= 0; xi--) {
                const upd = pushedLeft.shift();
                if (upd === '@') {
                    newX = xi;
                }
                updated[curY][xi] = upd;
            }

            return [updated, newX, newY]
        case '>':
            const columnRight = [];
            for (let xi = curX; xi < marp[0].length; xi++) {
                columnRight.push(updated[curY][xi])
            }
            const pushedRight = simplifyHoriz(columnRight);
            console.log('rrr', columnRight);
            console.log('rrr', pushedRight);

            for (let xi = curX; xi < marp[0].length; xi++) {
                const upd = pushedRight.shift();
                if (upd === '@') {
                    newX = xi;
                }
                updated[curY][xi] = upd;
            }
            return [updated, newX, newY]
    }
}


vertTestMap =
    `##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.....@....##
##############`;

vertTestMap2 =
    `##############
##......##..##
##....[]....##
##.....[]...##
##....[]....##
##.....@....##
##############`;

vertTestDir = `^`;

simplifyVert = rows => {
    const statusRows = rows.map(row => row.map(x => {
        return {
            val: x,
            pushing: null,
            pushable: null,
        }
    }));

    statusRows.forEach((row, yi) => {
        row.forEach((x, xi) => {
            switch (x.val) {
                case '@':
                    x.pushing = true;
                    break;
                case '#':
                    x.pushing = false;
                    break;
                case '.':
                    x.pushing = statusRows[yi - 1][xi].pushing === true ? 'E' : false;
                    break;
                case '[':
                    x.pushing = x.pushing
                        || statusRows[yi - 1][xi].pushing === true
                        || statusRows[yi - 1][xi + 1].pushing === true;

                    statusRows[yi][xi + 1].pushing = x.pushing;
                    break;
                case ']':
                    x.pushing = x.pushing ||
                        statusRows[yi - 1][xi].pushing === true
                        || statusRows[yi - 1][xi - 1].pushing === true
                        || statusRows[yi][xi + 1].pushing === true;

                    statusRows[yi][xi - 1].pushing = x.pushing;

                    break;
            }
        })
    })

    statusRows.reverse();

    try {
        statusRows.forEach((row, yi) => {

            row.forEach((x, xi) => {
                switch (x.val) {
                    case '@':
                        x.pushable = !!statusRows[yi - 1][xi].pushable;

                        //shortcircuit if not pushable;
                        if (!x.pushable) {
                            throw Error('shortcircuit')
                        }

                        break;
                    case '[':
                        x.pushable = !!statusRows[yi - 1][xi].pushable
                            && !!statusRows[yi - 1][xi + 1].pushable;

                        break;
                    case ']':
                        x.pushable =
                            !!statusRows[yi][xi - 1].pushable
                            && !!statusRows[yi - 1][xi].pushable
                            && !!statusRows[yi - 1][xi - 1].pushable;

                        statusRows[yi][xi - 1].pushable = x.pushable;

                        break;
                    case '#':
                        x.pushable = false;
                        break;
                    case '.':
                        x.pushable = 'E';
                        break;
                }
            });
        })
    } catch (err) {
        if (err.message = 'shortcircuit') {
            return rows
        } else {
            throw err
        }
    }

    statusRows.reverse();

    console.log('statuses', statusRows);


    const newRows = JSON.parse(JSON.stringify(rows));

    statusRows.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell.pushing && cell.pushable === true) {
                newRows[yi + 1][xi] = cell.val;

                const behindCell = statusRows[yi - 1][xi];
                if (!behindCell.pushing || behindCell.val === '.') {
                    newRows[yi][xi] = '.'
                }
            } else if (cell.pushing === 'E' && cell.pushable === 'E') {
                // do nothing;
            } else {
                newRows[yi][xi] = cell.val
            }
        })
    });

    return newRows

}

simplifyHoriz = row => {
    const statuses = row.map(x => {
        return {
            val: x,
            pushing: null,
            pushable: null,
        }
    });

    statuses.forEach((x, i) => {
        switch (x.val) {
            case '@':
                x.pushing = true;
                break;
            case '#':
                x.pushing = false;
                break;
            case '.':
                x.pushing = statuses[i - 1].pushing === true ? 'E' : false;
                break;
            case '[':
            case ']':
                x.pushing = statuses[i - 1].pushing === true;
                break;
        }
    })

    statuses.reverse();
    statuses.forEach((x, i) => {
        switch (x.val) {
            case '@':
            case '[':
            case ']':
                x.pushable = !!statuses[i - 1].pushable;
                break;
            case '#':
                x.pushable = false;
                break;
            case '.':
                x.pushable = 'E';
                break;
        }
    });

    statuses.reverse();

    // console.log('statuses', statuses);

    if (!statuses[0].pushable) {
        return row;
    } else {
        const newRow = ['.'];
        statuses.forEach((s, si) => {
            if (s.pushing && s.pushable === true) {
                newRow.push(s.val);
            } else if (s.pushing === 'E' && s.pushable === 'E') {
                // do nothing;
            } else {
                newRow.push(s.val);
            }
        })

        return newRow;
    }

}


final2 = (inpMap, inpDir) => {
    const parsedMap = resizeMap(parseRows(inpMap));
    // const parsedMap = parseRows(inpMap);
    const parsedDir = parseDir(inpDir);

    let curX;
    let curY;
    parsedMap.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell === '@') {
                curX = xi;
                curY = yi;
            }
        })
    })

    let current = parsedMap;
    parsedDir.forEach(d => {
        console.log('----------------------');
        console.log(d);
        [current, curX, curY] = step2(current, d, curX, curY);
        console.log(unparse(current))
    })


    let coordSum = 0;
    current.forEach((row, yi) => {
        row.forEach((cell, xi) => {
            if (cell === '[') {
                coordSum += 100 * yi + xi
            }
        })
    })

    return coordSum;
}


smallInputMap2 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######`;

smallInputDir2 = `<vv<<^^<<^^`


final2(mediumInputMap, mediumInputDir)