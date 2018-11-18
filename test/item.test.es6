'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/item';

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
      expect(item.samples).to.eql(['<div class="dummy"></div>']);
      expect(item.sources).to.eql(['<div class="dummy"></div>']);
      expect(item.texts).to.eql([]);
      expect(item.content).to.eql([
        '<sg-sample><div class="dummy"></div></sg-sample>',
        '<sg-src><div class="dummy"></div></sg-src>',
      ]);
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
        expect(item.samples).to.eql([
          '<div class="dummy"></div>',
          '<div></div>',
        ]);
        expect(item.sources).to.eql(['<div class="dummy"></div>']);
        expect(item.texts).to.eql(['Some text content']);
        expect(item.content).to.eql([
          '<sg-text>Some text content</sg-text>',
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-sample>
              <div></div>
            </sg-sample>`,
          '<sg-src><div class="dummy"></div></sg-src>',
        ]);
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
        expect(item.samples).to.eql(['<div class="dummy"></div>']);
        expect(item.sources).to.eql(['<div></div>']);
        expect(item.texts).to.eql(['Some text content']);
        expect(item.content).to.eql([
          '<sg-text>Some text content</sg-text>',
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-src>
              <div></div>
            </sg-src>`,
        ]);
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
      expect(item.samples).to.eql(['<div class="dummy"></div>']);
      expect(item.sources).to.eql(['<div></div>']);
      expect(item.texts).to.eql(['Some text content']);
      expect(item.content).to.eql([
        `<sg-sample>
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text>
            Some text content
          </sg-text>`,
        `<sg-src>
            <div></div>
          </sg-src>`,
      ]);
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

      expect(item.content).to.eql([
        `<sg-sample foo="bar">
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text foo="bar">
            Some text content
          </sg-text>`,
        `<sg-src foo="bar">
            <div></div>
          </sg-src>`,
      ]);
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

    it('puts the discovered content in innerHTML', () => {
      expect(item.querySelector('sg-sample')).not.to.be(null);
      expect(item.querySelector('sg-text')).not.to.be(null);
      expect(item.querySelector('sg-src')).not.to.be(null);
    });
  });
});
