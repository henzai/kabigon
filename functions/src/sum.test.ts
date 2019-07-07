import {sum} from './sum';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});