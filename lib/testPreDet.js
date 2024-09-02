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
    type: "ARTICLE",
    words: ["a", "an", "the"],
  },
  {
    type: "DEM",
    words: ["this", "that", "these", "those"],
  },
  {
    type: "QUANTIFIER",
    words: [
      "some",
      "any",
      "no",
      "each",
      "every",
      "either",
      "neither",
      "nor",
      "a few",
      "a little",
    ],
  },
  {
    type: "POSSESSIVE",
    words: ["my", "your", "its", "her", "his", "their", "'s"],
  },
];

const PREDET = {
  type: "PRE-DET",
  words: ["all", "half", "both", "double"],
};

const QA = ["much", "many", "several", "few", "little"];

const DEG = [
  { name: "too", type: "adverb", expend: "DEG" },
  { name: "so", type: "adverb", expend: "DEG" },
  { name: "very", type: "adverb", expend: "DEG" },
  //còn nữa
];

var array = [
  { name: "all", type: "PRE-DET" },
  { name: "my", type: "POSSESSIVE" },
  { name: "too", type: "adverb" },
  { name: "long", type: "ADJ" },
  { name: "black", type: "ADJ" },
  { name: "table", type: "noun" },
];

var str = "[NP";
let preDetStr = ""; // To hold the PRE-DET part
let detStr = ""; // To hold the DET part
let detFound = false;
let preDetFound = false;

function detRecognize(array) {
  for (let i = 0; i < array.length; i++) {
    if (PREDET.type.includes(array[i].type)) {
      preDetStr = `[PRE-DET ${array[i].name}]`;
      preDetFound = true;
      continue;
    }

    if (
      ["DEM", "ARTICLE", "QUANTIFIER", "POSSESSIVE"].includes(array[i].type)
    ) {
      const detType = DET.find((item) => item.words.includes(array[i].name));
      if (detType) {
        detStr = `[DET [${detType.type} ${array[i].name}]]`;
        detFound = true;
        continue;
      }
    }
    // str += `[${array[i].type} ${array[i].name}]`;
  }
}

function apRecongize(array_temp) {
  let flag_det = false;
  let flag_predet = false;

  // Kiểm tra xem có DET và PREDET không
  for (let i = 0; i < array_temp.length; i++) {
    if (DET.some((item) => item.type.includes(array_temp[i].type))) {
      flag_det = true;
    }
    if (PREDET.type.includes(array_temp[i].type)) {
      flag_predet = true;
    }
  }

  // Nếu cả DET và PREDET đều được tìm thấy, loại bỏ 2 phần tử này khỏi array
  if (flag_det && flag_predet) {
    array_temp = array_temp.slice(2);
  } else if (flag_det || flag_predet) {
    array_temp = array_temp.slice(1);
  }

  str += `[N'`;
  array = array_temp;

  function subAP(array) {
    array = array.filter((item) => !item.type.includes("noun"));
    //mặc định DEG là 1
    str += `[AP`;
    function degRecongize(array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].type === "adverb") {
          str += `[DEG ${array[i].name}]`;
        }
      }
    }
    degRecongize(array);
  }
  subAP(array);
}

detRecognize(array);

apRecongize(array);

// Prepend PRE-DET and DET parts in the correct order
if (!preDetFound) {
  preDetStr = "[PRE-DET ø]";
}
if (!detFound) {
  detStr = "[DET ø]";
}

// degRecongize(array);

str = "[NP" + preDetStr + detStr + str.slice(3) + "]";

console.log(str);
