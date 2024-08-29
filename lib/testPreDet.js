// var array = [
//   { name: "all", type: "PRE-DET" },
//   { name: "the", type: "DET" },
//   { name: "men", type: "noun" },
// ];

// var str = "[NP";

// for (let i = 0; i < array.length; i++) {
//     if (array[i].type === "PRE-DET" && array[i + 1]?.type === "DET") {
//       str += "[" + array[i].type + " " + array[i].name + "]";
//       str += "[N'";
//     } else {
//       str += "[" + array[i].type + " " + array[i].name + "]";
//     }
//   }
//   str += "]";

// console.log(str);;

// const DET = [
//     {
//       type: 'ARTICLE',
//       words: ['a', 'an', 'the']
//     },
//     {
//       type: 'DEM',
//       words: ['this', 'that', 'these', 'those']
//     },
//     {
//       type: 'QUANTIFIER',
//       words: ['some', 'any', 'no', 'each', 'every', 'either', 'neither', 'nor', 'a few', 'a little']
//     },
//     {
//       type: 'POSSESSIVE',
//       words: ['my', 'your', 'its', 'her', 'his', 'their', "'s"]
//     }
//   ];
  
//   var array = [
//     {name: 'my', type: 'POSSESSIVE'},
//     { name: 'long', type: 'ADJ' },
//     { name: 'black', type: 'ADJ' },
//     { name: 'table', type: 'noun' }
//   ];
  
//   var str = '[NP';
//   let detFound = false;
  
//   for (let i = 0; i < array.length; i++) {
//     if (['DEM', 'ARTICLE', 'QUANTIFIER', 'POSSESSIVE'].includes(array[i].type)) {
//       const detType = DET.find(item => item.words.includes(array[i].name));
//       if (detType) {
//         str += `[DET [${detType.type} ${array[i].name}]]`;
//         detFound = true;
//         continue;
//       }
//     }
//     str += `[${array[i].type} ${array[i].name}]`;
//   }
  
//   // Add the empty determiner if no determiner was found
//   if (!detFound) {
//     str = str.replace('[NP', '[NP[DET ø]');
//   }
  
//   str += ']';
  
//   console.log(str);

const DET = [
    {
      type: 'ARTICLE',
      words: ['a', 'an', 'the']
    },
    {
      type: 'DEM',
      words: ['this', 'that', 'these', 'those']
    },
    {
      type: 'QUANTIFIER',
      words: ['some', 'any', 'no', 'each', 'every', 'either', 'neither', 'nor', 'a few', 'a little']
    },
    {
      type: 'POSSESSIVE',
      words: ['my', 'your', 'its', 'her', 'his', 'their', "'s"]
    }
  ];
  
  const PREDET = ['all', 'half', 'both', 'double'];
  
  var array = [
    { name: 'all', type: 'PRE-DET' },
    { name: 'my', type: 'POSSESSIVE' },
    { name: 'long', type: 'ADJ' },
    { name: 'black', type: 'ADJ' },
    { name: 'table', type: 'noun' }
  ];
  
  var str = '[NP';
  let detFound = false;
  
  for (let i = 0; i < array.length; i++) {
    if (PREDET.includes(array[i].name)) {
      str += `[PRE-DET ${array[i].name}]`;
      
      if (array[i + 1] && ['DEM', 'ARTICLE', 'QUANTIFIER', 'POSSESSIVE'].includes(array[i + 1].type)) {
        str += '[N\'';
      }
      continue;
    }
    
    if (['DEM', 'ARTICLE', 'QUANTIFIER', 'POSSESSIVE'].includes(array[i].type)) {
      const detType = DET.find(item => item.words.includes(array[i].name));
      if (detType) {
        str += `[DET [${detType.type} ${array[i].name}]]`;
        detFound = true;
        continue;
      }
    }
    str += `[${array[i].type} ${array[i].name}]`;
  }
  
  // Add the empty determiner if no determiner was found
  if (!detFound) {
    str = str.replace('[NP', '[NP[DET ø]');
  }
  
  str += ']';
  
  console.log(str);
  