smallInput = `2333133121414131402`;


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

sum = inp => inp.reduce((a, c) => a + c);



expandDiskMap = inp => {
    const inpArray = [...inp];
    let output = [];


    let id = 0;
    inpArray.forEach((v, i) => {
        if (i % 2) {
            output = output.concat(Array(Number(v)).fill('.'));
        } else {
            output = output.concat(Array(Number(v)).fill(id));
            id++
        }
    })
    return output
}



fillGaps = expandedMap => {

    const updatedMap = [...expandedMap];
    const idealLength = updatedMap.filter(x => x !== '.').length

    while (updatedMap.length > idealLength) {
        const finalValue = updatedMap.pop();
        if (finalValue !== '.') {
            const firstSpaceIndex = updatedMap.findIndex(x => x === '.');
            updatedMap[firstSpaceIndex] = finalValue;
        }

    }

    return updatedMap;

}

checkSum = inp => {
    return sum(inp.map((x, xi) => x !== '.' ? x * xi : 0));
}


final = inp => {
    const expanded = expandDiskMap(inp);
    const reordered = fillGaps(expanded);
    return checkSum(reordered)
}

// final(smallInput)


// saving in case part 2 doesn't like files to be split. I WAS RIGHT!!

expandDiskMap2 = inp => {
    const inpArray = [...inp];
    let outputFiles = [];
    let outputGaps = []


    let id = 0;
    inpArray.forEach((v, i) => {
        if (i % 2) {
            outputGaps.push(Array(Number(v)).fill('.'));
        } else {
            outputFiles.push(Array(Number(v)).fill(id));
            id++
        }
    })
    return [outputFiles, outputGaps]
}


fillGaps2 = (files, gaps) => {

    const filesBackward = [...files.map(f => [...f])].toReversed();
    const updatedGaps = [...gaps.map(f => [...f])];

    filesBackward.forEach((f, fi) => {
        const firstFitIndex = updatedGaps.findIndex(g => g.filter(s => s === '.').length >= f.length);
        if (firstFitIndex !== -1 //don't move if no space
            && firstFitIndex < (files.length - fi) //don't let it move farther down the list 
        ) {

            const firstFit = updatedGaps[firstFitIndex];
            const firstFitFirstEmptyIndex = firstFit.findIndex(i => i == '.');
            const firstFitStart = firstFit.slice(0, firstFitFirstEmptyIndex);
            const firstFitEnd = firstFit.slice(firstFitFirstEmptyIndex);

            const newEnd = firstFitEnd.map((x, xi) => f[xi] || x)

            updatedGaps[firstFitIndex] = [...firstFitStart, ...newEnd];
            filesBackward[fi] = f.map(x => '.')
        }
    })
    return [filesBackward.toReversed(), updatedGaps]
}

rejoin = (files, gaps) => {
    const output = [];

    files.forEach((f, fi) => {
        output.push(f);
        gaps[fi] ? output.push(gaps[fi]) : 0;
    })

    return output;

}

final2 = inp => {
    const expanded = expandDiskMap2(inp);
    console.log(expanded);
    const reordered = fillGaps2(expanded[0], expanded[1]);
    const rejoined = rejoin(reordered[0], reordered[1]).flat();
    console.log(rejoined)
    return checkSum(rejoined)
}

//8583576817788 is too high

final2(smallInput)