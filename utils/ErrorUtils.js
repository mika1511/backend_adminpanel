
const missingParameter = (field) => {
    return `Invalid requests. Missing required field(s): ${field}`
}

const invalidParameter = (fieldValue) => {
    return `Invalid requests. Invalid value passed. ${fieldValue}`
}

const invalidOperation = (message) => {
    return `Invalid operation. ${message}`
}
module.exports = { missingParameter, invalidParameter, invalidOperation}