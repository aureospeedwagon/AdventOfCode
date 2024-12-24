smallInput = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;



parseInput = inp => inp.split(`\n\n`);

parseWires = inp => inp.split(`\n`).map(x => parseWire(x));
parseWire = inp => {
    const wire = inp.split(`:`);
    return {
        name: wire[0],
        value: Number(wire[1])
    }
};

parseGates = inp => inp.split(`\n`).map(x => parseGate(x));
parseGate = inp => {
    const gate = inp.split(` `);
    return {
        inputs: [gate[0], gate[2]].toSorted(),
        output: gate[4],
        operation: gate[1],
    }
};

const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


solveBinary = (inputWires, gates) => {

    const outputWires = gates.map(g => ({ name: g.output, value: null }));

    const allWires = [...inputWires, ...outputWires];

    const wireMap = new Map();
    allWires.forEach(w => wireMap.set(w.name, w.value));

    while (wireMap.values().some(w => w === null)) {
        gates.forEach(gate => {
            const in0 = gate.inputs[0];
            const in1 = gate.inputs[1];
            const op = gate.operation;
            const out = gate.output;

            const v0 = wireMap.get(in0);
            const v1 = wireMap.get(in1);

            if (v0 !== null && v1 !== null) {
                switch (op) {
                    case 'AND':
                        wireMap.set(out, v0 & v1)
                        break;
                    case 'OR':
                        wireMap.set(out, v0 | v1)
                        break;
                    case 'XOR':
                        wireMap.set(out, v0 ^ v1)
                        break;
                    default:
                        throw Error('huh?')
                }
            }

        })
    }

    const finalOutWires = allWires.map(x => x.name).filter(x => x.startsWith('z')).toSorted().toReversed();
    // console.log(finalOutWires);

    const binaryOut = finalOutWires.map(x => wireMap.get(x)).join('');
    return binaryOut;
}

final = (inp) => {
    const [inpWires, inpGates] = parseInput(inp);
    const inputWires = parseWires(inpWires);
    const gates = parseGates(inpGates);
    const binaryOut = solveBinary(inputWires, gates);
    return Number(`0b${binaryOut}`);
}

// final(smallInput);


// part 2

smallInput2 = `x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00`


findSwaps = (inpGates) => {

    // this is just a carry adder so rename gate outputs to something sensible and sort


    let ner = JSON.parse(JSON.stringify(inpGates)).split(`\n`).toSorted((a, b) => a.slice(-4) === b.slice(-4) ? 0 : (a.slice(-4) > b.slice(-4) ? 1 : -1)).join('\n');

    const andMatcher = /(x|y)\d\d AND (x|y)\d\d \-\> [a-z][a-z][a-z]/g
    const xorMatcher = /(x|y)\d\d XOR (x|y)\d\d \-\> [a-z][a-z][a-z]/g

    const initialAnds = inpGates.matchAll(andMatcher).map(x => ['A' + x[0].slice(1, 3), x[0].slice(-3)]);
    const initialXors = inpGates.matchAll(xorMatcher).map(x => ['R' + x[0].slice(1, 3), x[0].slice(-3)]);

    originalNameMap = new Map();

    [...initialAnds, ...initialXors].forEach(x => {
        originalNameMap.set(x[0], x[1]);
        ner = ner.replaceAll(x[1], x[0])
    })




    const XORzMatcher1 = /R\d\d XOR [a-z][a-z][a-z] \-\> z\d\d/g
    const XORzMatcher2 = /[a-z][a-z][a-z] XOR R\d\d \-\> z\d\d/g
    const carries1 = ner.matchAll(XORzMatcher1).map(x => ['C' + x[0].slice(1, 3), x[0].slice(8, 11)]);
    const carries2 = ner.matchAll(XORzMatcher2).map(x => ['C' + x[0].slice(9, 11), x[0].slice(0, 3)]);


    [...carries1, ...carries2].forEach(x => {
        originalNameMap.set(x[0], x[1]);
        ner = ner.replaceAll(x[1], x[0])
    })


    const cAndRMatcher1 = /(C|R)\d\d AND (C|R)\d\d \-\> [a-z][a-z][a-z]/g
    const crmatches = ner.matchAll(cAndRMatcher1).map(x => ['D' + x[0].slice(1, 3), x[0].slice(-3)]);


    [...crmatches].forEach(x => {
        originalNameMap.set(x[0], x[1]);
        ner = ner.replaceAll(x[1], x[0])
    })


    console.log(ner.split(`\n`).toSorted((a, b) => a.slice(4) === b.slice(4) ? 0 : (a.slice(4) > b.slice(4) ? 1 : -1)).join('\n'));

    // from here inspect gates manually for oddness where numbers don't line up.

}



final2 = (inp) => {
    const [inpWires, inpGates] = parseInput(inp);
    findSwaps(inpGates)

}

final2(bigInput);