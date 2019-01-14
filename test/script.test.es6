'use strict';

import '../src/script';

import sinon from 'sinon';
import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

describe('ScriptElement', () => {
  describe('when content is defined in the page', () => {
    beforeEach(() => {
      window.testCallback = sinon.spy();

      setPageContent(`
        <sg-script>
          testCallback();
        </sg-script>`);
    });

    it('executes the script as soon as possible', () => {
      expect(testCallback.called).to.be.ok();
    });
  });
});
