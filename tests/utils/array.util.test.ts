import { expect } from 'chai';
import {
  isArrayContainAtLeastOneValueOfCompareArray,
  countNumberOfMatchingValuesBetweenArrays
} from '@utils/array.util';

describe('ArrayUtil', () => {
  describe('isArrayContainAtLeastOneValueOfCompareArray', () => {
    it('Should return true if array cointains at least one value from compare array and false if not', () => {
      let arrayContainsAtLeastOneValueOfComapreArray: boolean = isArrayContainAtLeastOneValueOfCompareArray(
        [10, 20],
        [50, 100, 200]
      );
      expect(arrayContainsAtLeastOneValueOfComapreArray).to.be.an('boolean').equals(false);

      arrayContainsAtLeastOneValueOfComapreArray = isArrayContainAtLeastOneValueOfCompareArray([1, 2, 3], [3, 4, 5]);
      expect(arrayContainsAtLeastOneValueOfComapreArray).to.be.an('boolean').equals(true);

      arrayContainsAtLeastOneValueOfComapreArray = isArrayContainAtLeastOneValueOfCompareArray(
        [100, 200, 300],
        [400, 500]
      );
      expect(arrayContainsAtLeastOneValueOfComapreArray).to.be.an('boolean').equals(false);
    });
  });

  describe('countNumberOfMatchingValuesBetweenArrays', () => {
    it('Should return number of matching values between array and compare array', () => {
      let countNumberOfMatchingValues: number = countNumberOfMatchingValuesBetweenArrays([100, 10, 50], [100, 10, 50]);
      expect(countNumberOfMatchingValues).to.be.an('number').equals(3);

      countNumberOfMatchingValues = countNumberOfMatchingValuesBetweenArrays([1, 2, 3], [4, 5, 6]);
      expect(countNumberOfMatchingValues).to.be.an('number').equals(0);

      countNumberOfMatchingValues = countNumberOfMatchingValuesBetweenArrays([100, 200, 300], [300, 400, 500]);
      expect(countNumberOfMatchingValues).to.be.an('number').equals(1);

      countNumberOfMatchingValues = countNumberOfMatchingValuesBetweenArrays([100, 10, 1], [100, 10, 2]);
      expect(countNumberOfMatchingValues).to.be.an('number').equals(2);
    });
  });
});
