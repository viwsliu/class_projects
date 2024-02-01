const Templater = require('./templater');

/** */
test('Undefined', () => {
  const t = new Templater(undefined);
  expect(t.apply({})).toBe(undefined);
});

/** */
test('Single Tag', () => {
  const t = new Templater('Hello {{tag}}');
  expect(t.apply({tag: 'World'})).toBe('Hello World');
});

/** */
test('Multi Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a little lamb');
});

/** */
test('Missing Tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary had a lamb');
});

test('Whitespace in tag', () => {
  const t = new Templater('Mary {{had }} a {{little}} {{lamb}} {{extra  }}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary a little lamb ');
});

test('No space', () => {
  const t = new Templater('Mary {{had}}{{little}} {{lamb}}');
  expect(t.apply({had: 'had', little: 'little', lamb: 'lamb'}))
      .toBe('Mary hadlittle lamb');
});

test('No space missing tag', () => {
  const t = new Templater('Mary {{had}}{{little}}{{lamb}}');
  expect(t.apply({had: 'had', lamb: 'lamb'}))
      .toBe('Mary hadlamb');
});

test('No space missing tags', () => {
  const t = new Templater('Mary {{had}}{{little}}{{lamb}}');
  expect(t.apply({had: 'had'}))
      .toBe('Mary had');
});

test('Tag comes up multiple times in template', () => {
  const t = new Templater('Mary {{had}} {{had}}');
  expect(t.apply({had: 'had'}))
      .toBe('Mary had had');
});

test('Tags separated by something other than space', () => {
  const t = new Templater('Mary {{had}}-{{had}}');
  expect(t.apply({had: 'had'}))
      .toBe('Mary had-had');
});

test('Multiple missing tags', () => {
  const t = new Templater(
      'Mary had a little {{lamb}} who {{is }} {{fake_name}} is {{name}}');
  expect(t.apply({lamb: 'cat', name: 'King'}))
      .toBe('Mary had a little cat who is King');
});

test('Multiple missing tags in map', () => {
  const t = new Templater('Mary had   a little {{lamb}} who is named {{name}}');
  expect(t.apply(
      {lamb: 'cat', name: 'King', who: 'who', tag: 'tag', extra: 'extra'}))
      .toBe('Mary had   a little cat who is named King');
});

// line 82 & 88 done by chatGPT https://chat.openai.com/
test('Strict true: 1, Missing tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(() => t.apply({had: 'had', lamb: 'lamb'}, true))
      .toThrow('Extra Tag in Template/map!');
});

test('Strict true: 2, extra wrong tag', () => {
  const t = new Templater('Mary {{had}} a {{little}} {{lamb}}');
  expect(() => t.apply({had: 'had', lamb: 'lamb', extra: 'extra'}, true))
      .toThrow('Extra Tag in Template/map!');
});

test('Nested tags in template', () => {
  const t = new Templater('Mary had a {{little {{lamb}}}}');
  expect(t.apply({lamb: 'lamb'}))
      .toBe('Mary had a ');
});

test('Nested tags in template 2', () => {
  const t = new Templater('Mary had a {{little {{lamb}}}}');
  expect(t.apply({little: 'little', lamb: 'lamb'}))
      .toBe('Mary had a ');
});

test('Nested tags in template 3', () => {
  const t = new Templater('Mary had a {{little{{lamb}}}}');
  expect(t.apply({little: 'little', lamb: 'lamb', littlelamb: 'little lamb'}))
      .toBe('Mary had a little lamb');
});
