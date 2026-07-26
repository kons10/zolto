# Zolto Phase 10 — Interactive Documents & Educational Features

## Syntax Reference

### Form

```zolto
@form contact {

    @text username
        label "Username"
        placeholder "Enter username"
        required

    @email email
        label "Email"
        required

    @password password
        label "Password"
        required

    @textarea message
        label "Message"
        rows 6

    @button primary "Submit"

}
```

Short form:

```zolto
@form contact {
    @text username required
    @email email required
    @button primary "Submit"
}
```

---

### Input Types

| Directive   | HTML `type=` | Notes |
|-------------|-------------|-------|
| `@text`     | text        | General text |
| `@email`    | email       | Email validation |
| `@password` | password    | Masked input |
| `@number`   | number      | min/max/step supported |
| `@search`   | search      | Search field |
| `@date`     | date        | Native date picker |
| `@time`     | time        | Native time picker |
| `@textarea` | —           | Multi-line text |

Input modifiers (on separate lines after the directive):

```zolto
@text username
    label "Username"
    placeholder "Enter username"
    value "Lion"
    required
    help "Must be 3–20 characters"
    error "Username is taken"
    min 3
    max 20
```

---

### Checkbox, Radio, Select

```zolto
@check agree
    label "Accept Terms"

@radio gender {
    @option male "Male"
    @option female "Female"
    @option other "Other"
}

@select country {
    @option in "India"
    @option us "United States"
    @option jp "Japan"
}

@select languages multi {
    @option rust "Rust"
    @option cpp "C++"
    @option python "Python"
}

@select city searchable {
    @option delhi "Delhi"
    @option tokyo "Tokyo"
}
```

---

### Button Variants

```zolto
@button primary "Save"
@button secondary "Cancel"
@button ghost "Back"
@button danger "Delete"
@button outline "Download"
@button icon save
@button primary loading
@button primary disabled
```

---

### Toggle, Switch, Segment

```zolto
@toggle darkmode

@switch notifications

@segment theme {
    @item light
    @item dark
    @item system
}
```

---

### Slider and Progress

```zolto
@slider volume 0..100 step 5

@slider volume {
    min 0
    max 100
    step 5
}

@progress course 75%
```

---

### Quiz

```zolto
@quiz "Physics Quiz" {

    @mcq "What is F = ma?" {
        @correct "Force equals mass × acceleration"
        @choice "Momentum"
        @choice "Energy"
    }

    @multi "Choose languages" {
        @correct "Rust"
        @correct "Python"
        @choice "Stone"
    }

    @truefalse "Earth is round"
    answer true

    @blank "Capital of Japan"
    answer "Tokyo"

    @match {
        India -> Delhi
        Japan -> Tokyo
        France -> Paris
    }

}
```

#### Hints & Explanations

Add hints and explanations inside MCQ blocks:

```zolto
@mcq "What is F = ma?" {
    @correct "Force equals mass × acceleration"
    @choice "Momentum"

    @hint
    Think about Newton's Second Law.
    @end

    @explain
    Force equals mass multiplied by acceleration.
    @end
}
```

#### Timed Quiz

```zolto
@quiz "Speed Round" {
    @timer 15m
    ...
}
```

---

### Flashcards

```zolto
@deck Physics {

    @card
        front "F = ?"
        back "ma"
    @end

    @card
        front "Speed"
        back "Distance / Time"
    @end

}
```

Card metadata:

```zolto
difficulty hard
tags physics,newton
```

---

### Poll

```zolto
@poll "Favorite Language?" {
    Rust
    Python
    C++
    Zig
}

@poll multi "Languages?"
@poll "Anonymous?" {
    Yes
    No
    anonymous
}
```

---

### Checklist / Tasks

```zolto
@tasks {
    [ ] Learn Markdown
    [x] Learn HTML
    [ ] Learn Zolto
}

@tasks {
    [ ] Phase 10
        [ ] Forms
        [ ] Quiz
        [ ] Poll
}
```

---

### Tabs (Interactive)

```zolto
@tabs {

    @tab Theory
        Content for Theory tab.

    @tab Practice
        Content for Practice tab.

    @tab Quiz
        @quiz "Practice Quiz" { ... }

}
```

---

### Accordion

```zolto
@accordion {

    @section "What is Zolto?"
        Zolto is an interactive document language.

    @section "How does it work?"
        It compiles to HTML with semantic markup.

}
```

---

### State and Bindings

```zolto
@state {
    username = ""
    darkmode = false
    score = 0
}

@shared {
    language = "English"
}
```

Bind values to text:

```zolto
@text username

Hello {username}, your score is {score}!
```

---

### Accessibility

All interactive elements automatically receive:

- `aria-label` attributes
- `role` attributes (`radiogroup`, `tab`, `tabpanel`, `switch`, `progressbar`, etc.)
- `tabindex` for keyboard navigation
- Focus ring styles
- `aria-checked` / `aria-selected` / `aria-valuenow` for dynamic state

To override the aria label:

```zolto
@text username
    aria "Enter your display username"
    description "This will be shown on your profile."
```

---

### Reduced Motion

All animations (flashcard flip, button spinner, progress bar transition) respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

### Complete Example

```zolto
@interactive {

@form registration {

    @text username
        label "Username"
        required

    @email email
        label "Email"
        required

    @password password
        label "Password"
        required

    @switch newsletter
        label "Receive Updates"

    @slider experience 0..20 step 1

    @button primary "Register"

}

@quiz "Rust Basics" {

    @mcq "Rust is developed by?" {
        @correct "Mozilla"
        @choice "Google"
        @choice "Microsoft"
    }

}

@deck Basics {

    @card
        front "HTML"
        back "HyperText Markup Language"
    @end

}

@poll "Favorite Language?" {
    Rust
    Python
    C++
}

@tasks {
    [ ] Complete Registration
    [ ] Finish Quiz
    [ ] Review Flashcards
}

}
```

---

## File Input (Preparation)

```zolto
@file resume
    accept pdf,docx
    maxsize 10MB
```

File inputs render as clearly labeled `<input type="file">` elements. Actual upload handling requires a server endpoint.

---

## Dark Mode

All interactive styles support both light and dark modes via CSS `@media (prefers-color-scheme: dark)` and CSS custom properties:

| Variable         | Default (light)    |
|------------------|--------------------|
| `--zl-text`      | `#1a202c`          |
| `--zl-form-bg`   | `#ffffff`          |
| `--zl-input-bg`  | `#f9fafb`          |
| `--zl-border`    | `#e2e8f0`          |
| `--zl-accent`    | `#6366f1`          |
| `--zl-focus-ring`| `#6366f1`          |

Override with a wrapping element:

```css
.my-container {
    --zl-accent: #3b82f6;
    --zl-focus-ring: #3b82f6;
}
```
