smallInput = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(`-`);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


final = inp => {
    const parsed = parseRows(inp);
    // console.log('parsed', parsed);
    const linkMap = new Map();

    parsed.forEach(([p0, p1]) => {

        if (linkMap.has(p0)) {
            linkMap.get(p0).add(p1);
        } else {
            linkMap.set(p0, new Set([p1]))
        }

        if (linkMap.has(p1)) {
            linkMap.get(p1).add(p0);
        } else {
            linkMap.set(p1, new Set([p0]))
        }
    })

    console.log('linkmap', linkMap)

    const parties = [];

    parsed.forEach(([p0, p1]) => {
        // console.log(p0, p1)
        let m0 = linkMap.get(p0);
        let m1 = linkMap.get(p1);
        // console.log(m0, m1)
        let inter = m0.intersection(m1);

        [...inter].forEach(p2 => {
            party = [p0, p1, p2].toSorted().join();
            parties.push(party);
        })

    })

    console.log('parties', parties, [...new Set(parties.toSorted())])

    return [...new Set(parties.toSorted())]
        .filter(x => x.indexOf('t') === 0 || x.indexOf(',t') > -1)
        .length
    // .map(x => x.split(','));

}


// Part 2

final2 = inp => {
    const parsed = parseRows(inp);
    // console.log('parsed', parsed);
    const linkMap = new Map();

    parsed.forEach(([p0, p1]) => {

        if (linkMap.has(p0)) {
            linkMap.get(p0).add(p1);
        } else {
            linkMap.set(p0, new Set([p1]))
        }

        if (linkMap.has(p1)) {
            linkMap.get(p1).add(p0);
        } else {
            linkMap.set(p1, new Set([p0]))
        }
    })

    console.log('linkmap', linkMap)

    const parties = [];

    parsed.forEach(([p0, p1]) => {
        // console.log(p0, p1)
        let m0 = linkMap.get(p0);
        let m1 = linkMap.get(p1);
        // console.log(m0, m1)
        let inter = m0.intersection(m1);

        [...inter].forEach(p2 => {
            party = [p0, p1, p2].toSorted().join();
            parties.push(party);
        })

    })

    console.log('parties', parties, [...new Set(parties.toSorted())])

    return [...new Set(parties.toSorted())]
        .filter(x => x.indexOf('t') === 0 || x.indexOf(',t') > -1)
        .length
    // .map(x => x.split(','));

}

final2(smallInput);