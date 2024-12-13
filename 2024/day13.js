smallInput = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;


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

parseInput = inp => {
    return inp.split(`\n\n`)
        .map(machine => {
            const [a, b, p] = machine.split(`\n`).map(row => row.split(':')[1]);

            xregx = /X(\+|\=)\d+,/
            yregx = /Y(\+|\=)\d+/

            let ax = [...a.match(xregx)[0].slice(2)];
            ax.pop();
            ax = ax.join(``);

            const ay = a.match(yregx)[0].slice(2);

            let bx = [...b.match(xregx)[0].slice(2)];
            bx.pop();
            bx = bx.join(``);

            const by = b.match(yregx)[0].slice(2);

            let px = [...p.match(xregx)[0].slice(2)];
            px.pop();
            px = px.join(``);

            const py = p.match(yregx)[0].slice(2);

            return [
                [Number(ax), Number(ay)],
                [Number(bx), Number(by)],
                [Number(px), Number(py)]]

        });



}



solveMachine = (machine) => {
    const [[ax, ay], [bx, by], [px, py]] = machine;
    const maxA = Math.min(Math.floor(px / ax), Math.floor(py / ay), 100);
    const maxB = Math.min(Math.floor(px / bx), Math.floor(py / by), 100);

    const solutions = [];

    for (let a = 0; a <= maxA; a++) {
        for (let b = 0; b <= maxB; b++) {

            if ((a * ax + b * bx === px)
                && (a * ay + b * by === py)
            ) {
                return [a, b, a * 3 + b];
            }
        }

    }

    return [0, 0, 0];

}

checkTokens = (tokens, machine) => {
    const [[ax, ay], [bx, by], [px, py]] = machine;
    const [a, b, t] = tokens;

    // console.log("-----");
    // console.log(a, b);
    // console.log(ax * a + bx * b, px)
    // console.log(ay * a + by * b, py)

    return (ax * a + bx * b === px) && (ay * a + by * b === py)
}


final = inp => {
    const machines = parseInput(inp);
    console.log('machines', machines);
    const tokens = machines.map(m => solveMachine(m));

    for (let i = 0; i < machines.length; i++) {
        const m = machines[i];
        const t = tokens[i];
        if (t[2] && !checkTokens(t, m)) {
            console.log('bad', i);
        }

    }


    console.log('tokens', tokens);
    return sum(tokens.map(x => x[2]))
}



// Part 2


parseInput2 = inp => {
    return inp.split(`\n\n`)
        .map(machine => {
            const [a, b, p] = machine.split(`\n`).map(row => row.split(':')[1]);

            xregx = /X(\+|\=)\d+,/
            yregx = /Y(\+|\=)\d+/

            let ax = [...a.match(xregx)[0].slice(2)];
            ax.pop();
            ax = ax.join(``);

            const ay = a.match(yregx)[0].slice(2);

            let bx = [...b.match(xregx)[0].slice(2)];
            bx.pop();
            bx = bx.join(``);

            const by = b.match(yregx)[0].slice(2);

            let px = [...p.match(xregx)[0].slice(2)];
            px.pop();
            px = px.join(``);

            const py = p.match(yregx)[0].slice(2);

            return [
                [Number(ax), Number(ay)],
                [Number(bx), Number(by)],
                [Number(px) + 10000000000000, Number(py) + 10000000000000]]

        });

}

// still too slow
// solveMachine2 = (machine) => {
//     const [[ax, ay], [bx, by], [px, py]] = machine;

//     const A = ax + ay;
//     const B = bx + by;
//     const P = px + py
//     const maxA = Math.floor(P / A);
//     console.log('---')
//     for (let a = 0; a <= maxA; a++) {

//         const b = (P - (a * A)) / B;
//         const modb = b % 1;

//         if (modb === 0) {
//             console.log(a, b);
//             const potentialTokens = [a, b, a * 3 + b]
//             if (checkTokens(potentialTokens, machine)) {
//                 return potentialTokens;
//             }
//         }

//     }


//     return [0, 0, 0];

// }


// recurse? No, stack overflow
// solveMachine3 = (machine) => {
//     const [[ax, ay], [bx, by], [px, py]] = machine;


//     if (bx === px && by === py) {
//         return 1;
//     }
//     if (ax === px && ay === py) {
//         return 3;
//     }


//     let aSolution;
//     if (ax < px && ay < py) {
//         const newMachineA = [[ax, ay], [bx, by], [px - ax, py - ay]];
//         aSolution = solveMachine3(newMachineA) + 3;
//     } else {
//         aSolution = Infinity;
//     }


//     let bSolution;
//     if (bx < px && by < py) {
//         const newMachineB = [[ax, ay], [bx, by], [px - bx, py - by]];
//         bSolution = solveMachine3(newMachineB) + 1;
//     } else {
//         bSolution = Infinity;
//     }

//     return Math.min(aSolution, bSolution);

// }

// solveMachine3 = memoize(solveMachine3);


// still very slow, like 10-15 minutes
solveMachine4 = (machine) => {
    const [[ax, ay], [bx, by], [px, py]] = machine;

    const A = ax + ay;
    const B = bx + by;
    const P = px + py
    const maxA = Math.min(Math.floor(px / ax), Math.floor(py / ay));
    const maxB = Math.min(Math.floor(px / bx), Math.floor(py / by));
    console.log('machine', machine.flat())

    let j = 1;
    let xjump = false;
    let yjump = false;
    let jump = false;


    const JUMP_AX = bx / gcd(ax, bx)
    const JUMP_AY = by / gcd(ay, by)
    const JUMP_A = B / gcd(A, B)
    console.log('jumpsA', JUMP_AX, JUMP_AY, JUMP_A, lcm(JUMP_AX, JUMP_AY), gcd(JUMP_AX, JUMP_AY))


    for (let a = 0; a <= maxA; a += j) {

        // console.log('aaa', a)
        const calcB1 = (px - (a * ax)) / bx;
        const modbx = calcB1 % 1;
        const calcB2 = (py - (a * ay)) / by;
        const modby = calcB2 % 1;
        const calcB = (P - (a * A)) / B;
        const modb = calcB % 1;



        // console.log('jump', a, modbx, modby, modb)
        if (modbx === 0 && !xjump) {
            console.log('jumpx', a);
            j = lcm(j, JUMP_AX)
            xjump = a;
        } else if (modby === 0 && !yjump) {
            console.log('jumpy', a);
            j = lcm(j, JUMP_AY)
            yjump = a;
        } else if (modb === 0 && !jump) {
            console.log('jumpz', a);
            j = lcm(j, JUMP_A)
            jump = a;
        }

        if ((a > Math.min(JUMP_AX, JUMP_AY)) && !(xjump || yjump || jump)) {
            console.log('jumpfail', a)
            return [0, 0, 0]
        }

        if (xjump && !(yjump || jump)) {
            if (a - xjump > JUMP_AY * JUMP_AX) {
                console.log('jumpfailx', a)
                return [0, 0, 0]
            }
        } else if (!(xjump || jump) && yjump) {
            if (a - yjump > JUMP_AY * JUMP_AX) {
                console.log('jumpfaily', a)
                return [0, 0, 0]
            }
        }

        if (modbx === 0
            && modby === 0
            && modb === 0
            && calcB1 === calcB2
            && calcB === calcB2
        ) {
            console.log('end', a, calcB);
            const potentialTokens = [a, calcB, a * 3 + calcB]
            if (checkTokens(potentialTokens, machine)) {
                return potentialTokens;
            }
        }

    }

    return [0, 0, 0];

}



final2 = inp => {
    // don't forget to change to parseInput2;
    const machines = parseInput2(inp);
    console.log('machines', machines);
    const tokens = machines.map((m, mi) => {
        console.log('---')
        console.log(mi)
        return solveMachine4(m)
    });

    console.log('tokens', tokens);
    return sum(tokens.map(x => x[2]).filter(x => x !== Infinity))
}

// actual good solution

solveMachineMathly = (machine) => {
    const [[a, c], [b, d], [m, n]] = machine;

    const x = ((b * n) - (d * m)) / ((b * c) - (a * d));
    const y = ((c * m) - (a * n)) / ((b * c) - (a * d));

    return [x, y, 3*x + y]
}

finalMathly = inp => {
    // don't forget to change to parseInput2;
    const machines = parseInput2(inp);
    console.log('machines', machines);
    const tokens = machines.map((m, mi) => {
        return solveMachineMathly(m)
    });

    console.log('tokens', tokens);
    return sum(tokens.filter(x => (x[0]%1 === 0 && x[1]%1 === 0 && x[2]%1 === 0)).map(x => x[2]))
}

finalMathly(smallInput)