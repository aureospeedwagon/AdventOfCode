smallInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;


splitData = inp => inp.split('\n\n');

parseRanges = inp => inp.split(`\n`).map(x => parseRange(x));
parseRange = inp => {
    return inp.split(`-`).map(x => Number(x));
};

parseIngs = inp => inp.split(`\n`).map(x => Number(x));


final = inp => {
    [rangesInp, ingInp] = splitData(inp);

    const ranges = parseRanges(rangesInp);
    const ings = parseIngs(ingInp)

    // console.log('r', ranges)
    // console.log('i', ings)

    freshness = ings.map(ing => {
        fresh = false;
        ranges.forEach(range => {
            // console.log(ing, range);
            if (ing >= range[0] && ing <= range[1]) {
                fresh = true;
            }
        });
        return fresh;
    })

    // console.log('f', freshness)

    return freshness.filter(x => x).length;
}

// final(smallInput);


// part 2

mergeRanges = (ra, rb) => {

    const lower = ra[0] < rb[0] ? ra : rb;
    const higher = ra[0] > rb[0] ? ra : rb;

    const oldThing = [...lower, ...higher]
    const thing = oldThing.toSorted((a, b) => a - b);


    // console.log(oldThing)
    // console.log(thing)
    // console.log(oldThing.join() == thing.join());

    if (oldThing.join() == thing.join()) {
        console.log('-----');
        console.log('ot', oldThing)
        // console.log('t', thing)
        return [ra, rb];
    } else {
        return [[thing[0], thing[3]]]
    }

}

merge = ranges => {
    // console.log('-----');
    // console.log('rrr', ranges.join());
    if (ranges.length === 1) {
        return ranges;
    }
    const first = ranges.shift();
    let mergedSomewhere = false;
    const newRanges = ranges.map(range => {
        const mergedRange = mergeRanges(first, range);
        if (mergedRange.length === 1) {
            mergedSomewhere = true;
            return mergedRange[0];
        } else {
            return mergedRange[1];
        }
    });
    // console.log('nnn', newRanges.join());

    if (mergedSomewhere) {
        return merge(newRanges);
    }
    return [first, ...merge(newRanges)];
}

sum = inp => inp.reduce((a, c) => a + c);

// 334979377223434 is too low
// 339668510830765 is too high
// 339668510830757 is right



final2 = inp => {
    [rangesInp, ingInp] = splitData(inp);

    const ranges = parseRanges(rangesInp);
    const ends = ranges.map((range, id) => [{ val: range[0], end: 'lo', id }, { val: range[1], end: 'hi', id }])
        .flat()
        .toSorted((a, b) => {
            if (a.val !== b.val) {
                return a.val - b.val
            } else {
                if (a.end === b.end) {
                    return 0;
                } else {
                    if (a.end === 'lo') {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }
        });
    console.log('ends', ends);

    newRanges = [];
    activeIds = [];
    currentRange = []
    ends.forEach(e => {
        console.log(activeIds);
        if (e.end === 'lo' && activeIds.length === 0) {
            if (e.val === newRanges?.at(-1)?.[0]) {
                currentRange = newRanges.pop();
            } else {
                currentRange[0] = e.val;
            }
            activeIds.push(e.id);
            // console.log('bing', e.id, currentRange);
        } else if (e.end === 'lo') {
            activeIds.push(e.id);
        } else if (e.end === 'hi') {
            activeIds = activeIds.filter(x => x !== e.id);
            if (activeIds.length === 0) {
                currentRange[1] = e.val;
                newRanges.push(currentRange);
                console.log('bong', e.id, currentRange, currentRange[1] - currentRange[0] + 1);
                currentRange = [];
            }
        }
    })
    console.log(newRanges);

    console.log(newRanges.filter((x, i) => x[1] === newRanges?.[i + 1]?.[0]))

    return sum(newRanges.map(x => x[1] - x[0] + 1)); //+1 for inclusive range

}

final2(smallInput);

// 339668510830757 is right
