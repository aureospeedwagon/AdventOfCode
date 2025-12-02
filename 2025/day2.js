smallInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

parseRows = inp => inp.split(`,`).map(x => parseRow(x));
parseRow = inp => {
    return inp.split(`-`).map(x => Number(x));
};

final = inp => {
    const parsed = parseRows(inp);

    let sumOfBadIds = 0;

    parsed.forEach(range => {
        const rangeStart = range[0];
        const rangeEnd = range[1];

        for (let index = rangeStart; index <= rangeEnd; index++) {
            const strIndex = String(index);
            const front = strIndex.slice(0, strIndex.length / 2);
            const end = strIndex.slice(strIndex.length / 2);

            if (front === end) {
                sumOfBadIds += index;
            }

        }
    })
    return sumOfBadIds;
}

final(smallInput);

// Part 2 -------------------------------------------


checkValid = index => {
    const strIndex = String(index);
    const strLength = strIndex.length;
    for (let i = 1; i < strLength; i++) {
        if (checkValidN(strIndex, i) !== '') {
            return false;
        }
    }
    return true;
}

checkValidN = (str, n) => {
    if (str.length <= n) {
        return str;
    }

    const start = str.slice(0,n);
    if (start === checkValidN(str.slice(n), n)) {
        return start;
    } else {
        return '';
    }

}

final2 = inp => {
    const parsed = parseRows(inp);

    let sumOfBadIds = 0;

    parsed.forEach(range => {
        const rangeStart = range[0];
        const rangeEnd = range[1];

        for (let index = rangeStart; index <= rangeEnd; index++) {
            if (!checkValid(index)) {
                sumOfBadIds += index;
            }
        }
    })
    return sumOfBadIds;
}

final2(smallInput);