import test from 'ava';

import { isDigit, isLetter } from './tokens';

test('isDigit should return true for string numbers', (t) =>
    t.is(isDigit('1'), true));

test('isDigit should return false for letters', (t) =>
    t.is(isDigit('a'), false));

test('isDigit should return false for null', (t) => t.is(isDigit(null), false));

test('isDigit should return true for actual numbers', (t) =>
    t.is(isDigit(1), true));

test('isLetter should return true for lowercase string letters', (t) =>
    t.is(isLetter('a'), true));

test('isLetter should return true for uppercase string letters', (t) =>
    t.is(isLetter('Z'), true));

test('isLetter should return true for underscore as well', (t) =>
    t.is(isLetter('_'), true));

test('isLetter should return false for null', (t) =>
    t.is(isLetter(null), false));

test('isLetter should return false for numbers', (t) =>
    t.is(isLetter(9), false));
