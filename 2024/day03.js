smallInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;


muls=inp=> {
    reg = /mul\(\d+,\d+\)/g
    return [...inp.matchAll(reg)].map(x=>x[0]).map(x=> x.slice(4,x.length-1))
}

multiply=mul=>{
    values = mul.split(',');
    return values[0]*values[1]
}

final=inp=> {
    mulls = muls(inp);
    mulled = mulls.map(x => multiply(x));
    return mulled.reduce((a,c)=>a+c)
}


smallInput2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
mulsAndDo=inp=> {
    reg = /(mul\(\d+,\d+\))|(do\(\))|(don\'t\(\))/g
    return [...inp.matchAll(reg)].map(x=>x[0])
}

mulsAndDo(smallInput2)

final2=inp=> {
    instructions = mulsAndDo(inp);
    total = 0;
    doit = true;
    instructions.forEach(inst => {
        if (inst === 'do()') {
            doit = true;
        } else if (inst === `don't()`) {
            doit = false;
        } else if (doit && inst[0]==='m') {
            values = inst.slice(4,inst.length-1).split(',');
            total += values[0]*values[1]
        }
    })
    return total;
}

