const toString = obj => '[' + Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ') + ']';

module.exports = {toString}
