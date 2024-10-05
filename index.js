// Fungsi untuk menghitung ekspektasi kemenangan
function calculateExpectationRating(playerARating, playerBRating) {
  const exponent = (playerBRating - playerARating) / 400;
  const expectation = 1 / (1 + Math.pow(10, exponent));
  return expectation;
}

// Fungsi untuk memperbarui rating
function updateRating(currentRating, expectation, score, kFactor) {
  const deltaRating = kFactor * (score - expectation);
  const newRating = currentRating + deltaRating;
  return newRating;
}

// Rating awal setiap pemain
const ratingA = 2500;
const ratingB = 2000;
const ratingC = 1500;
const ratingD = 1000;

const kFactorA = 20
const kFactorB = 25
const kFactorC = 30
const kFactorD = 35

const winScore = 1
const loseScore = 2

// Hitung ekspektasi kemenangan untuk tim AB
const expectationAB = calculateExpectationRating(ratingC + ratingD, ratingA + ratingB);

// Hitung perubahan rating untuk tim AB
const newRatingA = updateRating(ratingA, expectationAB, winScore, kFactorA);
const newRatingB = updateRating(ratingB, expectationAB, winScore, kFactorB);

console.log("Rating baru pemain A: ", Math.ceil(newRatingA));
console.log("Rating baru pemain B: ", Math.ceil(newRatingB));

// Hitung ekspektasi kemenangan untuk tim CD
const expectationCD = calculateExpectationRating(ratingA + ratingB, ratingC + ratingD);

// Hitung perubahan rating untuk tim CD
const newRatingC = updateRating(ratingC, expectationCD, loseScore, kFactorC);
const newRatingD = updateRating(ratingD, expectationCD, loseScore, kFactorD);

console.log("Rating baru pemain C: ", Math.ceil(newRatingC));
console.log("Rating baru pemain D: ", Math.ceil(newRatingD));




const bobotA = 4
const bobotB = 3
const bobotC = 2
const bobotD = 1

const totalAB = bobotA + bobotA
const totalCD = bobotB + bobotB

const kontriA = bobotA / totalAB
const kontriB = bobotA / totalAB
const kontriC = bobotB / totalCD
const kontriD = bobotB / totalCD


const poinA = Math.floor(kontriA * 30)
const poinB = Math.floor(kontriB * 30)
const poinC = Math.floor(kontriC * 30)
const poinD = Math.floor(kontriD * 30)

console.log('Point baru pemain A: ', poinA);
console.log('Point baru pemain B: ', poinB);
console.log('Point baru pemain C: ', poinC);
console.log('Point baru pemain D: ', poinD);

const random = () => {
  const letters = ['A','B','C','D','E']
  const randomIndex = Math.floor(Math.random() * letters.length)
  return letters[randomIndex]
}

console.log(random())
console.log(random())

console.log(random())
console.log(random())

console.log(random())
console.log(random())

console.log(random())
console.log(random())

console.log(random())
console.log(random()) 