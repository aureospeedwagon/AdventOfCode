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


calcNextSecret=n=> {
    secret = n;
    const m64 = secret*64;
    secret = prune(mix(secret, m64));
    const d32 = Math.floor(secret/32);
    secret = prune(mix(secret, d32));
    const m2048 = secret*2048;
    secret = prune(mix(secret, m2048));
    return secret;
}

mix = (m,n) => {
    return m ^ n;
}

prune = n => {
    return mod(n, 16777216)
}

calcNSecrets=(init, n) => {
    const secrets = [init];
    for (let i = 0; i < n; i++) {
        secrets.push(calcNextSecret(secrets.at(-1)))
    }
    return secrets;
}

final=inp=> {
    const parsed = parseRows(inp);
    return sum(parsed.map(r=>calcNSecrets(r, 2000)).map(r=>r.at(-1)));
}

