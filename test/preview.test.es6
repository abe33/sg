'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {waitsFor} from 'widjet-test-utils/async';

const PreviewElement = customElements.get('sg-preview');

describe('PreviewElement', () => {

  it('wraps its content in a svg foreign object when added to the DOM', () => {
    setPageContent(`<sg-preview>
        <div>text</div>
      </sg-preview>`);

    const preview = getTestRoot().querySelector('sg-preview');
    return waitsFor(() => preview.querySelector('svg foreignObject div'));
  });

  it('measures its content and use that as viewbox of the svg element', () => {
    setPageContent(`
      <div>text</div>
      <sg-preview>
        <div>text</div>
      </sg-preview>`);

    return waitsFor(() => getTestRoot().querySelector('sg-preview svg'))
      .then(() => {
        const svg = getTestRoot().querySelector('sg-preview svg');
        const sample = getTestRoot().querySelector('div');
        const sampleBounds = sample.getBoundingClientRect();

        expect(svg.viewBox.baseVal.y).to.eql(0);
        expect(svg.viewBox.baseVal.x).to.eql(0);
        expect(svg.viewBox.baseVal.width).to.eql(sampleBounds.width);
        expect(svg.viewBox.baseVal.height).to.eql(sampleBounds.height);
      });

  });

  it('measures its content and use that as coordinates of the foreign object', () => {
    setPageContent(`
      <div>text</div>
      <sg-preview>
        <div>text</div>
      </sg-preview>`);

    return waitsFor(() => getTestRoot().querySelector('sg-preview svg foreignObject'))
      .then(() => {
        const fo = getTestRoot().querySelector('sg-preview svg foreignObject');
        const sample = getTestRoot().querySelector('div');
        const sampleBounds = sample.getBoundingClientRect();

        expect(fo.getAttribute('y')).to.eql('0');
        expect(fo.getAttribute('x')).to.eql('0');
        expect(fo.getAttribute('width')).to.eql(`${sampleBounds.width}`);
        expect(fo.getAttribute('height')).to.eql(`${sampleBounds.height}`);
      });
  });

  describe('with a margins attribute', () => {
    describe('with one value', () => {
      it('use that value for all axis', () => {
        setPageContent(`
          <div>text</div>
          <sg-preview margins="5">
            <div>text</div>
          </sg-preview>`);

        return waitsFor(() => getTestRoot().querySelector('sg-preview svg foreignObject'))
          .then(() => {
            const svg = getTestRoot().querySelector('sg-preview svg');
            const sample = getTestRoot().querySelector('div');
            const sampleBounds = sample.getBoundingClientRect();

            expect(svg.getAttribute('viewBox'))
              .to.eql(`-5 -5 ${sampleBounds.width + 10} ${sampleBounds.height + 10}`);
          });
      });
    });

    describe('with two values', () => {
      it('use these values for each axis', () => {
        setPageContent(`
          <div>text</div>
          <sg-preview margins="5 10">
            <div>text</div>
          </sg-preview>`);

        return waitsFor(() => getTestRoot().querySelector('sg-preview svg foreignObject'))
          .then(() => {
            const svg = getTestRoot().querySelector('sg-preview svg');
            const sample = getTestRoot().querySelector('div');
            const sampleBounds = sample.getBoundingClientRect();

            expect(svg.getAttribute('viewBox'))
              .to.eql(`-10 -5 ${sampleBounds.width + 20} ${sampleBounds.height + 10}`);
          });
      });
    });

    describe('with three values', () => {
      it('use these values for top, horizontal and bottom margins', () => {
        setPageContent(`
          <div>text</div>
          <sg-preview margins="5 10 10">
            <div>text</div>
          </sg-preview>`);

        return waitsFor(() => getTestRoot().querySelector('sg-preview svg foreignObject'))
          .then(() => {
            const svg = getTestRoot().querySelector('sg-preview svg');
            const sample = getTestRoot().querySelector('div');
            const sampleBounds = sample.getBoundingClientRect();

            expect(svg.getAttribute('viewBox'))
              .to.eql(`-10 -5 ${sampleBounds.width + 20} ${sampleBounds.height + 15}`);
          });
      });
    });

    describe('with four values', () => {
      it('use these values for top, horizontal and bottom margins', () => {
        setPageContent(`
          <div>text</div>
          <sg-preview margins="5 8 10 10">
            <div>text</div>
          </sg-preview>`);

        return waitsFor(() => getTestRoot().querySelector('sg-preview svg foreignObject'))
          .then(() => {
            const svg = getTestRoot().querySelector('sg-preview svg');
            const sample = getTestRoot().querySelector('div');
            const sampleBounds = sample.getBoundingClientRect();

            expect(svg.getAttribute('viewBox'))
              .to.eql(`-10 -5 ${sampleBounds.width + 18} ${sampleBounds.height + 15}`);
          });
      });
    });
  });

  describe('using the constructor', () => {
    let preview;

    beforeEach(() => {
      preview = new PreviewElement({
        margins: [1, 2, 3, 4],
      });
    });

    it('sets the margins attribute', () => {
      expect(preview.getAttribute('margins')).to.eql('1 2 3 4');
    });
  });
});
