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

  var state = {
    vowelsChars: DEFAULT_VOWELS_CHARS,
    consonantsChars: DEFAULT_CONSONANTS_CHARS,
    wordLength: DEFAULT_WORD_LENGTH,
    word: '',
    getVowelsChars: function() { return DEFAULT_VOWELS_CHARS; },
    getConsonantsChars: function() { return DEFAULT_CONSONANTS_CHARS; },
    getWordLength: function() { return DEFAULT_WORD_LENGTH; }
  };
  var actions = {
    setVowelsNode: function(element) {
      return {
        getVowelsChars: function() {
          return element.value;
        }
      };
    },
    setConsonantsNode: function(element) {
      return {
        getConsonantsChars: function() {
          return element.value;
        }
      };
    },
    setLengthNode: function(element) {
      return {
        getWordLength: function() {
          return Number(element.value);
        }
      };
    },
    generateWord: function() {
      return function(state) {
        var vowelsChars = state.getVowelsChars();
        var consonantsChars = state.getConsonantsChars();
        var wordLength = state.getWordLength();
        var word = '';
        var chars;

        for (var i = 0; i < wordLength; i++) {
          chars = (i % 2 === 0) ? consonantsChars : vowelsChars;
          word += chars[Math.floor(Math.random() * chars.length)];
        }

        return {
          vowelsChars: vowelsChars,
          consonantsChars: consonantsChars,
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
        ]),
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
        h('p', {}, [
          h('input', {
            type: 'button',
            value: 'Generate!',
            onclick: actions.generateWord
          })
        ])
      ]),
      h('p', { class: 'output' }, state.word)
    ]);
  };

  var main = app(state, actions, view, document.getElementById('main'));
  main.generateWord();
})(Function('return this')());
