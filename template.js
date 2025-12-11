smallInput = ``;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};
unparse = inp => inp.map(x => x.join(``)).join(`\n`);
sum = inp => inp.reduce((a, c) => a + c);
mul = inp => inp.reduce((a, c) => a * c);

final=inp=> {
    const parsed = parseRows(inp);
    return parsed;
}

final(smallInput);
