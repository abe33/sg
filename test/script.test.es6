'use strict';

import '../src/script';

import sinon from 'sinon';
import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {waitsFor} from 'widjet-test-utils/async';


describe('ScriptElement', () => {
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
          testCallback();
        </sg-script>`);
    });

    it('executes the script as soon as possible', () => {
      expect(window.testCallback.called).to.be.ok();
    });
  });

  describe('when it has a src attribute', () => {
    beforeEach(() => {
      setPageContent('<sg-script src="/test/fixtures/script.es6"></sg-script>');

      const script = getTestRoot().querySelector('sg-script');
      const loadSpy = sinon.spy();
      script.addEventListener('load', loadSpy);

      return waitsFor(() => loadSpy.called);
    });

    it('executes the script as soon as possible', () => {
      expect(window.testCallback.called).to.be.ok();
    });
  });
});
