# Landing page section patterns

**Check the inventory first.** If the project ships a purpose built component
for what you are about to assemble (`Stats Item`, `Quote Card`, `Trust Item`,
`Logos Component`, `Accordion Item (FAQ)`, `Section CTA`, `Section
Testimonials`), use it instead of the generic recipe below. These patterns are
the fallback for when nothing purpose built fits.

Each pattern is a component tree plus the props that make it work. Adapt the
copy, the counts and the theme. Do not add elements or classes to make one fit.
If a brief needs a shape that is not here, build it from the same grammar:
Section > Container > (Layout or Grid) > Content Wrapper > leaves.

Indentation below means "child of". Slot names are shown in `backticks`.

`H1` / `H2` / `H3` below name **both** the visual variant and the semantic tag,
which are set separately. The variant is a prop; the tag needs a real element
built inside the rich text, per SKILL.md step 5. Section IDs are shown only
where a pattern needs an anchor; do not add IDs a page does not link to. And no
pattern sets a gap utility on a Section container.

---

## Page skeleton

Only build this on a genuinely new page. On an existing page, add sections to
`page_main` and leave the shell alone.

```
page_wrap
  Global Styles
  Nav                      Position: Overlap, Transparent: true (only for a hero that runs under the nav)
  page_main
    ... sections ...
  Footer
```

---

## 1. Hero, text left, visual right

```
Section                    Variant: Dark    PadTop: Page Top   PadBottom: Large
  `Container`
    Layout                 Variant: Columns
      `Column 1`
        Content Wrapper    Variant: Left
          `Content`
            Typography Eyebrow      Text: short label
            Typography Heading      Variant: H1   Max Width: 16
            Typography Paragraph    Max Width: 55
            Button Wrapper
              `Content`
                Button Main   Variant: Primary     Text: primary action
                Button Main   Variant: Secondary   Text: secondary action
      `Column 2`
        Visual Image       Variant: Wide 5/4   Loading: eager
```

Notes. The hero image is the largest contentful paint, so `Loading` must be
eager. `Page Top` padding clears an overlapping nav. Drop the eyebrow when the
headline is already short. The Content Wrapper inside `Column 1` is optional
here, because the Layout column already carries the stack gap; keep it when you
want its alignment variant, drop it when Left alignment is already inherited.

## 2. Hero, centred

```
Section                    Variant: Brand   PadTop: Page Top   PadBottom: Main
  `Background`
    Visual Image           Variant: Cover
  `Container`
    Content Wrapper        Variant: Center
      `Content`
        Typography Heading    Variant: Display   Max Width: 18
        Typography Paragraph  Max Width: 60
        Button Wrapper
          `Content`
            Button Main       Variant: Primary
```

The background visual goes in the Section `Background` slot, never in the
Container. That is what keeps it behind the content without a z-index.

## 3. Section intro plus card grid

The most common landing page section.

```
Section                    Variant: Light   PadTop: Main   PadBottom: Main
  `Container`
    Content Wrapper        Variant: Center
      `Content`
        Typography Eyebrow
        Typography Heading    Variant: H2   Max Width: 24
        Typography Paragraph  Max Width: 60
    Grid                   Large: 3  Medium: 1  Small: 0  Smallest: 0   Role: List
      `Content`
        Card Primary       Role: List Item   Heading Tag: h3
        Card Primary       Role: List Item   Heading Tag: h3
        Card Primary       Role: List Item   Heading Tag: h3
```

Content Wrapper and Grid are siblings inside `Container`. Do not nest the Grid
inside the Content Wrapper; the Content Wrapper spacing is for text only.

Four cards: `4 / 2 / 0 / 0`. Two cards: `2 / 1 / 0 / 0`.

## 4. Alternating feature rows

Repeat the Section, flipping the Layout variant each time.

```
Section                    Variant: Inherit   PadTop: Main   PadBottom: Main
  `Container`
    Layout                 Variant: Columns
      `Column 1`
        Content Wrapper    Variant: Left
          `Content`
            Typography Eyebrow
            Typography Heading     Variant: H3
            Typography Paragraph
            Button Wrapper
              `Content`
                Button Main   Variant: Tertiary
      `Column 2`
        Visual Image       Variant: Wide 3/2

Section                    (next one)
    Layout                 Variant: Columns Reversed
```

Keep the heading level consistent across the rows. They are siblings in the
outline, so they are all H3 if the section above them is H2.

## 5. Logo strip

```
Section                    Variant: Inherit   PadTop: Small   PadBottom: Small
  `Container`
    Content Wrapper        Variant: Center
      `Content`
        Typography Plain   Variant: Text Small   Text: "Trusted by ..."
    Grid                   Large: 5  Medium: 3  Small: 2  Smallest: 0   Role: List
      `Content`
        Visual Image x5    Variant: Wide 3/2
```

If the project has a dedicated Logos component, use it instead. Discovery will
show it.

## 6. Stats row

```
Section                    Variant: Brand   PadTop: Main   PadBottom: Main
  `Container`
    Grid                   Large: 4  Medium: 2  Small: 0  Smallest: 0
      `Content`
        Stats Item x4      (if the project has one, this is the right component)
```

If there is no `Stats Item`, fall back to a Content Wrapper per cell:

```
        Content Wrapper    Variant: Center
          `Content`
            Typography Heading     Variant: H2    Text: "98%"     Max Width: -1
            Typography Plain       Variant: Text Small   Text: label
```

Set the Grid `Role` to List only when the cells render as list items. A
`Stats Item` whose root is a div will produce invalid markup inside a `ul`.

`Max Width: -1` on the number removes the measure limit so a short value does
not wrap oddly.

## 7. Testimonial or card slider

```
Section                    Variant: Light   PadTop: Main   PadBottom: Main
  `Container`
    Content Wrapper        Variant: Left
      `Content`
        Typography Heading    Variant: H2
    Slider                 Variant: Overflow Visible   Large: 3  Medium: 2  Small: 1  Extra Small: 1   Controls: visible
      `Content`
        Quote Card x N     (or Card Primary, if the project has no quote component)
```

`Overflow Visible` lets the next slide peek in, which signals that the row
scrolls. Use `Overflow Hidden` when the section has a background edge.

## 8. Split section with sticky text

```
Section                    Variant: Inherit   PadTop: Large   PadBottom: Large
  `Container`
    Layout                 Variant: Sticky Left
      `Column 1`
        Content Wrapper    Variant: Left
          `Content`
            Typography Heading    Variant: H2
            Typography Paragraph
      `Column 2`
        Content Wrapper
          `Content`
            (a stack of Cards, images or paragraphs that scrolls past the pinned left)
```

## 9. Full bleed visual feature

```
Section                    Variant: Dark   PadTop: None   PadBottom: None
  `Container`
    Layout                 Variant: Full
      `Column 1`
        Content Wrapper    Variant: Left
          `Content`
            Typography Heading     Variant: H2
            Typography Paragraph
            Button Wrapper
              `Content`
                Button Main
      `Column 2`
        Visual Image       Variant: Cover
```

`Full` needs a visual in `Column 2`. Padding None on both sides lets the visual
meet the section edge.

## 10. Closing CTA

```
Section                    Variant: Brand   PadTop: Large   PadBottom: Large
  `Container`
    Content Wrapper        Variant: Center
      `Content`
        Typography Heading    Variant: H2   Max Width: 20
        Typography Paragraph  Max Width: 55
        Button Wrapper
          `Content`
            Button Main       Variant: Primary
```

Many projects already ship a `Section CTA` component. Check discovery first and
reuse it rather than rebuilding this.

---

## Rhythm and theme across a page

- Alternate Section themes to give the page structure. A long run of Inherit
  sections reads flat. A theme change every second or third section reads as
  chapters.
- Keep `Padding Top` and `Padding Bottom` at `Main` as the default. Use `Large`
  around the hero and the closing CTA. Use `None` where two sections are meant
  to touch.
- One H1 per page, in the hero. Section headings are H2. Card headings are H3.
- Put an `ID` on every section that the nav or an in-page link targets.
