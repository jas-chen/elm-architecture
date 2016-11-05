// https://davidwalsh.name/javascript-arguments
function getArgsNames(func) {
  // First match everything inside the function argument parens.
  var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
 
  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function(arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter(function(arg) {
    // Ensure no undefined values are added.
    return arg;
  });
}

export function logMsg(msg, log) {
  const payload = {};
  getArgsNames(msg.constructor).forEach((n, i) => payload[n] = msg.args[i]);
  if (!log) console.log(msg.constructor.name, payload);
  else if (typeof log === 'function') log(msg.constructor.name, payload);
  else if (typeof log === 'string') console[log](msg.constructor.name, payload);
}