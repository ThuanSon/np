// const api = fetch('https://mshang.ca/syntree/?i=[S[NP[N%20Alice]][VP[V%20is][NP[N%27[N%20a%20student][PP^%20of%20physics')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.text();
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('There has been a problem with your fetch operation:', error);


//   });
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

var array = [
  {name: "Alice's", type: 'POSSESSIVE'},
  { name: 'long', type: 'ADJ' },
  { name: 'black', type: 'ADJ' },
  { name: 'table', type: 'noun' }
];

var str = '[NP';
let detFound = false;

for (let i = 0; i < array.length; i++) {
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

