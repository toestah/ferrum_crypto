let shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
}

let getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
  }

let generatePrivateKey = () => {
    let address = [];
    let hexCodes = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']
    for (let i = 0; i < 64; i++){
        hexCodes = shuffle(hexCodes)
        address.push(hexCodes[getRandomInt(1600) % 16]);
    }
    return address.join('')
}

let matchString = ''
while (matchString != 'B00B'){
    matchString = generatePrivateKey().slice(0,4)
    console.log(matchString)
    //matchString = 'B00B'

}




