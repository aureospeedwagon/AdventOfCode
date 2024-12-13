smallInput = `3   4
4   3
2   5
1   3
3   9
3   3`

dataFormatter0=inp=>inp.split('\n').map(x=>x.split('   ')[0]);
dataFormatter1=inp=>inp.split('\n').map(x=>x.split('   ')[1]);

diff=(a,b)=>Math.abs(a,b);

final=(inp)=> {
    inp0 = dataFormatter0(inp).sort();
    inp1 = dataFormatter1(inp).sort();
    
    diffs = inp0.map((v,i)=> diff(inp0[i], inp1[i]))
    return diffs.reduce((a,c)=>a+c);
}

similarity=(inp0, inp1, i)=> {
    count1 = inp1.filter(x=> x===inp0[i]).length;
    return inp0[i]*count1
}

final2=(inp)=> {
    inp0 = dataFormatter0(inp);
    inp1 = dataFormatter1(inp);
    
    diffs = inp0.map((v,i)=> similarity(inp0, inp1,i));
    console.log(diffs);
    return diffs.reduce((a,c)=>a+c);
}
