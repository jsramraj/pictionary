'use strict';

const getRandomString = function (numberOfChacters) {
    return Array(numberOfChacters).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
}

module.exports = { getRandomString }