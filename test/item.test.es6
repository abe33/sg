'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/item';

const asSource = a => a.map(e => e.outerHTML);

describe('ItemElement', () => {
  let item;
  describe('with plain html content', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <div class="dummy"></div>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('stores its content as both sample and source', () => {
      expect(asSource(item.samples))
      .to.eql(['<sg-sample><div class="dummy"></div></sg-sample>']);

      expect(asSource(item.sources))
      .to.eql(['<sg-src lang="html"><div class="dummy"></div></sg-src>']);

      expect(item.texts).to.eql([]);

      expect(item.innerHTML).to.eql([
        '<sg-sample><div class="dummy"></div></sg-sample>',
        '<sg-src lang="html"><div class="dummy"></div></sg-src>',
      ].join(''));
    });
  });

  describe('with mixed html content', () => {
    describe('with no source node but text and many samples', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-item>
            Some text content

            <div class="dummy"></div>

            <sg-sample>
              <div></div>
            </sg-sample>
          </sg-item>
          `);

        item = getTestRoot().querySelector('sg-item');
      });

      it('uses the first sample as source', () => {
        expect(asSource(item.samples)).to.eql([
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-sample>
              <div></div>
            </sg-sample>`,
        ]);
        expect(asSource(item.sources)).to.eql([
          '<sg-src lang="html"><div class="dummy"></div></sg-src>',
        ]);

        expect(asSource(item.texts)).to.eql([
          '<sg-text>Some text content</sg-text>']);

        expect(item.innerHTML).to.eql([
          '<sg-text>Some text content</sg-text>',
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-sample>
              <div></div>
            </sg-sample>`,
          '<sg-src lang="html"><div class="dummy"></div></sg-src>',
        ].join(''));
      });
    });

    describe('with a source node', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-item>
            Some text content

            <div class="dummy"></div>

            <sg-src>
              <div></div>
            </sg-src>
          </sg-item>
          `);

        item = getTestRoot().querySelector('sg-item');
      });

      it('stores its content as both sample and source', () => {
        expect(asSource(item.samples)).to.eql(['<sg-sample><div class="dummy"></div></sg-sample>']);
        expect(asSource(item.sources)).to.eql([`<sg-src>
              <div></div>
            </sg-src>`]);
        expect(asSource(item.texts)).to.eql(['<sg-text>Some text content</sg-text>']);
        expect(item.innerHTML).to.eql([
          '<sg-text>Some text content</sg-text>',
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-src>
              <div></div>
            </sg-src>`,
        ].join(''));
      });
    });
  });

  describe('with only custom elements containers', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <sg-sample>
            <div class="dummy"></div>
          </sg-sample>

          <sg-text>
            Some text content
          </sg-text>

          <sg-src>
            <div></div>
          </sg-src>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('stores its content as both sample and source', () => {
      expect(asSource(item.samples)).to.eql([`<sg-sample>
            <div class="dummy"></div>
          </sg-sample>`]);
      expect(asSource(item.sources)).to.eql([`<sg-src>
            <div></div>
          </sg-src>`]);
      expect(asSource(item.texts)).to.eql([`<sg-text>
            Some text content
          </sg-text>`]);
      expect(item.innerHTML).to.eql([
        `<sg-sample>
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text>
            Some text content
          </sg-text>`,
        `<sg-src>
            <div></div>
          </sg-src>`,
      ].join(''));
    });

    it('preserves all attributes on the custom elements', () => {
      setPageContent(`
        <sg-item>
          <sg-sample foo="bar">
            <div class="dummy"></div>
          </sg-sample>

          <sg-text foo="bar">
            Some text content
          </sg-text>

          <sg-src foo="bar">
            <div></div>
          </sg-src>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');

      expect(item.innerHTML).to.eql([
        `<sg-sample foo="bar">
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text foo="bar">
            Some text content
          </sg-text>`,
        `<sg-src foo="bar">
            <div></div>
          </sg-src>`,
      ].join(''));
    });
  });

  describe('with meta properties', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <sg-meta name="foo" content="bar"></sg-meta>
          <sg-meta name="bar" content="foo"></sg-meta>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('fills the meta property of the node with the data from the meta', () => {
      expect(item.meta).to.eql({
        foo: 'bar',
        bar: 'foo',
      });
    });
  });

  describe('once connected to the DOM', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          Some text content

          <div class="dummy"></div>

          <sg-src>
            <div></div>
          </sg-src>
        </sg-item>
        `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('does not alter the declared content', () => {
      expect(item.querySelector('sg-sample')).not.to.be(null);
      expect(item.querySelector('sg-text')).not.to.be(null);
      expect(item.querySelector('sg-src')).not.to.be(null);
    });
  });
});
