/**
 * CSE186 Assignment 3 - Basic
 */
class Templater {
  /**
   * Replace the contents of {{ }} tagged table header and data
   * elements in document with values found in the supplied JSON
   * @param {object} document
   * @param {string} json with propeties matching tags in document
   */
  byTag(document, json) {
    // https://www.w3schools.com/js/js_json_parse.asp

    const jsonObject = JSON.parse(json); // Json turned array
    const keys = Object.keys(jsonObject); // array of keys
    const totaltr = document.getElementsByTagName('tr');

    for (let i = 0; i<totaltr.length; i++) { // totaltr is 6
      const rows = document.getElementsByTagName('tr')[i];
      const headers = rows.getElementsByTagName('th');
      const cells = rows.getElementsByTagName('td');

      // replace header tags with correct values
      for (let j = 0; j<headers.length; j++) {
        const regExp = RegExp('\{\{(.*?)\}\}', 'g');
        const strippedtag = regExp.exec(headers[j].innerHTML);
        if ((jsonObject[strippedtag[1]] != undefined)) {
          headers[j].innerHTML = jsonObject[strippedtag[1]];
        } else { // replace remaining existing {{ }} tags
          headers[j].innerHTML = '';
        }
      }
      // replace cell tags with correct values
      for (let k = 0; k<cells.length; k++) { // cells.length = 3
        const regExp = RegExp('\{\{(.*?)\}\}', 'g');
        const replaceRemaining = regExp.exec(cells[k].innerHTML);
        cells[k].innerHTML=replaceRemaining[1];
        if (keys.includes(replaceRemaining[1])) {
          cells[k].innerHTML=jsonObject[replaceRemaining[1]];
        } else {
          cells[k].innerHTML = '';
        }
      }
    }
  }

  /**
   * Replace the contents of table header and data elements in
   * in document with id'd content found in the supplied JSON
   * @param {object} document
   * @param {string} json with propeties matching element ids in document
   */
  byId(document, json) {
    const jsonObject = JSON.parse(json);
    const totaltagstd = document.querySelectorAll('td');
    const totaltagsth = document.querySelectorAll('th');

    const regExp = RegExp('.*', 'g');
    for (let i = 0; i < totaltagstd.length; i++) {
      const tag = totaltagstd[i];
      tag.innerHTML = tag.innerHTML.replace(regExp, '');
    }
    for (let i = 0; i < totaltagsth.length; i++) {
      const tag = totaltagsth[i];
      tag.innerHTML = tag.innerHTML.replace(regExp, '');
    }

    const keys = Object.keys(jsonObject);
    for (let j = 0; j<keys.length; j++) {
      document.getElementById(keys[j]).innerHTML = jsonObject[keys[j]];
    }
  }
}

// To satisfy linter rules
new Templater();
