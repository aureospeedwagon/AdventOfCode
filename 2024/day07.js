smallInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

memoize = fn => {
    memo = new Map();

    return function (n) {

        if (memo.has(n)) {
            return memo.get(n);
        }
        result = fn(n);
        memo.set(n, result);
        return result;
    }
}

parseToArrays = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    colonSplit = inp.split(':')
    sum = Number(colonSplit[0]);
    factors = colonSplit[1].split(' ').filter(x => !!x).map(x => Number(x));
    return [sum, factors];
}

parseToArrays(smallInput)

solveRow = row => {
    sum = row[0];
    factors = row[1];
    return works(sum, factors)

}

works = (sum, factors, m = 'i', d = 0) => {
    // console.log('start', sum, factors, m, d)
    if (factors.length === 1) {
        // console.log('end', sum, factors[0], m, d)
        return sum === factors[0];
    }

    let endex = factors.length - 1;
    let sumPath = sum - factors[endex];
    let mulPath = sum / factors[endex];

    // console.log(sumPath, '|' , mulPath, [...factors].slice(0, endex));
    return works(mulPath, [...factors].slice(0, endex), 'm', d + 1) || works(sumPath, [...factors].slice(0, endex), 's', d + 1);
}


final = inp => {
    let parsed = parseToArrays(inp);
    return parsed.filter(x => solveRow(x))
        .map(x => x[0])
        .reduce((a, c) => a + c)
}

final(smallInput);


solveRow2 = row => {
    sum = row[0];
    factors = row[1];
    return works2(sum, factors)

}

works2 = (sum, factors, m = 'i', d = 0) => {
    // console.log('start', sum, factors, m, d)
    if (factors.length === 1) {
        // console.log('end', sum, factors[0], m, d)
        return sum === factors[0];
    }

    let endex = factors.length - 1;
    
    // concat logic
    let deconcat = String(factors[endex]);
    let stringSum = String(sum);
    let stringSumEnd = stringSum.slice(stringSum.length - deconcat.length);
    let catPath = Number(stringSum.slice(0, stringSum.length - deconcat.length));
    let catPathValid = deconcat === stringSumEnd;
    
    // original logic
    let sumPath = sum - factors[endex];
    let mulPath = sum / factors[endex];
    // console.log(sumPath, '|' , mulPath, '|', catPath, [...factors].slice(0, endex));
    return works2(mulPath, [...factors].slice(0, endex), 'm', d + 1)
        || works2(sumPath, [...factors].slice(0, endex), 's', d + 1)
        || (catPathValid && works2(catPath, [...factors].slice(0, endex), 'c', d + 1));
}


final2 = inp => {
    let parsed = parseToArrays(inp);
    // return parsed.map(x => `${x[0]}, ${solveRow2(x)}`)
    return parsed.filter(x => solveRow2(x))
        .map(x => x[0])
        .reduce((a, c) => a + c)
}

final2(smallInput);

// solveRow2([161011, [16,10,13]])