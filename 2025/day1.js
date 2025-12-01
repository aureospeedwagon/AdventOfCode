smallInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    const dir = inp[0] === 'L' ? -1 : 1;
    const val = Number(inp.slice(1));
    return dir * val;
};


final=inp=> {
    const parsed = parseRows(inp);

    let zeros = 0;
    let pointing = 50;
    parsed.forEach(inp => {
        pointing += inp;
        pointing = pointing % 100;
        // console.log(pointing);
        if (pointing === 0 ) {
            zeros++;
        }
    });

    return zeros;
}

final(smallInput);


reparseRows=rows=>{
    return rows.map(row=>reparseRow(row)).flat();
}

reparseRow=row=>{
    const count = Math.abs(row);
    const dir = row > 0 ? 1 : -1;

    reparsed = new Array(count);
    reparsed.fill(dir);
    return reparsed;
}

final2=inp=> {
    const parsed = parseRows(inp);
    const reparsed = reparseRows(parsed);

    let zeros = 0;
    let pointing = 50;
    reparsed.forEach(inp => {
        pointing += inp;
        pointing = pointing % 100;
        // console.log(pointing);
        if (pointing === 0 ) {
            zeros++;
        }
    });

    return zeros;
}

final2(smallInput);