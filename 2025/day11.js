smallInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

smallInput2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    const row = inp.split(`: `);
    const key = row[0];
    const vals = row[1].split(' ');
    return [key, vals]
};
unparse = inp => inp.map(x => x.join(``)).join(`\n`);
sum = inp => inp.reduce((a, c) => a + c);
mul = inp => inp.reduce((a, c) => a * c);

pathsToOut = (start, marp) => {
    const children = marp.get(start);

    if (start === 'out') {
        return 1;
    }

    return sum(children.map(child => pathsToOut(child, marp)));
}

final = inp => {
    const parsed = parseRows(inp);
    const marp = new Map();
    parsed.forEach(row => {
        marp.set(row[0], row[1]);
    });

    return pathsToOut('you', marp)


}

// final(smallInput);


//part 2

memoizePathsToOut2 = fn => {
    memo = new Map();

    return function (start, marp, d, hitFFT, hitDAC) {

        if (memo.has(JSON.stringify([start, d, hitFFT, hitDAC]))) {
            return memo.get(JSON.stringify([start, d, hitFFT, hitDAC]));
        }
        result = fn(start, marp, d, hitFFT, hitDAC);
        memo.set(JSON.stringify([start, d, hitFFT, hitDAC]), result);
        return result;
    }
};

pathsToOut2 = (start, marp, d, hitFFT, hitDAC) => {
    if (start === 'out' && hitFFT && hitDAC) {
        return 1;
    } else if (start === 'out') {
        return 0
    } else {
        
        let newHitFFT = hitFFT;
        let newHitDAC = hitDAC;
        if (start === 'fft') {
            newHitFFT = true;;
        }
        if (start === 'dac') {
            newHitDAC = true;
        }
        const children = marp.get(start);
        return sum(children.map(child => pathsToOut2(child, marp, d + 1, newHitFFT, newHitDAC)));
    }

}

pathsToOut2 = memoizePathsToOut2(pathsToOut2);

final2 = inp => {
    const parsed = parseRows(inp);
    const marp = new Map();
    parsed.forEach(row => {
        marp.set(row[0], row[1]);
    });

    return pathsToOut2('svr', marp, 0, false, false)


}

// final2(smallInput2);
