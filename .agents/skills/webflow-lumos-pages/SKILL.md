---
name: webflow-lumos-pages
description: Compose Webflow landing pages from the EXISTING Lumos component kit (Section, Layout, Content Wrapper, Grid, Card Primary, Typography, Buttons, Visual Image, Slider, Nav, Footer) using only their props, variants and slots, with no new classes, elements or styles. Use this skill whenever the user asks to build, add, restructure or restyle a page or a section on a Lumos Webflow site, including "add a hero", "build a features section", "make a pricing page", "add three cards under the heading", any Webflow page work on a site whose components are named Section / Layout / Content Wrapper / Grid / Card Primary, and any page or section request mentioning Lumos or a Webflow component kit. DO NOT use it when the user asks for a custom component, a custom section, a new component, a new variant or prop, a section built from scratch, or anything needing new classes, elements, styles or a changed component definition. That is component authoring, not composition, and belongs to a Lumos class writing workflow.
---

# Building Webflow pages from the Lumos component kit

## What this skill is for

A Lumos project ships a small set of components that already encode the whole
design system. Spacing, theming, typography scale, grid behaviour and
responsiveness all live inside component props and variants. The job is
therefore never "build a layout". The job is "pick the right components and set
the right props".

This matters because every class you invent, every div you add and every inline
style you write is a piece of the design system that now lives outside the
design system. It will not respond to a theme switch, it will not follow the
fluid type scale, and the next person to open the Designer will not find it.
A page built purely from components stays editable by a non-developer forever.

So the hard rule: **compose, never author.**

- Insert component instances. Do not create Webflow elements.
- Set props and variants. Do not create or edit classes.
- Fill `Classes` fields only with utility classes that already exist on the site.
- If the design needs something the kit cannot express, say so and ask. Do not
  patch around it with custom CSS.

## When this skill is the wrong tool

This skill assembles pages from components that already exist. Building a
component is the opposite job: it needs new elements, new classes, new styles,
and a new or edited component definition. The two use different tools and have
opposite rules, so mixing them produces the worst of both, a half componentised
section with bespoke classes hanging off it.

Step away from this skill when the user asks for:

- a custom component, a new component, or a new variant or prop on an existing
  component
- a custom section, or a section "from scratch"
- a layout the kit demonstrably cannot express, once you have actually checked
  the inventory rather than assumed
- any work whose deliverable is classes, styles or markup rather than a page

Say plainly that the request needs component authoring rather than composition,
and hand it to whatever Lumos class and element workflow the user has. If they
have a Lumos framework skill available for writing classes and structure, that
is the one.

This also applies **mid build**. A brief often looks like composition and turns
out to need one piece the kit does not have. When that happens, stop at that
point. Report what you composed, name the piece that is missing and what it
would take to add it to the kit, and let the user decide. Do not quietly invent
a class to close the gap, and do not unlink an instance to edit its internals.
Adding a component to the kit is a design system decision and it is theirs.

The boundary is about the deliverable, not the wording. "Add a custom testimonial
section" where every part already exists in the kit is composition, so build it.
"Add a testimonial section" that needs a card shape the kit has no component for
is authoring, so hand it back.

## Step 1: discover before you build

Component IDs, variant IDs, slot names and the available utility classes differ
between projects and change over time. Never work from memory or from a previous
session. Start every build with discovery, in this order.

This is not a formality. The structural components (Section, Layout, Grid,
Content Wrapper) are fairly stable across Lumos builds, but the more specific a
component is, the more it drifts. `Card Primary` in particular gets extended per
project: an extra variant, a renamed prop, a Lottie field in one build and an
icon slot in another. Anything in this skill's reference files is the shape a
component usually has, not the shape it has here. Read the definition, and if a
prop you expected is missing, work with what the project actually has rather
than forcing the familiar shape.

1. `data_pages_tool > list_pages` to get the target `pageId`. Every element and
   component call needs `siteId` and `pageId`.
2. `data_component_tool > get_all_components` for the inventory.
3. `data_component_tool > get_component` with
   `options: { includeProps: true, includeVariants: true }` for each component
   you intend to use. Batch these into one call.
4. `data_element_tool > query_elements` with a `component_filter` on one
   component you plan to nest into, with `children_depth: 3`. This is the only
   reliable way to read **slot names**. The slot names shown on a live instance
   can differ from the slot prop names in the definition. Trust the instance.
5. `data_element_tool > get_all_elements` with `depth: 3` on an existing page
   that you consider well built. Read it as the house style: which Section
   variants carry which padding, where classes are used, how the shell is
   assembled.

**Prefer the project's own components over a generic recomposition.** The
inventory almost always contains purpose built pieces such as `Stats Item`,
`Quote Card`, `Trust Item`, `Logos Component`, `Accordion Item`, `Section CTA`
or `Section Testimonials`. If one of them matches the brief, use it. It already
carries the right markup, the right semantics and the site's own styling, and it
stays consistent when the kit is updated. Rebuilding a stat block out of Content
Wrapper and Typography when a `Stats Item` exists is the most common way to
produce something that looks right and ages badly. Reach for the generic
patterns only when nothing purpose built fits.

A preset section component with no props is a fixed block. Use it when the copy
it carries is correct, and compose your own section when the copy must change.

Two facts that cause most failed builds:

- **Variant props take variant IDs, not variant names.** Build a name to ID map
  during discovery and use it for every `set_component_instance_prop_values`
  call.
- **Only component instances may go inside a slot.** `data_element_builder` and
  raw elements are not allowed there.

## Step 2: write the plan before you write to Webflow

Produce a short section-by-section plan and show it to the user before the first
write call. One block per section, in this shape:

```
Section 2 "Why it matters"  Variant: Dark  PadTop: Main  PadBottom: Main
  Container
    Content Wrapper (Center)
      Typography Eyebrow  "Why revel8"
      Typography Heading (H2)  "Frontline compliance training is complex"
    Grid (Large 3, Medium 1)  Role: List
      Card Primary x3  Heading / Paragraph / Icon
```

Planning first is worth the extra minute because component insertion is a write
against the user's live site, and a wrong nesting order is more work to unpick
than to avoid.

## Step 3: the composition grammar

The page shell already exists on every page. Do not rebuild it.

```
Body
└ page_wrap
  ├ Global Styles      (once per page, first child)
  ├ Script Tag
  ├ Nav
  ├ page_main          ← your sections go here
  │ └ Section
  │ └ Section
  └ Footer
```

Inside `page_main`, the nesting is always the same four levels.

**Section** is the only child of `page_main`. It owns the vertical rhythm and
the colour theme of everything below it.

- `Variant` sets the theme: Inherit, Light, Dark, Brand. Children set to
  Inherit follow it. This is how a whole section flips colour with one prop.
- `Padding Top` and `Padding Bottom` take Spacer variants: None, Even, Small,
  Main, Large, Page Top. Use `Page Top` for the first section under an
  overlapping nav. Use `Main` as the default rhythm.
- Slot `Background` holds decorative visuals only, such as a Visual Image or a
  gradient block. It sits behind the content.
- Slot `Container` holds the real content and applies the site container width.
- `ID` gives the section an anchor target. Set it **only** when something on the
  page actually links to it: a nav item, an in-page button, a table of contents.
  An ID on every section is noise that the next editor has to read past.

**Layout** or **Grid** is the child of `Container`. Pick by intent, not by looks.

- Use **Layout** for one editorial arrangement of primary content plus one
  visual. Its variant is the arrangement: Stack, Stack Centered, Auto Width,
  Columns, Columns Reversed, Sticky Left, Breakout, Breakout Reversed, Full,
  Full Reversed, Contain, Contain Reversed, Card. Slot `Column 1` takes the
  text. Slot `Column 2` takes the visual. The Breakout, Full, Contain and Card
  variants need a visual in `Column 2` to render correctly.
- Use **Grid** for a repeating set of equal items. Set the column count per
  breakpoint with `Large Screen`, `Medium Screen`, `Small Screen`,
  `Smallest Screen`. **`0` means inherit from the next larger screen**, so
  `3 / 1 / 0 / 0` reads as three across on desktop, one from tablet down. Set
  `Role` to List when the grid holds a list of items, and set `Role` to List
  Item on each Card inside it. Variants: Default, Self Contained, Autofit,
  Autofill. Autofit and Autofill use `Minimum Column Size` (in ch) and treat
  `Large Screen` as a maximum.

**Content Wrapper** is the text stack. It goes inside a Layout column, a Grid
cell, or directly in `Container`. Its variant is the text alignment: Inherit,
Left, Center, Right, Center Mobile. Its single slot holds the eyebrow, heading,
paragraph and button wrapper in order.

Content Wrapper is required directly under `Container` and inside a Grid cell,
because neither of those carries the vertical spacing between text parts.
Inside a **Layout column** it is optional: the column already supplies the stack
gap, so putting Typography straight into `Column 1` is correct and is what the
kit's own page templates do. Add a Content Wrapper there only when you need its
alignment variant, for example a centred stack inside a left aligned layout.

**Leaf components** go inside Content Wrapper, Grid or Layout columns:
Typography Heading, Typography Paragraph, Typography Eyebrow, Typography Plain,
Typography Tag, Button Wrapper, Visual Image, Visual Video, Card Primary,
Slider, Lottie Element, Icon.

Full prop and variant tables: `references/components.md`.
Ready-made section recipes: `references/patterns.md`.
Exact MCP call shapes: `references/mcp-recipes.md`.

## Step 4: build top down

Insert with `data_component_builder`. It takes component **names** and slot
**names**, and it can build a nested tree in a single action through
`component_schema.slots[].children[]`. Build one section per action so a failure
is easy to locate.

```
action_type: insert_in_element     → into page_main or any element
action_type: insert_in_slot        → into a named slot of an instance
```

Set `return_component_info: true` so you get the new element IDs back. Copy
element `id` objects verbatim; they are `{ component, element }` pairs, not
strings.

Then set props with
`data_component_props_tool > set_component_instance_prop_values`. Batch every
prop for one instance into a single call.

Order matters. Insert the whole tree first, then set props. Setting props on a
parent does not disturb children, but re-inserting does.

### Two failures you will hit

**Rate limits.** The Webflow API returns 429 readily, and a page build is dozens
of writes. Plan for it rather than fighting it.

- Put as much as possible into each call. One builder action per section, one
  prop action per instance, several actions per call.
- On a 429, wait and re-issue. Start around 30 seconds and lengthen if it
  repeats.
- A batched call fails **per action**, not as a whole. Re-issue only the actions
  that failed. Re-sending the whole batch creates duplicate instances, which is
  the worst outcome because it looks fine in the response and wrong on the page.
- After any 429 during an insert, read the parent back before retrying, so you
  know whether the insert landed.

**Page links cannot be set through props.** The schema for a link prop accepts
only `url`, `email` and `phone`. `page` is rejected outright. And
`data_element_tool > set_link` does not rescue it, because the thing you are
holding is a component instance, not a Link element; the Link lives inside the
component definition and editing it there would change every instance on the
site. So:

1. If the component's **default** link already points at the right page, leave
   the prop untouched. That default is a real page reference and it survives a
   slug rename. Overwriting it with a path is a downgrade.
2. Otherwise set a site relative path, `link_mode: "url"` with
   `link_to: "/contact"`. It resolves correctly today.
3. Say in your summary which links are paths rather than page references, so the
   user knows those are the ones to fix if a slug changes.

Never leave a button on a default `#` link without saying so.

## Step 5: give every heading a real tag

This is the step that is easiest to skip and most damaging to skip.

The Typography components are **Rich Text** blocks. The semantic tag lives in
the rich text content, not on the component. Writing
`rich_text_inner_text: "My heading"` puts a bare text node inside the rich text.
It looks perfect on the canvas and in every read-back of the props, and it
publishes with no `<h1>` anywhere: just styled text in a div. The page then has
no document outline, which costs it screen reader navigation and search ranking,
and nobody notices until an audit.

Passing HTML does not help. `rich_text_inner_text: "<h1>Text</h1>"` is escaped
and renders the angle brackets on the page.

The working sequence, per heading:

1. Clear the rich text prop:
   `{"prop_id": "<Text>", "type": "richText", "rich_text_inner_text": ""}`.
   This removes the component's default copy and any bare text node.
2. Create the real element inside the prop with `data_element_builder`, passing
   the prop id in the parent id:

```json
{"build_label":"h2",
 "parent_element_id":{"component":"<pageId>","element":"<instance element id>",
                      "prop":"<Text prop id>"},
 "creation_position":"append",
 "element_schema":{"type":"Heading",
                   "set_heading_level":{"heading_level":2},
                   "set_text":{"text":"Frontline compliance training is complex"}}}
```

3. Do not write the rich text prop again afterwards. A prop write replaces the
   whole content and deletes the element you just made.

Typography Paragraph works the same way with `type: "Paragraph"` and no heading
level. Typography Eyebrow is a label, so a bare text node is fine there.

Verify by reading the prop content back, which needs the prop id in the element
id:

```json
{"label":"h","query_elements":{"queries":[{"label":"h",
 "element_id":{"component":"...","element":"...","prop":"<Text prop id>"},
 "children_depth":3}]}}
```

You want to see one `Heading` with the tag you intended, and no loose `String`
sibling next to it.

### Choosing the level

The `Variant` is the visual size. The tag is the outline position. They are set
separately and they do not have to match.

- One `h1` per page, on the first heading, normally the hero.
- Section headings are `h2`.
- Headings inside cards, feature rows and other repeated items are `h3`.
- Never skip a level to get a size. Pick the tag from the outline, then pick the
  variant for how big it should look.

Card Primary exposes `Heading Tag` as a plain prop, so set it there directly.

## Step 6: measure and theme

- The Typography `Variant` sets the **visual size** (Display, H1 to H6, Text
  Large, Text Main, Text Small).
- `Max Width` on Typography is measured in **ch**, not pixels. `-1` removes it.
  Defaults are around 20ch for headings and 60ch for paragraphs. Change this
  number to control line length instead of adding a width class.
- Set the theme once, on the Section. Override lower down only for deliberate
  contrast, such as a dark card inside a light section. Do that with the
  child's own theme utility on its `Content Classes` or `Classes` prop, for
  example `u-theme-dark u-background-3`.

## Step 7: buttons and clickable cards

- Wrap buttons in **Button Wrapper**. It handles the gap and the wrapping
  behaviour. One or more Button Main or Button Arrow go in its `Content` slot.
- Button Main variants: Primary, Secondary, Tertiary, Link.
- Set `Button Type` to submit only inside a form.
- When a button sits inside a card that is already fully clickable, set the
  button's `Clickable Visibility` to hidden. Two nested links is invalid HTML
  and breaks keyboard navigation.
- **Card Primary has no slots.** Everything is a prop: Heading Text, Paragraph
  Text, Link Text, Link Url, Image, Lottie src, Heading Tag, Role, Classes,
  Content Classes. Do not try to insert children into it.

## Step 8: images and media

- **Visual Image** variant is the aspect ratio: Wide 2/1, Wide 16/9, Wide 3/2,
  Wide 4/3, Wide 5/4, Square 1/1, Tall 4/5, Tall 3/4, Tall 2/3, Cover.
- Set `Loading` to eager for any image above the fold. Everything else stays
  lazy.
- `Alt Text` defaults to `inherit`, which pulls the asset's own alt text. Set it
  explicitly when the image carries meaning in this context.
- Find asset IDs with `data_assets_tool`. Upload from a URL with
  `asset_tool > upload_image_by_url`. Never leave a placeholder image in a
  delivered section without telling the user.

## Step 9: use the Classes field correctly

The `Classes` and `Content Classes` props accept a space separated list of
existing class names. They exist so you can reach the utility layer without
leaving the component. They are not a place to invent names.

Before using any class, confirm it exists:
`data_style_tool > query_styles` with `name_path: ["u-column-span"]` or similar.

### Do not put a gap utility on a Section

`u-gap-*` on the Section `Container Classes` is the single most common way to
break a section's spacing. The section container already has a default gap, and
the value **inherits down into any Grid inside it**. A Grid that would otherwise
sit at the gutter suddenly sits at whatever you put on the section, and the
whole row reads wrong.

So leave the section gap alone. If a section genuinely needs a different gap,
set it on the section **and** set the gap explicitly on every Grid inside it,
normally `u-gap-gutter`, so the grid keeps the gutter rhythm.

The same caution applies to any inherited property you put on a container:
check what it does to the children before you use it.

Utility families that a Lumos site normally carries:
`u-theme-*`, `u-background-*`, `u-color-*`, `u-text-style-*`, `u-weight-*`,
`u-text-align-*`, `u-text-wrap-balance`, `u-column-span-*`, `u-column-start-*`,
`u-row-span-*`, `u-grid-*`, `u-align-self-*`, `u-align-items-*`,
`u-justify-content-*`, `u-gap-*`, `u-padding-*`, `u-margin-*`, `u-radius-*`,
`u-ratio-*`, `u-overflow-*`, `u-width-*`, `u-sr-only`, `u-line-clamp-*`.

The `Style` prop takes raw inline CSS. Use it only for a genuine one-off that
the kit has no token for, such as a section min-height or a blend mode. Keep it
to a single declaration where possible, and mention it in your summary so the
user can decide whether it should become a proper style.

## Step 10: verify

Do not report done from the insert responses alone. A 429 in the middle of a
batch can leave a half built section that the response does not reveal.

1. `data_element_tool > query_elements` on each new Section with
   `children_depth: 6`. Read back the tree. Confirm the nesting, the variant
   IDs, the copy, and that nothing was inserted twice.
2. `element_snapshot_tool` for a visual check. It needs an open Designer
   session, and returns `{"status": false}` when there is none. That is not an
   error to work around. Fall back to the structural read-back and say in your
   summary that the check was structural, not visual.
3. Report what you built as a short tree, name every prop you had to guess, and
   list every placeholder you left behind: unset images, invented copy,
   relative links, default targets.

Never publish. Publishing is the user's decision.

## Things that are out of scope

See "When this skill is the wrong tool" above. The short version, as a checklist
to run against a brief before you start and again whenever a build stalls:

- a component that does not exist in the project
- a new class, a new style, or a change to a component definition
- a new variant or prop on an existing component
- unlinking an instance to edit its internals
- custom code, interactions or animations

Offer the closest composition the kit allows, describe what would have to be
added to the kit to do it properly, and stop there.
