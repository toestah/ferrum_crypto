const secp256k1 = require('secp256k1');
const crypto = require('crypto')
const ripemd160 = require('ripemd160')
const bs58 = require('bs58');

// function to shuffle the order of hex characters to promote randomness when generating private key
let shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
}

let getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
  }

//randomly generates a private key (note: more secure private key generation methods exist. Recommend that you manually modify a few characters in the generated key, to be safe)
let generatePrivateKey = () => {
    let address = [];
    let hexCodes = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']
    for (let i = 0; i < 64; i++){
        hexCodes = shuffle(hexCodes)    //comment this line out if speed is desired over randomness
        address.push(hexCodes[getRandomInt(16)]);
    }
    return address.join('')
}

//generates a Bitcoin address from a given private key (64 hex character string)
let generateBTCAddress = (privKey) => {
    const privKeyBytes = Buffer.from(privKey,'hex');  //convert the hex string to byte array

    const pubKey = secp256k1.publicKeyCreate(privKeyBytes);
    //const pubKeyHex = Buffer.from(pubKey).toString('hex');
    
    // calculate raw address by taking ripemd160 hash of sha256 hash of pubkey 
    const raFirstHash = crypto.createHash('sha256').update(pubKey).digest('bytes')
    const rawAddress = new ripemd160().update(raFirstHash).digest('hex')
    
    // calculate checksum by taking double sha256 hash of rawAddress with prefix (00) prepended
    const prefix = '00'
    const csFirstHash = crypto.createHash('sha256').update(Buffer.from(prefix+rawAddress,'hex')).digest('bytes');
    const checkSum = crypto.createHash('sha256').update(csFirstHash).digest('hex');
    
    // calculate Bitcoin Address (compressed) by taking base 58 encoding the full address (which is the prefix prepended to rawaddress prepended to the first 4 bytes of checkSum)
    // this is equivalent to base58check encoding of rawAddress
    const fullAddress = Buffer.from(prefix+rawAddress+checkSum.slice(0,8),'hex')
    return bs58.encode(fullAddress);
}

//generates a vanity address (case insensitive, vanity string located in any part of the address)
let generateVanityAddress = (matchString) => {
    let finalPrivKey = ''
    let finalAddress = ''
    let count = 0;
    
    while (!finalAddress.toLowerCase().includes(matchString)){
        finalPrivKey = generatePrivateKey();
        finalAddress = generateBTCAddress(finalPrivKey);
        count++;
    }
    
    let output = `        Your Generated Bitcoin address is: ${finalAddress}
        The private key (hex encoded) for this address is: ${finalPrivKey}
        It took ${count} tries to find this address`
    
    return output;
}

//TEST CASES

//Test Case 1
let matchString = 'waseem'

console.log('Test 1: Vanity Address Generator matching string: ' + matchString)
console.log(generateVanityAddress(matchString));

console.log('\n')

//Test Case 2

// Randomly generate a private key
const privKey = generatePrivateKey();

// Alternately, you can manually define it yourself (32 byte string; 64 hex characters)
//const privKey = 'D71C6B1538A84CAE54209A7A2AE9C839B04ABD7F0509232116928D6CEDF41270';

console.log('Test 2: Address Generator from private key')
console.log('   Your private key is: ' + privKey)
console.log('   Your address is: ' + generateBTCAddress(privKey) + '\n')