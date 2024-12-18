smallInput = ``;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(``);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


final=inp=> {
    const parsed = parseRows(inp);
    return parsed;
}

final(smallInput);
