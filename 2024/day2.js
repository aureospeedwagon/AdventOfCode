smallInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

dataFormatter=inp=> inp.split('\n').map(x=>x.split(' '));
rowFormatter=row=>row.map((v,i)=> row[i+1] - v).slice(0,row.length-1);

isSafe=row=> {
    formatted = rowFormatter(row);
    safePositive = formatted.every(x=> x>0 && x<4);
    safeNegative = formatted.every(x=> x<0 && x>-4);
    return safePositive || safeNegative
}

final=inp=> {
    rows = dataFormatter(inp);
    safety = rows.map(row=>isSafe(row));
    return safety.filter(x=>x).length
}

dumbChecker=row=> {
    damped = row.map((v,i)=>{
        modded = [...row];
        modded.splice(i,1);
        return isSafe(modded)
    });
    return damped.some(x=>x);
}

isDampSafe=row=> {
    if (isSafe(row)){
        return true;
    } else {
        return dumbChecker(row);
    }
}




final2=inp=> {
    rows = dataFormatter(inp);
    safety = rows.map(row=>isDampSafe(row));
    return safety.filter(x=>x).length
}
