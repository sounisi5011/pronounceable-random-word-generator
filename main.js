(function(global) {
  'use strict';

  var window = global.window;
  var document = global.document;
  var h = global.hyperapp.h;
  var app = global.hyperapp.app;

  // @see https://github.com/jsbin/jsbin/blob/31f5ebb26e3b41b03ac33ea3fe712923be986352/lib/utils.js#L143-L144
  var DEFAULT_VOWELS_CHARS = 'aeiou';
  var DEFAULT_CONSONANTS_CHARS = 'bcdfghjklmnpqrstvwxyz';
  var DEFAULT_WORD_LENGTH = 5;

  function uniqueChars(str) {
    var charList = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
    return charList
      .sort(function(a, b) {
        var len_diff = a.length - b.length;
        if (len_diff !== 0) {
          return len_diff;
        }
        return a < b ? -1 : b < a ? 1 : 0;
      })
      .filter(function(item, index, array) {
        return index < 1 || item !== array[index - 1];
      });
  }

  var state = {
    vowelsChars: DEFAULT_VOWELS_CHARS,
    consonantsChars: DEFAULT_CONSONANTS_CHARS,
    wordLength: DEFAULT_WORD_LENGTH,
    word: '',
    getVowelsCharsList: function() { return uniqueChars(DEFAULT_VOWELS_CHARS); },
    getConsonantsCharsList: function() { return uniqueChars(DEFAULT_CONSONANTS_CHARS); },
    getWordLength: function() { return DEFAULT_WORD_LENGTH; }
  };
  var actions = {
    setVowelsNode: function(element) {
      return {
        getVowelsCharsList: function() {
          var str = element.value;
          return uniqueChars(1 <= str.length ? str : DEFAULT_VOWELS_CHARS);
        }
      };
    },
    setConsonantsNode: function(element) {
      return {
        getConsonantsCharsList: function() {
          var str = element.value;
          return uniqueChars(1 <= str.length ? str : DEFAULT_CONSONANTS_CHARS);
        }
      };
    },
    setLengthNode: function(element) {
      return {
        getWordLength: function() {
          var length = Number(element.value);

          if (!isFinite(length)) {
            return DEFAULT_WORD_LENGTH;
          }

          return Math.max(1, length);
        }
      };
    },
    generateWord: function() {
      return function(state) {
        var vowelsCharsList = state.getVowelsCharsList();
        var consonantsCharsList = state.getConsonantsCharsList();
        var wordLength = state.getWordLength();
        var word = '';
        var charsList;

        for (var i = 0; i < wordLength; i++) {
          charsList = (i % 2 === 0) ? consonantsCharsList : vowelsCharsList;
          word += charsList[Math.floor(Math.random() * charsList.length)];
        }

        return {
          vowelsChars: vowelsCharsList.join(''),
          consonantsChars: consonantsCharsList.join(''),
          wordLength: wordLength,
          word: word
        };
      };
    }
  };
  var view = function(state, actions) {
    return h('div', {}, [
      h('div', { class: 'input-form' }, [
        h('p', {}, [
          h('label', { for: 'length-input' }, 'Word length: '),
          h('input', {
            type: 'number',
            id: 'length-input',
            value: state.wordLength,
            min: 1,
            oncreate: actions.setLengthNode
          })
        ]),
        h((Modernizr.details ? 'details' : 'fieldset'), { class: 'chars-option' }, [
          h((Modernizr.details ? 'summary' : 'legend'), {}, 'Characters option'),
          h('p', {}, [
            h('label', { for: 'vowels-input' }, 'Vowels: '),
            h('input', {
              type: 'text',
              id: 'vowels-input',
              value: state.vowelsChars,
              oncreate: actions.setVowelsNode
            })
          ]),
          h('p', {}, [
            h('label', { for: 'consonants-input' }, 'Consonants: '),
            h('input', {
              type: 'text',
              id: 'consonants-input',
              value: state.consonantsChars,
              oncreate: actions.setConsonantsNode
            })
          ])
        ]),
        h('p', {}, [
          h('input', {
            type: 'button',
            value: 'Generate!',
            onclick: actions.generateWord
          })
        ])
      ]),
      state.word !== '' ? h('p', { class: 'output' }, state.word) : null
    ]);
  };

  app(state, actions, view, document.getElementById('main'));
})(Function('return this')());
