'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

describe('PreviewElement', () => {
  it('wraps its content in a svg foreign object when added to the DOM', () => {
    setPageContent(`<sg-preview>
        <div>text</div>
      </sg-preview>`);

    const preview = getTestRoot().querySelector('sg-preview');
    expect(preview.querySelector('svg foreignObject div')).not.to.be(null)
  });

  it('measures its content and use that as viewbox of the svg element', () => {
    setPageContent(`
      <div>text</div>
      <sg-preview>
        <div>text</div>
      </sg-preview>`);

    const svg = getTestRoot().querySelector('sg-preview svg');
    const sample = getTestRoot().querySelector('div');
    const sampleBounds = sample.getBoundingClientRect();

    expect(svg.viewBox.baseVal.y).to.eql(0);
    expect(svg.viewBox.baseVal.x).to.eql(0);
    expect(svg.viewBox.baseVal.width).to.eql(sampleBounds.width);
    expect(svg.viewBox.baseVal.height).to.eql(sampleBounds.height);
  });

  it('measures its content and use that as coordinates of the foreign object', () => {
    setPageContent(`
      <div>text</div>
      <sg-preview>
        <div>text</div>
      </sg-preview>`);

    const fo = getTestRoot().querySelector('sg-preview svg foreignObject');
    const sample = getTestRoot().querySelector('div');
    const sampleBounds = sample.getBoundingClientRect();

    expect(fo.getAttribute('y')).to.eql('0');
    expect(fo.getAttribute('x')).to.eql('0');
    expect(fo.getAttribute('width')).to.eql(`${sampleBounds.width}`);
    expect(fo.getAttribute('height')).to.eql(`${sampleBounds.height}`);
  });
});
