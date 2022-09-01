'use strict';
import expect from 'expect.js';
import {asArray} from 'widjet-utils';
import {setPageContent} from 'widjet-test-utils/dom';

import FragmentLoader from '../src/fragments';

describe('Fragment loader', () => {
  let loader;


  beforeEach(() => {
    setPageContent('');
    loader = new FragmentLoader();
  });

  afterEach(() => {
    loader.clearCache();
  })

  describe('loading a single file', () => {
    let promise;

    describe('that exists', () => {
      beforeEach(() => {
        promise = loader.load('./test/fixtures/fragment.html');
      });

      it('returns a promise that resolves with the fragment', () => {
        return promise.then((fragment) => {
          const children = asArray(fragment.children);

          expect(children.length).to.eql(3);
          expect(children.map(n => n.outerHTML)).to.eql([
            '<div class="div-1">Text</div>',
            '<div class="div-2">Text</div>',
            '<div class="div-3">Text</div>',
          ]);
        });
      });

      describe('loading the same file again', () => {
        let originalFragment;
        beforeEach(() => {
          return promise.then(f => originalFragment = f);
        });

        beforeEach(() => {
          promise = loader.load('./test/fixtures/fragment.html');
        });

        it('does not query the file a second time', () => {
          return promise.then(fragment => {
            expect(fragment).to.be(originalFragment);
          });
        });
      });
    });

    describe('that does not exist', () => {
      beforeEach(() => {
        promise = loader.load('./test/fixtures/missing.html');
      });

      it('returns a promise that will be rejected', () => {
        return promise
          .then(() => { throw new Error('Expected promise to reject'); }, () => {});
      });
    });

    describe('with the attachTo option specified', () => {
      describe('on an existing target', () => {
        beforeEach(() => {
          promise = loader.load('./test/fixtures/fragment.html', {
            attachTo: '#mocha-container',
          });
        });

        it('returns a promise that resolves with the fragment', () => {
          return promise.then((fragment) => {
            const container = document.getElementById('mocha-container');
            const children = asArray(container.children);

            expect(children.length).to.eql(3);
            expect(children.map(n => n.outerHTML)).to.eql([
              '<div class="div-1">Text</div>',
              '<div class="div-2">Text</div>',
              '<div class="div-3">Text</div>',
            ]);
          });
        });
      });

      describe('on a non existing target', () => {
        beforeEach(() => {
          promise = loader.load('./test/fixtures/fragment.html', {
            attachTo: '#foo',
          });
        });

        it('returns a promise that will be rejected', () => {
          return promise
            .then(
              () => { throw new Error('Expected promise to reject'); },
              () => {});
        });
      });
    });
  });

  describe('loading a batch of files', () => {
    let promise;

    describe('that exist', () => {
      beforeEach(() => {
        promise = loader.load([
          './test/fixtures/fragment.html',
          './test/fixtures/fragment2.html',
        ]);
      });

      it('returns a promise that resolves with all the fragments', () => {
        return promise.then((fragments) => {
          const fragmentsChildren = fragments.map(f => asArray(f.children));

          expect(fragmentsChildren.length).to.eql(2);

          expect(fragmentsChildren[0].map(n => n.outerHTML)).to.eql([
            '<div class="div-1">Text</div>',
            '<div class="div-2">Text</div>',
            '<div class="div-3">Text</div>',
          ]);
          expect(fragmentsChildren[1].map(n => n.outerHTML)).to.eql([
            '<div class="div-4">Text</div>',
            '<div class="div-5">Text</div>',
            '<div class="div-6">Text</div>',
          ]);
        });
      });
    });

    describe('with one that does not exist', () => {
      beforeEach(() => {
        promise = loader.load([
          './test/fixtures/fragment.html',
          './test/fixtures/missing.html',
        ]);
      });

      it('returns a promise that will be rejected', () => {
        return promise
          .then(
            () => { throw new Error('Expected promise to reject'); },
            () => {});
      });
    });

    describe('with the attachTo option specified', () => {
      describe('on an existing target', () => {
        beforeEach(() => {
          promise = loader.load([
            './test/fixtures/fragment.html',
            './test/fixtures/fragment2.html',
          ], {
            attachTo: '#mocha-container',
          });
        });

        it('returns a promise that resolves with the fragment', () => {
          return promise.then((fragment) => {
            const container = document.getElementById('mocha-container');
            const children = asArray(container.children);

            expect(children.length).to.eql(6);
          });
        });
      });

      describe('on a non existing target', () => {
        beforeEach(() => {
          promise = loader.load([
            './test/fixtures/fragment.html',
            './test/fixtures/fragment2.html',
          ], {
            attachTo: '#foo',
          });
        });

        it('returns a promise that will be rejected', () => {
          return promise
            .then(
              () => { throw new Error('Expected promise to reject'); },
              () => {});
        });
      });
    });

  });
});
