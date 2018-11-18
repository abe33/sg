
This library relies on [Custom Elements](https://www.caniuse.com/#feat=custom-elementsv1) and [Shadow DOM](https://www.caniuse.com/#feat=shadowdomv1). You can provide polyfills if you need to extend the support to other browsers.

### Items

Items are our smallest building block. In its most simple form it will look like this:

```html
<sg-item>
  <em>Some HTML sample</em>
</sg-item>
```

Just put some HTML in it and that's it. The HTML here will both serve as an example in the guide and as the source for that example.

But in many cases, you probably won't want to use the whole HTML sample for the source, or maybe the example+source are not self-explanatory and you'll have to provide some description for your example. In that case you can consider this way of creating items.

```html
<sg-item>
  Some text that will make a description

  <em>Some HTML sample</em>

  <sg-src>
    <em>text</em>
  </sg-src>
</sg-item>
```

Many things to note here:
- as previously, all element nodes at the root that doesn't use the `sg-*` scheme will be use as a sample.
- all text nodes at the root of an item will be used as a description text for that item
- `sg-src` nodes can be used to specify a source that is different than the one in the example. This is especially useful when your examples need real data that could make the source bloated, such as with lists or typographic styles.
- no need to escape the content of a `sg-src` node as we'll be using the `innerHTML` property of the node.

Finally, here's a much more complex example of an item with metas, many examples, sources and texts:

```html
<sg-item>
  <sg-meta name="title" content="some title"></sg-meta>
  <sg-meta name="tags" content="foo, bar"></sg-meta>

  Some plain text for description

  <sg-sample>
    <em>Some HTML sample</em>
  </sg-sample>

  <sg-src>
    <em>text</em>
  </sg-src>

  <sg-text>Some other text with <strong>formatting<strong></sg-text>

  <sg-sample>
    <b>Some other HTML sample</b>
  </sg-sample>

  <sg-src lang="twig">
    <b>{{ text }}</b>
  </sg-src>

</sg-item>
```

Again, many things to note about that example:
- order of elements will be preserved by the item. That means an item can be structured as a tutorial with examples and sources mixed with explanations.
- if a text section contains HTML formatting it must be place
d inside a `sg-text` node. As the lightweight declaration assumes that text nodes are descriptions and non `sg-*` elements are examples the formatting would end up being used as an example.
- samples can also be defined using a `sg-sample` node. Just as with text, this helps if your example imply mixing text and element nodes.
- `sg-meta` nodes can be used to define whatever additional information you want to provide along an item. These information will be available on a `meta` property on the node itself.
- `sg-src` nodes can take a `lang` attribute. It comes in handy if you want to plug in a code highlighter. Unless specified, all sources are assumed being HTML.

#### Item Properties

Once created an item node will have a bunch of properties that are derived from the its content:

|Property|Type|Description|
|---|---|---|
|`content`|`array<string>`|An array containing all the discovered parts of that item. Note that the parts have been converted into the markup of the corresponding custom element. For instance, a simple empty div node will appear as `<sg-sample><div></div><sg-sample>` in the content list.|
|`samples`|`array<string>`|An array containing the HTML sources of all the samples found in that item.|
|`sources`|`array<string>`|An array containing all the sources found in that item.|
|`texts`|`array<string>`|An array containing all the non-sources, non-samples texts found in that item.|
|`meta`|`object`|An object containing all the meta discovered in that item.|

#### Notes on Custom Elements Lifecycle

You may have noticed that the properties listed above mostly contains HTML strings instead of node references. We're using the custom element lifecycle to produces these strings while removing the original nodes from the DOM.
More precisely, we're are performing all that data gathering operation in the item's constructor function and while all the sub elements constructor can have been invoked, the `connectedCallback` hook hasn't.
That allows to have all these sub elements that serve two purposes:
1. Defining the role a given HTML snippet will have (example, documentation, source, metadata) during the construction phase.
2. Rendering their content while using more complex structure during the connection phase.
