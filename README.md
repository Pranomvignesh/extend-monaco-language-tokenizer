Extend Language Configuration in Monaco Editor <!-- omit in toc -->
==============================================

Monaco editor is an online editor with syntax highlighting. It offers `syntax highlighting support for many languages by         default`.
 But we might need `custom syntax highlighting` to match our real life use-cases.
 Unfortunately, there is no API available to extend the language configuration, Refer this [comment](https://github.com/microsoft/monaco-editor/issues/1927#issuecomment-690917295)

As per the advice, I have overwritten the `output of the built-in tokenizer`

**Table of contents** <!-- omit in toc -->
---------------------

- [How I Approached](#how-i-approached)
- [Actual Code](#actual-code)
- [Advantages](#advantages)
- [Limitations](#limitations)
- [Take Away](#take-away)
- [Github Link](#github-link)
- [Running the App](#running-the-app)

How I Approached
----------------

1.  I took all the language configurations that is available in the monaco editor using the API [monaco.languages.getLanguages()](https://microsoft.github.io/monaco-editor/api/modules/monaco.languages.html#getlanguages)
2.  Then i filtered out my desired language (in my case, I took `javascript`)
3.  There will a method named `loader()`, which will be available for all the registered languages
4.  On executing the loader, it will return an object containing 2 keys named ,the `configuration` and `language`
5.  This language will hold the tokenizer data
6.  I took this tokenizer and `modified the           certain parts with my custom tokens`
7.  The modification is done in such a way, that the `base object reference is unaffected`

Actual Code
-----------

```javascript
const allLangs = await monaco.languages.getLanguages();
const { conf, language: jsLang } = allLangs.find(({ id }) => id ==='javascript').loader();
for (let key in customTokenizer) {
  const value = customTokenizer[key];
  if (key === 'tokenizer') {
    for (let category in value) {
      const tokenDefs = value[category];
      if (!jsLang.tokenizer.hasOwnProperty(category)) {
        jsLang.tokenizer[category] = [];
      }
      if (Array.isArray(tokenDefs)) {
        jsLang.tokenizer[category].unshift.apply(jsLang.tokenizer[category], tokenDefs)
      }
    }
  } else if (Array.isArray(value)) {
    if (!jsLang.hasOwnProperty(key)) {
      jsLang[key] = [];
    }
    jsLang[key].unshift.apply(jsLang[key], value)
  }
}
```

Advantages
----------

1.  In monaco-editor, the `javascript worker provides         excellent code completions`, If we create a new language tokenizer, we might lose this suggestions. This method avoids the need for a new language, thus preserves the code completions
2.  This custom tokenizer `follows the monaco editor’s         monarch pattern`, So if you have already written custom tokenizers, it will be easy for migration
3.  The tokens are added in such a way that `custom         tokens are given high priority` and this can also be modified by altering the `unshift` to `push` in `jsLang keys`

Limitations
-----------

As monaco editor some how stores the language configuration inside monaco instance, We have to overwrite the language configuration `before         creation of any model (or) editor` in that desired language

Take Away
---------

This method is possible only because of `monaco       editor’s lazy loading feature` (thanks to monaco editor team), where it loads the language configuration only when a model (or) editor instance is created for that language

`So if we can change the         configuration of the         language before monaco uses it we can achieve the desired customization`

Github Link
-----------

Profile Link : [PranomVignesh](https://github.com/Pranomvignesh)

 Repository Link : [Extend Language Configuration in Monaco Editor](https://github.com/Pranomvignesh/extend-monaco-language-tokenizer)

Running the App
---------------
- git clone https://github.com/Pranomvignesh/extend-monaco-language-tokenizer
- npm install
- npm run server