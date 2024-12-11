smallInput1 = `0 1 10 99 999`;

smallInput2 = `125 17`;

bigInput = `2701 64945 0 9959979 93 781524 620 1`

parseRows = inp => inp.split(` `);


padArray = inp => {
    parsed = parseRows(inp)
    padded = parsed.map(x => ['.', ...x, '.'])
    padRow = Array(parsed[0].length + 2)
    padRow.fill('.');
    return [padRow, ...padded, padRow];
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);

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

sum = inp => inp.reduce((a, c) => a + c);

// Part 1
step = inp => {
    const output = [];
    inp.forEach(stone => {
        if (stone === '0') {
            output.push('1');
        } else if (stone.length % 2 === 0) {
            const first = String(Number(stone.slice(0, stone.length / 2)));
            const second = String(Number(stone.slice(stone.length / 2)));
            output.push(first);
            output.push(second);
        } else {
            const newStone = String((Number(stone) * 2024));
            output.push(newStone);
        }
    });
    return output;
}



final = (inp, n) => {
    const init = parseRows(inp);
    let current = init;
    for (let i = 0; i < n; i++) {
        current = step(current);
    }


    return current.length;
};




// Part 2, AKA "Do it again, but more efficient"
const chunkArray = (inp, size) => {
    const outputs = []
    for (let i = 0; i < inp.length / size; i++) {
        outputs.push(inp.slice(i * size, (i + 1) * size))
    }
    return outputs;
}

stepN = ([inp, n]) => {

    if (n === 0) {
        return inp.length;
    }

    const chunks = chunkArray(inp, 2);

    const children = chunks.map(chunk => {
        let nextInp = step(chunk);
        return stepN([nextInp, n-1]);
    });

    return sum(children);
}

stepN = memoize(stepN);


final2 = (inp, n) => {
    const init = parseRows(inp);
    return stepN([init, n]);
};