
This library relies on [Custom Elements](https://www.caniuse.com/#feat=custom-elementsv1) and [Shadow DOM](https://www.caniuse.com/#feat=shadowdomv1). You can provide polyfills if you need to extend the support to other browsers.

### Usage

Just include the script at the bottom of the HTML page. Being placed at the bottom allows all custom elements to be initialized with their content already parsed by the browser. When placed in the head, the custom elements placed in the body will be initialized immediately during parsing and their content won't be available in the constructor.

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
|`content`|`array<HTMLElement>`|An array containing all the discovered parts of that item.|
|`samples`|`array<SampleElement>`|An array containing the sample objects in that item.|
|`sources`|`array<SourceElement>`|An array containing all the sources found in that item.|
|`texts`|`array<TextElement>`|An array containing all the non-sources, non-samples texts found in that item.|
|`meta`|`object`|An object containing all the meta discovered in that item.|


#### Sample Attributes

|Attribute|Description|
|---|---|
|`iframe`|Instead of placing the sample content in the current page, an iframe is created and the content is placed inside it.|
|`template`|The `id` of the template to use for this sample's content'.|
|`iframe-template`|The `id` of the template to use for this sample's iframe content.|

#### Specifying Templates

Every nodes support templates and slots. The default template for a node must have an `id` matching the target node's name (i.e. `sg-item` for the `sg-item` node). Templates must have a slot, otherwise the template will be ignored and a warning will be displayed alongside the content. This is to ensure that the content will always be visible as using a template implies creating a shadow root for that element and in that case not having a slot would mean the content would simply be hidden.

```html
<template id="sg-sample">
  <div class="container">
    <slot></slot>
  </div>
</template>

<template id="sg-sample/iframe">
  <div class="container">
    <slot></slot>
  </div>
</template>

<sg-sample>…</sg-sample>
<sg-sample iframe>…</sg-sample>
```

In the example above, the page contains two `template` that will be used as the default template for a `sg-sample` element. In that case the `sg-sample/iframe` template will be used as the template for the content of the iframe of sample having the `iframe` attribute.

```html
<template id="template-id">
  <div class="container">
    <slot></slot>
  </div>
</template>
<template id="template-id/iframe">
  <div class="container">
    <slot></slot>
  </div>
</template>

<sg-sample template="template-id">…</sg-sample>
<sg-sample iframe iframe-template="template-id/iframe">…</sg-sample>
```

And in the previous example, some custom templates are defined and affected to specific `sg-sample` nodes through their `template` and `iframe-template` attributes.
