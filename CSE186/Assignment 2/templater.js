/**
 * CSE186 Assignment 2
 *
 */
class Templater {
  /**
   * Create a templater
   * @param {string} template - A {{ }} tagged string
   */
  constructor(template) {
    this.template = template;
  }
  // Source: https://www.w3schools.com/jsref/jsref_regexp_test.asp
  // Source: https://www.w3schools.com/js/js_regexp.asp
  /**
   * Apply map to template to generate string
   * @param {object} map Object with propeties matching tags in template
   * @param {boolean} strict Throw an Error if any tags in template are
   *     not found in map
   * @return {string} template with all tags replaced
   * @throws An Error if strict is set and any tags in template are not
   *     found in map
   */
  apply(map, strict) {
    if (this.template === undefined) {
      return undefined;
    }
    let output = this.template;
    const MapKeysArray = Object.keys(map);
    for (let i = 0; i<MapKeysArray.length; i++) {
      const regex = new RegExp('{{'+MapKeysArray[i]+'}}', 'g'); // https://www.w3schools.com/jsref/jsref_obj_regexp.asp
      const Check = regex.test(output);
      if ((Check ===false) && (strict === true)) {
        throw Error('Extra Tag in Template/map!');
      }
      output = output.replace(regex, map[MapKeysArray[i]]);
    }
    const RegexTemp = new RegExp('\\{{([\\s* \\w* \\s* }]+)}}\\s*', 'g');
    if (RegexTemp.test(output) && strict === true) {
      throw Error('Extra Tag in Template/map!');
    }
    output = output.replaceAll(RegexTemp, '');
    return output;
  }
}

// TA James Helped
// TA Jose Helped

// To satisfy linter rules
new Templater(undefined).apply();
module.exports = Templater;
