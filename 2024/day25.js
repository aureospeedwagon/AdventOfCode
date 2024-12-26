smallInput = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

separateInputs = inp => inp.split('\n\n');

parseKeysAndLocks = inp => inp.split(`\n`).map(x => parseRow(x));

parseRow = inp => {
    return inp.split(``);
};
const unparse = inp => inp.map(x => x.join(``)).join(`\n`);


getKeyAndLockCodes = keysAndLocks => {
    const locks = keysAndLocks.filter(x => x[0].join('') === "#####");
    const keys = keysAndLocks.filter(x => x.at(-1).join('') === "#####");
    // console.log('keys', keys)
    // console.log('locks', locks)

    keyCodes = keys.map(key => {
        keyCode = [0, 0, 0, 0, 0];
        key.forEach(keyRow => {
            keyRow.forEach((pin, pi) => {
                if (pin === '#') {
                    keyCode[pi] += 1;
                }
            });
        })
        return keyCode;
    })

    lockCodes = locks.map(key => {
        keyCode = [0, 0, 0, 0, 0];
        key.forEach(keyRow => {
            keyRow.forEach((pin, pi) => {
                if (pin === '#') {
                    keyCode[pi] += 1;
                }
            });
        })
        return keyCode;
    })

    // console.log('keys', keyCodes)
    // console.log('locks', lockCodes)
    return [keyCodes, lockCodes]
}

checkPair=(key, lock)=> {

    let good = true;

    for (let i = 0; i < 5; i++) {
        let keyValue = key[i];
        let lockValue = lock[i];
        if (keyValue + lockValue > 7) {
            good = false;
        }
        
    }

    return good;

}

final = inp => {
    const inpKeysAndLocks = separateInputs(inp);
    const keysAndLocks = inpKeysAndLocks.map(k => parseKeysAndLocks(k));
    const [keyCodes, lockCodes] = getKeyAndLockCodes(keysAndLocks);

    const pairs = [];
    keyCodes.forEach(key=> {
        lockCodes.forEach(lock=> {
            if (checkPair(key, lock)) {
                pairs.push([key,lock]);
            }
        });
    });

    return pairs.length;
}

final(smallInput);
