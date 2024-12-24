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
    const wire =  inp.split(`:`);
    return {
        name: wire[0],
        value: Number(wire[1])
    }
};

parseGates = inp => inp.split(`\n`).map(x => parseGate(x));
parseGate = inp => {
    const gate = inp.split(` `);
    return {
        inputs: [gate[0], gate[2]],
        output: gate[4],
        operation: gate[1],
    }
};

const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


solveBinary=(inputWires, gates)=> {

    const outputWires = gates.map(g=>({name: g.output, value: null}));

    const allWires = [...inputWires, ...outputWires];

    const wireMap = new Map();
    allWires.forEach(w=> wireMap.set(w.name, w.value));

    let i = 0;
    while(wireMap.values().some(w=>w===null)) {
        console.log(i++);
        gates.forEach(gate => {
            const in0 = gate.inputs[0];
            const in1 = gate.inputs[1];
            const op = gate.operation;
            const out = gate.output;

            const v0 = wireMap.get(in0);
            const v1 = wireMap.get(in1);

            if (v0 !== null && v1 !== null) {
                switch(op) {
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

    const finalOutWires = allWires.map(x=>x.name).filter(x=>x.startsWith('z')).toSorted().toReversed();
    console.log(finalOutWires);

    const binaryOut = finalOutWires.map(x=>wireMap.get(x)).join('');
    return binaryOut;
}

final=(inp)=> {
    const [inpWires,inpGates] = parseInput(inp);
    const inputWires = parseWires(inpWires);
    const gates = parseGates(inpGates);
    const binaryOut = solveBinary(inputWires, gates);
    return Number(`0b${binaryOut}`);
}

final(smallInput);


