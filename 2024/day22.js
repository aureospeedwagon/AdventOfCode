smallInput = `1
10
100
2024`;

parseRows = inp => inp.split(`\n`).map(x => parseRow(x));
parseRow = inp => {
    return Number(inp);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);

mod = (x, mod) => {
    return (x % mod + mod) % mod;
}

sum = inp => inp.reduce((a, c) => a + c);


calcNextSecret = n => {
    secret = n;
    const m64 = secret * 64;
    secret = prune(mix(secret, m64));
    const d32 = Math.floor(secret / 32);
    secret = prune(mix(secret, d32));
    const m2048 = secret * 2048;
    secret = prune(mix(secret, m2048));
    return secret;
}

mix = (m, n) => {
    return m ^ n;
}

prune = n => {
    return mod(n, 16777216)
}

calcNSecrets = (init, n) => {
    const secrets = [init];
    for (let i = 0; i < n; i++) {
        secrets.push(calcNextSecret(secrets.at(-1)))
    }
    return secrets;
}

final = inp => {
    const parsed = parseRows(inp);
    return sum(parsed.map(r => calcNSecrets(r, 2000)).map(r => r.at(-1)));
}

//part 2

smallInput2 = `1
2
3
2024`

getSequences = () => {
    const sequences = [];
    for (let w = -9; w <= 9; w++) {
        for (let x = -9; x <= 9; x++) {
            for (let y = -9; y <= 9; y++) {
                for (let z = -9; z <= 9; z++) {
                    sequences.push([w, x, y, z])
                }
            }
        }
    }
    return sequences;

}

mapSequences = (prices, changes) => {
    const sequencePriceMap = new Map();
    // console.log(changes);
    for (let i = 4; i < changes.length; i++) {
        const seq = changes.slice(i - 4, i);
        const price = prices[i];

        if (!sequencePriceMap.has(seq.join())) {
            sequencePriceMap.set(seq.join(), price);
        }

    }
    return sequencePriceMap;
}

solve2 = (prices, changes) => {
    const sequencePriceMaps = changes.map((c, ci) => {
        p = prices[ci];
        return mapSequences(p, c);
    });

    const sequences = getSequences();
    let price = 0;
    let winningSeq;

    console.log(sequences.length);
    sequences.forEach((seq, seqi) => {
        seqi % 100 ? 0 : console.log(seqi);

        let prices = sequencePriceMaps.map(m => m.get(seq.join()) ?? 0);
        // console.log(prices);
        let newPrice = sum(prices);
        if (newPrice > price) {
            price = newPrice;
            winningSeq = seq
        }
    })
    console.log(winningSeq);
    return price;
}




final2 = (inp, n) => {
    const parsed = parseRows(inp);
    const secrets = parsed.map(r => calcNSecrets(r, n))
    const prices = secrets.map(r => r.map(s => mod(s, 10)))
    const changes = prices.map(r => r.map((p, pi) => p - r[pi - 1]).slice(1));
    return solve2(prices, changes);
}

final2(smallInput2, 2000);