smallA = 729;
smallB = 0;
smallC = 0;
smallInputProgram = `0,1,5,4,3,0`;


bigA = 30886132;
bigB = 0;
bigC = 0;
bigInputProgram = `2,4,1,1,7,5,0,3,1,4,4,4,5,5,3,0`;


parseInput = inp => inp.split(`,`).map(x => Number(x));

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


getComboOperand = (operand, A, B, C, pointer) => {
    switch (operand) {
        case 0:
        case 1:
        case 2:
        case 3:
            return operand
        case 4:
            return A;
        case 5:
            return B;
        case 6:
            return C;
        case 7:
        default:
        //throw Error(`Huh? Bad Combo Operand "${operand}", Pointer: ${pointer}`)
    }

}

mod = (x, mod) => {
    return (x % mod + mod) % mod;
}


final = ([inp, A, B, C]) => {
    let registerA = A;
    let registerB = B;
    let registerC = C;
    const programCode = parseInput(inp);

    logging = false;

    logging ? console.log('programCode', programCode) : 0;



    outputQueue = [];
    for (let pointer = 0; pointer < programCode.length; pointer) {
        const opcode = programCode[pointer];
        const operand = programCode[pointer + 1];
        const comboOperand = getComboOperand(operand, registerA, registerB, registerC, pointer);
        logging ? console.log('Pointer', pointer, '--------------------------') : 0;
        switch (opcode) {
            case 0: // ADV - Divide A by combo operand, stores in A
                logging ? console.log('ADV', registerA, comboOperand) : 0;
                const numerator_ADV = registerA;
                const denominator_ADV = Math.pow(2, comboOperand);
                const divided_ADV = Math.floor(numerator_ADV / denominator_ADV);
                registerA = divided_ADV;
                logging ? console.log(registerA) : 0;
                pointer += 2
                break;
            case 1: // BXL - bitwise XOR of B and literal operand, stores in B
                logging ? console.log('BXL', registerB, operand) : 0;
                registerB = registerB ^ operand;
                logging ? console.log(registerB) : 0;
                pointer += 2
                break;
            case 2: // BST - combo operand modulo 8, store in B
                logging ? console.log('BST', registerB, comboOperand) : 0;
                registerB = mod(comboOperand, 8);
                logging ? console.log(registerB) : 0;
                pointer += 2
                break;
            case 3: // JNZ - if A not 0, set pointer to literal operand
                logging ? console.log('JNZ', registerA, operand) : 0;
                if (registerA !== 0) {
                    pointer = operand;
                } else {
                    pointer += 2
                }
                break;
            case 4: // BXC - bitwise XOR of B and C, store in B (operand not used)
                logging ? console.log('BXC', registerB, registerC) : 0;
                registerB = registerB ^ registerC;
                logging ? console.log(registerB) : 0;
                pointer += 2;
                break;
            case 5: // OUT - output combo operand modulo 8
                logging ? console.log('OUT', comboOperand) : 0;
                logging ? console.log('OUT', comboOperand) : 0;
                const output = mod(comboOperand, 8);
                logging ? console.log(output) : 0;
                outputQueue.push(output);
                pointer += 2
                break;
            case 6: // BDV - Divide A by combo operand, stores in B
                logging ? console.log('BDV', registerA, comboOperand) : 0;
                const numerator_BDV = registerA;
                const denominator_BDV = Math.pow(2, comboOperand);
                const divided_BDV = Math.floor(numerator_BDV / denominator_BDV);
                registerB = divided_BDV;
                logging ? console.log(registerB) : 0;
                pointer += 2
                break;
            case 7:// CDV - Divide A by combo operand, stores in C
                logging ? console.log('CDV', registerA, comboOperand) : 0;
                const numerator_CDV = registerA;
                const denominator_CDV = Math.pow(2, comboOperand);
                const divided_CDV = Math.floor(numerator_CDV / denominator_CDV);
                registerC = divided_CDV;
                logging ? console.log(registerA) : 0;
                pointer += 2
                break;
            default:
                throw Error(`Huh? Bad Opcode "${opcode}", Pointer: ${pointer}`)
        }



    }

    logging ? console.log(`============`) : 0;
    logging ? console.log('registerA', registerA) : 0;
    logging ? console.log('registerB', registerB) : 0;
    logging ? console.log('registerC', registerC) : 0;
    logging ? console.log('outputQueue', outputQueue) : 0;

    return outputQueue.join();
}

const tests = () => {
    return [
        //0
        final([smallInputProgram, smallA, smallB, smallC]).outputQueue.join() === `4,6,3,5,6,3,5,2,1,0`,
        //1
        final(['2,6', 0, 0, 9]).registerB === 1,
        //2
        final(['5,0,5,1,5,4', 10, 0, 0]).outputQueue.join() === `0,1,2`,
        // 3 4
        final(['0,1,5,4,3,0', 2024, 0, 9]).outputQueue.join() === `4,2,5,6,7,7,7,7,3,1,0`,
        final(['0,1,5,4,3,0', 2024, 0, 9]).registerA === 0,
        //5
        final(['1,7', 0, 29, 0]).registerB === 26,
        //6
        final(['4,4', 0, 2024, 43690]).registerB === 44354,


        // for legacy testing purposes
        final([bigInputProgram, bigA, bigB, bigC]) === '6,1,6,4,2,4,7,3,5'
    ]

}


// followed the logic of the program

// A gets divided by 8 and floored, 
// Registers B and C have some math done to them, 
// and then it jumps back to the start, where B and C get reset
// so their final value at the end of the loop is irrelevant to next loop.
// A is divided and floored in each loop, so in the final loop,
// A has to be less than 7 to get floored to zero;
// Check to see which values of A can produce the ending of the input
// Since A gets divided and floored, previous loop's A must be between A*8 and (A*8 + 8)
// could be multiple valid values, so check minimum-minumum to maximum-maximum
// loop until find value for A to output input.

// ALSO the % operator in javascript is dumb and i hate it because it's not actually modulo, it's remainder
// which means that if X is negative X%n will be negative
// -5 mod 3 => 1, but  -5 % 3 ==> -2;

final2 = (inp) => {

    const programCode = parseInput(inp)
    console.log(programCode);

    let currentMin = 1;
    let currentMax = 7;
    let mins = {};
    for (let depth = 0; depth < programCode.length; depth++) {

        mins[depth] = [];
        // console.log('depth', depth, 'minmax', currentMin, currentMax)

        for (let A = currentMin; A < currentMax; A++) {

            const f = final([inp, A, 0, 0])


            if (inp.endsWith(f)) {
                mins[depth].push(A)
            }
        }

        // console.log('mins', mins[depth]);
        currentMin = Math.max(Math.min(...(mins[depth])) * 8, 1, currentMax);
        currentMax = Math.max(...(mins[depth])) * 8 + 8;

        // console.log('==========')
    }

    return Math.min(...mins[programCode.length - 1])

}

final2(bigInputProgram)