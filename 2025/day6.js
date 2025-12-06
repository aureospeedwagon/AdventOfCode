smallInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(` `).map(x => x.trim()).filter(x => x);
};

sum = inp => inp.reduce((a, c) => a + c);
mul = inp => inp.reduce((a, c) => a * c);


final = inp => {
    const parsed = parseRows(inp);
    const opRow = parsed.pop();

    let tot = 0;
    for (let i = 0; i < parsed[0].length; i++) {
        let vals = parsed.map(x => Number(x[i]));
        if (opRow[i] === '+') {
            tot += sum(vals);
        } else {
            tot += mul(vals);
        }
    }

    return tot;
}

// final(smallInput);

// part 2

parseRows2 = inp => inp.split(`\n`).map(x => parseRow2(x));
parseRow2 = inp => {
    return inp.split(``);
};

rotate90 = inp => {
    updated = new Array(inp[0].length);
    updated.fill([])
    updated = updated.map(x => new Array(inp.length))
    inp.forEach((x, xi) => {
        x.forEach((y, yi) => {
            updated[yi][xi] = inp[inp.length - 1 - xi][yi]

        })
    })

    return updated
}

unparse = inp => inp.map(x => x.join(``)).join(`\n`);
reparseRows = inp => inp.split(`\n`).map(x => x.trim()).join(`\n`);

parseRows3 = inp => inp.split(`\n\n`).map(x => parseRow3(x));
parseRow3 = inp => {
    return inp.split(`\n`).map(x => Number(x.trim())).filter(x => x);
};

final2 = inp => {
    const parsed = parseRows2(inp);
    const opRow = parsed.pop();


    const rotated = rotate90(parsed);
    const unparsed = unparse(rotated.map(x => x.toReversed()));
    const reparsed = reparseRows(unparsed);
    const parsed3 = parseRows3(reparsed);
    console.log('rrr', parsed3);

    const parsedOpRow = opRow.filter(x=> x.trim());
    console.log(parsedOpRow);

    let tot = 0;
    parsed3.forEach((vals, i) => {
        if (parsedOpRow[i] === '+') {
            tot += sum(vals);
        } else {
            tot += mul(vals);
        }
    })

    return tot;
}

final2(smallInput)