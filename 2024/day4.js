smallInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

reg1 = /XMAS/g
reg2 = /SAMX/g

test = `abc
def
ghi`

parseToArrays = inp => inp.split(`\n`).map(x => x.split(``));
unparse = inp => inp.map(x => x.join(``)).join(`\n`);

// padArray=inp=>{
//     parsed = parseToArrays(inp)
//     padded = parsed.map(x=>[0,...x,0])
//     zerorow = Array(parsed[0].length + 2)
//     zerorow.fill(0);
//     return [zerorow, ...padded, zerorow];
// }

// padArray(smallInput)


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


rotate45 = inp => {
    updated = new Array(inp.length * 2);
    updated.fill([])
    updated = updated.map(x => new Array())

    inp.forEach((x, xi) => {
        x.forEach((y, yi) => {
            updated[xi + yi].push(inp[xi][yi])
        })
    })

    return updated

}


rotate135 = inp => {
    return rotate45(rotate90(inp));
}



// console.log(unparse(parseToArrays(test)));
// console.log(unparse(rotate45(parseToArrays(test))));
// console.log(unparse(rotate90(parseToArrays(test))));
// console.log(unparse(rotate135(parseToArrays(test))));

final = inp => {
    // console.log(inp);
    // console.log(unparse(rotate90(parseToArrays(inp))));
    // console.log(unparse(rotate45(parseToArrays(inp))));
    // console.log(unparse(rotate135(parseToArrays(inp))));
    return [
        [...inp.matchAll(reg1)].length,
        [...unparse(rotate90(parseToArrays(inp))).matchAll(reg1)].length,
        [...unparse(rotate45(parseToArrays(inp))).matchAll(reg1)].length,
        [...unparse(rotate135(parseToArrays(inp))).matchAll(reg1)].length,
        [...inp.matchAll(reg2)].length,
        [...unparse(rotate90(parseToArrays(inp))).matchAll(reg2)].length,
        [...unparse(rotate45(parseToArrays(inp))).matchAll(reg2)].length,
        [...unparse(rotate135(parseToArrays(inp))).matchAll(reg2)].length,
    ].reduce((a,c)=>a+c)
}

final(smallInput)


padArray=inp=>{
    parsed = parseToArrays(inp)
    padded = parsed.map(x=>[0,...x,0])
    zerorow = Array(parsed[0].length + 2)
    zerorow.fill(0);
    return [zerorow, ...padded, zerorow];
}

// padArray(smallInput)

final2=inp=>{
    parsed = padArray(inp);

    count = 0

    parsed.forEach((x,xi) => {
        x.forEach((y,yi)=>{
            if (y === 'A') {
                nw = parsed[xi-1][yi-1];
                ne = parsed[xi+1][yi-1];
                sw = parsed[xi-1][yi+1];
                se = parsed[xi+1][yi+1];

                corners = [nw,ne,sw,se];

                if (corners.every(c=> c==='M' || c==='S')) {
                    if (nw !== se && ne !== sw) {
                        count+=1
                    }
                }
            }
        })
    })

    return count
}

final2(smallInput)