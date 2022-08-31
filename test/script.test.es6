'use strict';
import sinon from 'sinon';
import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {waitsFor} from 'widjet-test-utils/async';

import '../src/script';

describe('ScriptElement', () => {
  let script;

  beforeEach(() => {
    window.testCallback = sinon.spy();
  });
  afterEach(() => {
    delete window.testCallback;
  });

  describe('when its content is defined in the page', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-script>
          testCallback(currentScript);
        </sg-script>`);

      script = getTestRoot().querySelector('sg-script');
    });

    it('executes the script as soon as possible', () => {
      expect(window.testCallback.calledWith(script)).to.be.ok();
    });
  });

  describe('when it has a src attribute', () => {
    beforeEach(() => {
      setPageContent('<sg-script src="/test/fixtures/script.es6"></sg-script>');

      script = getTestRoot().querySelector('sg-script');
      const loadSpy = sinon.spy();
      script.addEventListener('load', loadSpy);

      return waitsFor(() => loadSpy.called);
    });

    it('executes the script as soon as possible', () => {
      expect(window.testCallback.calledWith(script)).to.be.ok();
    });
  });

  describe('inside a shadow DOM', () => {
    let div, root;

    beforeEach(() => {
      setPageContent('<div></div>');
      div = getTestRoot().querySelector('div');
      root = div.attachShadow({mode: 'open'});
      root.innerHTML = `
        <sg-script>
          testCallback(currentScript, currentRoot, currentHost);
        </sg-script>`;
      script = root.querySelector('sg-script');
    });

    it('executes the script while providing proper context inside shadow DOM', () => {
      expect(window.testCallback.calledWith(script, root, div)).to.be.ok();
    });
  });
});
