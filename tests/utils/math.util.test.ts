import { expect } from 'chai';
import { getRandomIntNumber, isNumberInRange } from '@utils/math.util';

describe('MathUtil', () => {
  describe('getRandomIntNumber', () => {
    it('Should return single, positive, random integer number from given range', () => {
      let randomNumber: number = getRandomIntNumber(10, 50);
      expect(randomNumber).to.be.an('number').greaterThanOrEqual(10).lessThanOrEqual(50);

      randomNumber = getRandomIntNumber(1, 5);
      expect(randomNumber).to.be.an('number').greaterThanOrEqual(1).lessThanOrEqual(5);

      randomNumber = getRandomIntNumber(100, 500);
      expect(randomNumber).to.be.an('number').greaterThanOrEqual(100).lessThanOrEqual(500);
    });
  });

  describe('isNumberInRange', () => {
    it('Should return true if number is in given range and false if not', () => {
      let numberInRange: boolean = isNumberInRange(100, 10, 50);
      expect(numberInRange).to.be.an('boolean').equals(false);

      numberInRange = isNumberInRange(1, 10, 50);
      expect(numberInRange).to.be.an('boolean').equals(false);

      numberInRange = isNumberInRange(25, 10, 50);
      expect(numberInRange).to.be.an('boolean').equals(true);

      numberInRange = isNumberInRange(49, 10, 50);
      expect(numberInRange).to.be.an('boolean').equals(true);
    });
  });
});
