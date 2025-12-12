smallInputA = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###`;

smallInputB = `4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;


shapeSize = shape => [...shape].filter(x => x === '#').length;

parseShapes = inp => inp.split(`\n\n`).map(x => parseShape(x));
parseShape = inp => {
    const [id, shape] = inp.split(`:\n`);
    return shape;
};



parseRegions = inp => inp.split(`\n`).map(x => parseRegion(x));
parseRegion = inp => {
    const [size, gifts] = inp.split(`: `);
    const [x, y] = size.split('x').map(x => Number(x));
    const giftArray = gifts.split(' ').map(x => Number(x))
    return { size: { x, y }, area: x*y, gifts: giftArray };
};

getTotalGiftArea=(region, shapeMap)=> {
    let tot = 0
    region.gifts.map((g,gi)=> {
        tot += shapeMap.get(gi).size * g;
    })
    return tot;
}


unparse = inp => inp.map(x => x.join(``)).join(`\n`);
sum = inp => inp.reduce((a, c) => a + c);
mul = inp => inp.reduce((a, c) => a * c);

final = (unparsedShapes, unparsedRegions) => {
    const shapes = parseShapes(unparsedShapes);
    let shapeMap = new Map();
    shapes.forEach((s, si) => {
        shapeMap.set(si, {s, size: shapeSize(s)})
    })

    const regions = parseRegions(unparsedRegions);


    const potentiallyValid = regions.filter(reg => {
        let giftArea = getTotalGiftArea(reg, shapeMap);
        if (reg.area >= giftArea) {
            return true;
        } else {
            return false;
        }
    })


    return potentiallyValid.length;
}

final(smallInputA, smallInputB);

//holy cow, the shapes decided to be not tricky, so this just works.
