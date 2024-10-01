import { getHighestMatrixHeight, getHighestMatrixWidth, getMatrix, getMatrixHeight, getMatrixWidth, getMatrixWithoutEmptyValues } from './matrix.js'
import { getBitAsPixel } from './pixel.js'

export const getMessageAsString = (message = [["A", "B", "C"], ["D", "E", "F"]]) => {
    return message.flat().join("")
}

export const getMessageAsBooleanMatrix = (
    message = [["A", "B", "C"], ["D", "E", "F"]],
    { 
        width,
        height,
        valuesToOne,
        valuesToZero,
        unmappedValue,
        removeEmptyValues
    } = {
        width: 3,
        height: 3,
        valuesToOne: ["A", "C", "F"],
        valuesToZero: ["B", "D", "E"],
        unmappedValue: undefined,
        removeEmptyValues: true
    }
) => {
    let matrix = getMatrix(width, height)

    for (let line = 0; line < height; line++) {
        for (let column = 0; column < width; column++) {
            if (!message[line] || !message[line][column]) {
                matrix[line][column] = unmappedValue
            }

            else if (valuesToOne.includes(message[line][column])) matrix[line][column] = 1

            else if (valuesToZero.includes(message[line][column])) matrix[line][column] = 0

            else matrix[line][column] = unmappedValue
        }
    }

    return removeEmptyValues ? getMatrixWithoutEmptyValues(matrix) : matrix
}

export const getStringAsStringMatrix = (
    string = "ABCDEF",
    { 
        width,
        height,
        unmappedValue
    } = {
        width: 3,
        height: 3,
        unmappedValue: undefined
    }
) => {
    let matrix = getMatrix(width, height)

    const splittedString = string.split("")

    let characterIndex = 0

    for (let line = 0; line < width; line++) {
        for (let column = 0; column < width; column++) {
            matrix[line][column] = splittedString[characterIndex] || unmappedValue
            characterIndex ++
        }
    }

    return matrix
}

export const getMessageAsPixelMatrix = (
    message = [["A", "B", "C"], ["D", "E", "F"]],
    {
        valuesToOne,
        valuesToZero,
        unmappedValue,
        removeEmptyValues,
        width,
        height,
        one,
        zero
    } = {
        valuesToOne: ["A", "C", "F"],
        valuesToZero: ["B", "D", "E"],
        unmappedValue: undefined,
        removeEmptyValues: true,
        width: 3,
        height: 3,
        one: "██",
        zero: "  "
    }
) => {
    const booleanMatrix = getMessageAsBooleanMatrix(
        message,
        { 
            width,
            height,
            valuesToOne,
            valuesToZero,
            unmappedValue,
            removeEmptyValues
        }
    ) 

    return booleanMatrix.map(line => line.map(column => getBitAsPixel(column, { one, zero })))
}

export const getMessageAsPixelImage = (
    message = [["A", "B", "C"], ["D", "E", "F"]],
    {
        valuesToOne,
        valuesToZero,
        unmappedValue,
        removeEmptyValues,
        width,
        height,
        one,
        zero
    } = {
        valuesToOne: ["A", "C", "F"],
        valuesToZero: ["B", "D", "E"],
        unmappedValue: undefined,
        removeEmptyValues: true,
        width: undefined,
        height: undefined,
        one: "██",
        zero: "  "
    }
) => {
    let defaultWidth = width || getMatrixWidth(message)
    let defaultHeight = height || getMatrixHeight(message)

    const messageAsPixelMatrix = getMessageAsPixelMatrix(
        message,
        { 
            valuesToOne,
            valuesToZero,
            unmappedValue,
            removeEmptyValues,
            width: defaultWidth,
            height: defaultHeight,
            one,
            zero
        }
    )

    return messageAsPixelMatrix.map(line => line.join(""))
}

export const getXorOfMessages = (
    messages = [[0, 1, 2], [0, 2, 2]], 
    {
        width,
        height,
        removeEmptyValues
    } = {
        width: undefined,
        height: undefined,
        removeEmptyValues: true
    }
) => {
    let defaultWidth = width || getHighestMatrixWidth(messages)
    let defaultHeight = height || getHighestMatrixHeight(messages)

    let matrix = getMatrix(defaultWidth, defaultHeight)

    for (let line = 0; line < defaultHeight; line++) {
        for (let column = 0; column < defaultWidth; column++) {
            let eye = null
            let eyeHasChanged = false

            messages.every(message => {
                if (!message[line] || !message[line][column]) {
                    eyeHasChanged = true
                    return false
                }
                
                if (eye === null) {
                    eye = message[line][column]
                    return true
                } else if (eye !== null && eye !== message[line][column]) {
                    eyeHasChanged = true
                    return false
                }
            })

            if (eye === null) matrix[line][column] = null
            else matrix[line][column] = eyeHasChanged ? 1 : 0
        }
    }

    return removeEmptyValues ? getMatrixWithoutEmptyValues(matrix) : matrix
}