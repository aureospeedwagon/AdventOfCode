const smallInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

[towelInput, patternInput] = smallInput.split(`\n\n`);

const towels = towelInput.split(', ');
const patterns = patternInput.split(`\n`);

getTowels = inp => inp.split(`\n\n`)[0].split(`, `)
getPatterns = inp => inp.split(`\n\n`)[1].split(`\n`)


sum = inp => inp.reduce((a, c) => a + c);

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


check = ([towels, pattern]) => {

    if (pattern.length === 0) {
        return true;
    }

    const results = [];
    towels.forEach(t => {
        if (pattern.startsWith(t)) {
            let newPattern = pattern.slice(t.length);
            results.push(check([towels, newPattern]))
        } else { 
            results.push(false) 
        };
    })
    // console.log(results);
    return results.length && results.some(x=>x);
}

check = memoize(check)


final = inp => {
    const towels = getTowels(inp);
    const patterns = getPatterns(inp);
    console.log('towels', towels)
    console.log('patterns', patterns)
    return patterns.map(p => check([towels, p])).filter(p => !!p).length;
}


// Part 2

check2 = ([towels, pattern]) => {

    if (pattern.length === 0) {
        return 1;
    }

    const results = [];
    towels.forEach(t => {
        if (pattern.startsWith(t)) {
            let newPattern = pattern.slice(t.length);
            results.push(check2([towels, newPattern]))
        } else { 
            results.push(0) 
        };
    })
    // console.log(results);
    return sum(results);
}

check2 = memoize(check2)


final2 = inp => {
    const towels = getTowels(inp);
    const patterns = getPatterns(inp);
    console.log('towels', towels)
    console.log('patterns', patterns)
    return sum(patterns.map(p => check2([towels, p])));
}

final2(smallInput);
