# Webflow MCP call recipes

Every call needs `siteId` and `pageId` at the top level, plus a `context`
string. Ask the user for the site ID if you do not have it. Never guess it.

---

## Discovery

**Pages**

```json
data_pages_tool
{"actions":[{"label":"pages","list_pages":{"site_id":"<siteId>","limit":100}}]}
```

**Component inventory**

```json
data_component_tool
{"siteId":"<siteId>","pageId":"<pageId>",
 "actions":[{"label":"all","get_all_components":{"options":{"includeInstanceCount":true}}}]}
```

**Props and variants, batched**

```json
data_component_tool
{"siteId":"<siteId>","pageId":"<pageId>","actions":[
 {"label":"section","get_component":{"name":"Section","options":{"includeProps":true,"includeVariants":true}}},
 {"label":"grid","get_component":{"name":"Grid","options":{"includeProps":true,"includeVariants":true}}}
]}
```

From the result, build two maps and keep them for the whole session:

- `propName -> propId` per component
- `variantName -> variantId` per component

**Slot names.** The slot prop names in a definition can differ from the slot
names on a real instance. `data_component_builder` needs the instance names.
Read them from a live instance:

```json
data_element_tool
{"siteId":"<siteId>","pageId":"<pageId>","actions":[
 {"label":"probe","query_elements":{"queries":[
   {"label":"section","component_filter":{"component_name":"Section"},"children_depth":2,"limit":1}]}}]}
```

The response lists `slots: [{ name: "Background" }, { name: "Container" }]`.

**Existing page structure**

```json
data_element_tool
{"siteId":"<siteId>","pageId":"<pageId>","actions":[
 {"label":"tree","get_all_elements":{"depth":3}}]}
```

Find `page_main` in the result. It is usually a `DropTarget` with the style
`page_main`. Its `id` object is the parent for new sections.

**Utility classes**

```json
data_style_tool
{"siteId":"<siteId>","pageId":"<pageId>","actions":[
 {"label":"u","query_styles":{"queries":[{"label":"u","name_path":["u-column-span"],"limit":50}]}}]}
```

Query the specific family you need. A bare `["u-"]` query truncates.

---

## Insertion

`data_component_builder` takes component **names** and slot **names**, and
builds nested trees in one action.

**A section with a nested tree**

```json
data_component_builder
{"siteId":"<siteId>","pageId":"<pageId>","context":"...","actions":[{
  "build_label":"hero",
  "action_type":"insert_in_element",
  "parent_element_id":{"component":"<pageId>","element":"<page_main element id>"},
  "creation_position":"append",
  "return_component_info":true,
  "component_schema":{
    "name":"Section",
    "slots":[{
      "name":"Container",
      "children":[{
        "name":"Layout",
        "slots":[
          {"name":"Column 1","children":[
            {"name":"Content Wrapper","slots":[{"name":"Content","children":[
              {"name":"Typography Eyebrow"},
              {"name":"Typography Heading"},
              {"name":"Typography Paragraph"},
              {"name":"Button Wrapper","slots":[{"name":"Content","children":[
                {"name":"Button Main"}]}]}
            ]}]}
          ]},
          {"name":"Column 2","children":[{"name":"Visual Image"}]}
        ]
      }]
    }]
  }
}]}
```

**Adding into an existing slot**

```json
{"build_label":"extra card",
 "action_type":"insert_in_slot",
 "parent_element_id":{"component":"...","element":"<Grid instance element id>"},
 "slot_name":"Content",
 "creation_position":"append",
 "component_schema":{"name":"Card Primary"}}
```

Rules:

- Only component instances go in slots. Raw elements are rejected.
- `before` and `after` behave as `append` when inserting into a slot.
- To insert inside a component **definition** rather than a page, pass
  `scope_component_id`. Avoid this on client sites unless asked; it changes
  every instance.

---

## Setting props

```json
data_component_props_tool
{"siteId":"<siteId>","pageId":"<pageId>","context":"...","actions":[{
  "label":"hero heading",
  "set_component_instance_prop_values":{
    "element_id":{"component":"...","element":"..."},
    "values":[
      {"prop_id":"<Variant prop id>","type":"string","string_value":"<H1 variant id>"},
      {"prop_id":"<Text prop id>","type":"richText","rich_text_inner_text":"The new age of security awareness."},
      {"prop_id":"<Max Width prop id>","type":"number","number_value":16}
    ]}}]}
```

Batch all props for one instance into one action. Batch several instances into
several actions in one call.

**Links.** The prop schema accepts only `url`, `email` and `phone`. Passing
`page` fails validation. There is no element level fallback for a component
instance, so a page reference can only survive by leaving the component's own
default link in place.

```json
{"prop_id":"...","type":"link","link_mode":"url","link_to":"https://example.com","link_open_in_new_tab":true}
{"prop_id":"...","type":"link","link_mode":"url","link_to":"/platform/integrations"}
{"prop_id":"...","type":"link","link_mode":"email","link_to":"hello@example.com","link_email_subject":"Demo"}
```

`data_element_tool > set_link` works only on a real Link, Button or TextLink
element, not on a component instance, so it is not a way round this.

Keep the component default when it already points at the right page, use a site
relative path otherwise, and flag every path in your summary.

**Rate limits.** 429 is common. Batch aggressively, back off around 30s and
lengthen on repeats. Batched calls fail per action, so re-issue only the failed
actions. After a 429 on an insert, read the parent back before retrying, or you
will create a duplicate instance.

**Rich text with a real tag.** Two steps, in this order. A later prop write
wipes the element, so do not touch the prop again afterwards.

```json
data_component_props_tool
{"siteId":"...","pageId":"...","actions":[{"label":"clear",
 "set_component_instance_prop_values":{
   "element_id":{"component":"...","element":"<instance>"},
   "values":[{"prop_id":"<Text>","type":"richText","rich_text_inner_text":""}]}}]}
```

```json
data_element_builder
{"siteId":"...","pageId":"...","context":"...","actions":[{
 "build_label":"h2",
 "parent_element_id":{"component":"...","element":"<instance>","prop":"<Text>"},
 "creation_position":"append",
 "element_schema":{"type":"Heading","set_heading_level":{"heading_level":2},
                   "set_text":{"text":"Section heading"}}}]}
```

Use `"type":"Paragraph"` with no heading level for Typography Paragraph.
`rich_text_inner_text` with HTML in it is escaped, not parsed, so never pass
`<h2>...</h2>`. A bare text node left beside the element cannot be removed with
`remove_element`; clear the prop first instead, which is why the order matters.

Read it back with the prop id in the element id:

```json
data_element_tool
{"siteId":"...","pageId":"...","actions":[{"label":"h",
 "query_elements":{"queries":[{"label":"h",
  "element_id":{"component":"...","element":"<instance>","prop":"<Text>"},
  "children_depth":3}]}}]}
```

**Reading current values**, useful when a value shape is rejected:

```json
data_component_props_tool
{"siteId":"...","pageId":"...","actions":[{
 "label":"read","get_component_instance_props":{"element_id":{"component":"...","element":"..."}}}]}
```

---

## Assets

```json
data_assets_tool            list and search existing assets
asset_tool > upload_image_by_url   { "url": "...", "asset_name": "...", "alt_text": "..." }
```

Set the returned asset id on `Image` props with
`{"type":"string","string_value":"<assetId>"}`.

---

## Verification

```json
data_element_tool
{"siteId":"...","pageId":"...","actions":[{
 "label":"verify","query_elements":{"queries":[
   {"label":"section","element_id":{"component":"...","element":"<section element id>"},"children_depth":6}]}}]}
```

```json
element_snapshot_tool     pass the section element id, returns a PNG
```

`element_snapshot_tool` needs an open Designer session. Without one it returns
`{"status": false}`. Do not retry or work around it; fall back to the structural
read-back and say so in your summary.

When a snapshot is available, check: theme colours applied, spacing between
sections even, grid column counts correct, images at the intended ratio, no
lorem ipsum left, no section inserted twice.

Always check the heading outline as part of verification: read each Typography
Heading's rich text content and confirm it holds one `Heading` element with the
intended tag, one `h1` per page.

---

## Page creation

```json
data_pages_tool
{"actions":[{"label":"new","create_page":{
  "site_id":"...","title":"Pricing","slug":"pricing","draft":true,
  "seo":{"title":"Pricing","description":"..."}}}]}
```

Duplicating a well built page with `duplicateOf` is usually faster than building
a shell, because it brings Global Styles, Nav and Footer with it. Then clear
`page_main` and build your sections.

---

## Things not to call

- `data_element_builder` for anything the component kit covers.
- `data_style_tool > create_style` or `update_style`. Never on a Lumos site.
- `data_component_tool > unlink_component_instance`. It converts an instance
  into loose elements and breaks the system.
- `data_sites_tool > publish_site`. Publishing is the user's decision.
