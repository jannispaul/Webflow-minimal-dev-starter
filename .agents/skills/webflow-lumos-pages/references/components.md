# Lumos component reference

Values below are the ones a standard Lumos kit ships with. Individual projects
rename and extend them. Always confirm against
`data_component_tool > get_component` with
`options: { includeProps: true, includeVariants: true }` before you build, and
map every variant **name** to its variant **ID**, because prop values are IDs.

Contents:

1. Shell and structure: Section, Layout, Content Wrapper, Grid, Block, Spacer
2. Typography: Heading, Paragraph, Eyebrow, Plain, Tag
3. Actions: Button Wrapper, Button Main, Button Arrow, Clickable
4. Media: Visual Image, Visual Video, Lottie Element, Icon
5. Composites: Card Primary, Slider
6. Globals: Global Styles, Nav, Footer, Script Tag
7. Prop type cheatsheet

---

## 1. Shell and structure

### Section

The only child of `page_main`. Owns theme and vertical rhythm.

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Inherit, Light, Dark, Brand. Sets the theme for everything inside. |
| Padding Top | variant | Spacer variants: None, Even, Small, Main, Large, Page Top. |
| Padding Bottom | variant | Same set. |
| Rounded Corners | boolean | On by default in kits that use rounded section edges. |
| Visibility | visibility | Hide a section without deleting it. |
| ID | id | Anchor target. Set only when something links to it. |
| Section Classes | string | Utilities on the outer section element. |
| Container Classes | string | Utilities on the inner container. Never a `u-gap-*`: the gap inherits into any Grid inside and overrides its gutter. |
| Style | string | Inline CSS. Last resort. |

Slots (read the real names from a live instance):

- `Background` decorative layer behind the content
- `Container` the content, width constrained

`Page Top` padding exists for the first section on a page when the nav overlaps
it. Using `Main` there leaves the heading under the nav.

### Layout

One editorial arrangement of primary content and one visual.

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | The arrangement, see list below. |
| Visibility | visibility | |
| Classes | string | |
| Column 1 Classes | string | |
| Column 2 Classes | string | |

Slots: `Column 1` primary content, `Column 2` secondary content or visual.

Variants and when to reach for each:

| Variant | Use for |
|---|---|
| Stack | Text stacked above the visual, left aligned |
| Stack Centered | Centred hero or centred section intro |
| Auto Width | Content sized to itself, not to the column |
| Columns | Classic text left, visual right |
| Columns Reversed | Visual left, text right. Alternate down a feature list. |
| Sticky Left | Left column pins while the right column scrolls |
| Breakout / Breakout Reversed | Visual escapes the container on one side |
| Full / Full Reversed | Visual runs to the viewport edge |
| Contain / Contain Reversed | Visual contained with generous padding |
| Card | The pair rendered as one card surface |

Breakout, Full, Contain and Card need a visual in `Column 2`.

### Content Wrapper

The text stack. Carries the vertical spacing between eyebrow, heading,
paragraph and buttons.

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Inherit, Left, Center, Right, Center Mobile |
| Visibility | visibility | |
| Classes | string | |
| Style | string | |

Slot: `Content`.

`Center Mobile` is left aligned on desktop and centred on small screens. Use it
for section intros that look cramped when centred on wide screens.

### Grid

A repeating set of equal items.

| Prop | Type | Notes |
|---|---|---|
| Large Screen | number | Column count on desktop. For Autofit/Autofill it is the maximum. |
| Medium Screen | number | `0` inherits from Large. |
| Small Screen | number | `0` inherits from Medium. |
| Smallest Screen | number | `0` inherits from Small. |
| Variant | variant | Default, Self Contained, Autofit, Autofill |
| Minimum Column Size | number | In ch. Only used by Autofit and Autofill. |
| Role | boolean | Set to List when the grid holds a list of items. |
| Classes | string | |
| Style | string | |

Slot: `Content`.

Common counts: `3 / 1 / 0 / 0` for feature cards, `4 / 2 / 0 / 0` for logos or
stats, `2 / 1 / 0 / 0` for a two-up.

When `Role` is List, set `Role` to List Item on each Card Primary inside, so the
markup is a real `ul` / `li`.

### Block

A neutral wrapper with a slot, used only when a component genuinely needs an
extra grouping level. Prefer Content Wrapper, Layout or Grid first. Props:
Visibility, Classes, Style, Attribute Name, Attribute Value, slot `Slot content`.

### Spacer

Rarely inserted by hand. It backs the Section padding props. Variants: None,
Even, Small, Main, Large, Page Top.

---

## 2. Typography

All typography components share the same idea: the `Variant` sets the **visual
size** on the fluid scale, not the HTML tag.

Shared variant set: Inherit, Text Small, Text Main, Text Large, H6, H5, H4, H3,
H2, H1, Display.

**The `Text` prop does not carry the HTML tag.** These components are Rich Text
blocks; the tag belongs to an element inside the rich text. Writing
`rich_text_inner_text` leaves a bare text node with no `<h1>` or `<p>` around
it. See "give every heading a real tag" in SKILL.md for the two step sequence
that fixes this. It is required on every heading and every paragraph.

### Typography Heading

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Visual size only. H2 is the usual section heading. |
| Text | richText | Clear it, then build a real `Heading` element inside it. |
| Max Width | number | In **ch**. `-1` removes the limit. Default around 20. |
| Visibility | visibility | |
| ID | id | Only when something references it, for example `aria-labelledby`. |

### Typography Paragraph

Same shape. `Text` is richText and needs a real `Paragraph` element inside it.
`Max Width` default around 60ch. Keep body copy between 45ch and 75ch.

### Typography Eyebrow

Small label above a heading. Props: `Text` (richText), Visibility, Classes.
Usually has no variant beyond base.

### Typography Plain

Unstyled text with the full variant set, plus `Classes` and `Style`. Use it when
you need a size from the scale on something that is not a heading or a
paragraph.

### Typography Tag

A pill or tag label. Props: `Text` (textContent), Visibility.

---

## 3. Actions

### Button Wrapper

Holds one or more buttons. Handles the gap and wrapping. Props: Visibility,
Classes, Style. Slot: `Content`.

Always wrap. A bare button inside a Content Wrapper loses the button spacing.

### Button Main

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Primary, Secondary, Tertiary, Link |
| Text | textContent | |
| Link | link | Writable as url / email / phone only. The default is often already a real page reference; keep it when it is right. |
| Button Type | boolean | Set submit inside a form, otherwise link |
| Clickable Visibility | visibility | Hide when the button sits inside a clickable card |
| CMS External Link | link | For CMS items that point off site |
| Visibility | visibility | |

Slot: `Icon`, for an Icon component.

### Button Arrow

Icon-only circular button, used for slider controls and compact links.
Variants pair style and size, for example Primary / Medium, Secondary / Medium,
Tertiary / Medium, Primary / Large, Secondary / Large. A second variant prop
sets the arrow direction. `Text` is the screen reader label, so always set it.

### Clickable

Makes its whole parent clickable. Renders as a link, or as a button when the
url is empty. Carries screen reader text. Variants: Focus Ring Outside, Focus
Ring Inside. Use one per card, and hide nested button links.

---

## 4. Media

### Visual Image

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Aspect ratio: Wide 2/1, Wide 16/9, Wide 3/2, Wide 4/3, Wide 5/4, Square 1/1, Tall 4/5, Tall 3/4, Tall 2/3, Cover |
| Image | image | Asset ID |
| Loading | boolean | eager above the fold, lazy elsewhere |
| Alt Text | altText | `inherit` pulls the asset alt text |
| Visibility | visibility | |
| Style | string | |

`Cover` fills its parent. Use it in a Section `Background` slot or in a card.

### Visual Video

Background or inline video. Props: Variant (same ratio set), Url, Autoplay,
Loop, Muted, Visibility, Style. Autoplay needs Muted.

### Lottie Element

Props: Lottie src, Autoplay, Loop, Visibility, Style. Set an
`aspect-ratio` in Style when the animation must reserve space.

### Icon

Props: Variant (Full, Small, Medium, Large), Visibility, Aria Hidden. Leave
Aria Hidden on for decorative icons. Named icon components such as
`Icon Arrow`, `Icon Chevron Right` and `Icon Checkmark` are separate components;
list them during discovery.

---

## 5. Composites

### Card Primary

Fully prop driven. **No slots.** Do not try to nest children into it.

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Default, Cover, Stacked |
| Heading Text | textContent | |
| Paragraph Text | richText | |
| Link Text | textContent | |
| Link Visibility | visibility | |
| Link Url | link | |
| CMS External Link | link | |
| Image | image | |
| Lottie src | string | Alternative to Image |
| Heading Tag | headingTag | h2 to h6. Follow the page outline. |
| Role | boolean | List Item when inside a Grid with Role List |
| Classes | string | Outer card |
| Content Classes | string | Inner content, this is where a theme override goes |
| Style | string | |

### Slider

| Prop | Type | Notes |
|---|---|---|
| Variant | variant | Overflow Visible, Overflow Hidden, Crop Left |
| Large / Medium / Small / Extra Small Screen | number | Slides per view |
| Controls | visibility | Show or hide the arrows |
| Follow Finger, Free Mode, Mousewheel, Slide To Clicked Slide | boolean | Behaviour |
| Speed | number | ms |
| Classes | string | |

Slot: `Content`. Put Card Primary instances in it, one per slide.

---

## 6. Globals

- **Global Styles** must be the first child of `page_wrap`, once per page. It
  injects the framework CSS. A page without it renders unstyled.
- **Nav** props usually cover position (Default, Overlap) and a transparent
  flag. Set Overlap plus transparent for a hero that runs under the nav, and
  then give the first Section `Page Top` padding.
- **Footer** is normally prop free. Insert as the last child of `page_wrap`.
- **Script Tag** carries page scripts. Leave it alone unless asked.

---

## 7. Prop type cheatsheet

How each prop type is written in
`data_component_props_tool > set_component_instance_prop_values`:

| Prop type | How to set |
|---|---|
| variant | `type: "string"`, `string_value: "<variant id>"`. Never the name. `"base"` selects the base variant. |
| textContent | `type: "string"`, `string_value` |
| string | `type: "string"`, `string_value` |
| richText | `type: "richText"`, `rich_text_inner_text` |
| number | `type: "number"`, `number_value` |
| boolean | `type: "boolean"`, `boolean_value` |
| visibility | `type: "boolean"`, `boolean_value` (true is visible) |
| image | `type: "string"`, `string_value: "<asset id>"` |
| altText | `type: "string"`, `string_value` |
| id | `type: "string"`, `string_value` |
| link | `type: "link"`, plus `link_mode` and `link_to`. Only `url`, `email` and `phone` pass validation; `page` is rejected and there is no element level fallback on a component instance. Keep the component's default when it already targets the right page, otherwise use a site relative path and flag it. |
| headingTag | `type: "string"`, `string_value: "h3"` |
| slot | Not settable as a value. Fill with `data_component_builder > insert_in_slot`. |

If a prop rejects a value, re-read the instance with
`get_component_instance_props` and copy the shape of the value already there.
