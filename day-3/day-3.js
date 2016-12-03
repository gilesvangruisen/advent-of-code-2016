'use strict';

const fs = require('fs')

function parseTripletRow(input) {
  return input.split(' ')
    .filter(r => r !== '')
    .map(num => {
      return parseInt(num)
    })
}

function isValidTriangle(triplet) {
  const [a, b, c] = triplet

  return (a + b) > c
      && (b + c) > a
      && (c + a) > b
}

function threeRowsToThreeColumns(rows) {
  return rows.reduce((cols, row, i) => {
    cols[0].push(row[0])
    cols[1].push(row[1])
    cols[2].push(row[2])

    return cols
  }, [[],[],[]])
}

function rowsToColumns(rows) {
  const batches = Array.from(Array(rows.length / 3))

  return batches.reduce((accum, _, batch) => {
    const start = batch * 3

    const cols = threeRowsToThreeColumns([
      rows[start],
      rows[start + 1],
      rows[start + 2],
    ])

    return accum.concat(cols)
  }, [])
}

const inputText = fs.readFileSync('input.txt', 'utf8')

const tripletRows = inputText.trim().split('\n').map(parseTripletRow)
const tripletCols = rowsToColumns(tripletRows)

const rowTriangles = tripletRows.filter(isValidTriangle)
const colTriangles = tripletCols.filter(isValidTriangle)

console.log('When counted by row:')
console.log(`There are ${rowTriangles.length} valid triangles out of ${tripletRows.length} triplets`)

console.log('When counted by column:')
console.log(`There are ${colTriangles.length} valid triangles out of ${tripletCols.length} triplets`)
