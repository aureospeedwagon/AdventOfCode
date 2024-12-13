const smallInputRules = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13`;

const smallInputUpdates=`75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;



const parseUpdatesToArrays = (inp) => inp.split(`\n`).map((x) => x.split(`,`));

const parseRules=(inp)=> inp.split(`\n`).map((x) => x.split(`|`));

const mapRules=(rules)=> {
    const marp = new Map();
    rules.forEach((r) => {
        if (!marp.has(r[0])) {
            marp.set(r[0], [])
        }
        marp.get(r[0]).push(r[1])
    })
    return marp;
}

const final=(inpRules,inpUpdates)=> {
    const rules = mapRules(parseRules(inpRules));
    const updates = parseUpdatesToArrays(inpUpdates);

    const validUpdates = updates.filter(u => {
        valid = true;
        u.forEach((x,xi)=> {
            before = u.slice(0,xi);
            allowedBefore = rules.get(x) ?? [];

            invalidPages = before.filter(p=>allowedBefore.includes(p))

            if (invalidPages.length) {
                valid=false
            }
            
        })
        return valid
    });

    return validUpdates.map(v => Number(v[Math.floor(v.length/2)])).reduce((a,c)=>a+c);
}


const getInvalidUpdates=(inpRules,inpUpdates)=> {
    const rules = mapRules(parseRules(inpRules));
    const updates = parseUpdatesToArrays(inpUpdates);

    const invalidUpdates = updates.filter(u => {
        let invalid = false;
        u.forEach((x,xi)=> {
            before = u.slice(0,xi);
            allowedBefore = rules.get(x) ?? [];

            invalidPages = before.filter(p=>allowedBefore.includes(p))

            if (invalidPages.length) {
                invalid=true
            }
            
        })
        return invalid;
    });

    return invalidUpdates
}

const getRelevantRules=(update, rules)=> {
    const relevantRulesMap = new Map();
    update.forEach(page => {
        if (rules.has(page)){
            pageRules = new Set(rules.get(page));
            relevantRules = pageRules.intersection(new Set(update))

            relevantRulesMap.set(page, [...relevantRules]);
        } else {
            relevantRulesMap.set(page, [])
        }

    })

    return relevantRulesMap;
}


fixUpdate=(inpRules,invalidUpdate)=> {
    const rules = getRelevantRules(invalidUpdate, mapRules(parseRules(inpRules)));
    const sorted =  Array.from(rules).sort((a,b)=>b[1].length-a[1].length);
    return sorted.map(x=>x[0])
}

final2=(inpRules,inpUpdates)=> {
    const invalidUpdates = getInvalidUpdates(inpRules, inpUpdates)
    const fixed = invalidUpdates.map(iu=> fixUpdate(inpRules, iu))
    return fixed.map(v => Number(v[Math.floor(v.length/2)])).reduce((a,c)=>a+c)
}

final2(smallInputRules, smallInputUpdates)