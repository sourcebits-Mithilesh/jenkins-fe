export let requiredDigit={
    singleDigit: val=>{if(val>=10){return 1}},
    doubleDigit: val=>{if(val>100){return 2}},
    tripleDigit: val=>{if(val>999.99){return 3}},
    fourDigit:   val=>{if(val>9999.99){return 4}},
    fiveDigit:   val=>{if(val>99999.99){return 5}}
 } 