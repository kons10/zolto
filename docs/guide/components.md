# Zolto Phase 9 — Component, Template & Macro System Guide

Zolto Phase 9 introduces a lightweight, zero-dependency reusable abstraction system. Authors can build design systems, reusable document layouts, custom components, templates, macros, typed props, slots, slot forwarding, conditionals, loops, and component registries while keeping 100% backward compatibility with Phases 1–8 (Markdown, Math, Diagrams, Charts, Vector Graphics, and Spatial Layouts).

---

## 1. Custom Components

Define custom components with props and slots.

```zolto
component Card(
    title!,
    subtitle="",
    variant="default"
)

card variant=variant

### {title}

{subtitle}

slot

end

end
```

### Instantiation

```zolto
Card(
    title="Welcome",
    subtitle="Hello world",
    variant="primary"
)

This is the body text.

end
```

---

## 2. Slots & Slot Forwarding

Support default slots, named slots, and fallback contents:

```zolto
component Panel(title="")

slot header

### {title}

end

slot

No content provided.

end

slot footer

Footer text

end

end
```

### Filling Slots

```zolto
Panel(title="Dashboard Users")

fill header

# Active Users List

end

Alice
Bob
Charlie

fill footer

Last synced today.

end

end
```

---

## 3. Typed Props & Validation

Zolto supports typed prop declarations, required flags (`!`), enum validation, defaults, and context interpolation:

```zolto
component UserBadge(
    name! : string,
    count : number=0,
    online : bool=false,
    tone : enum(info, warning, success, error)=info
)
```

---

## 4. Templates & Inheritance

Templates allow defining complete document structures with inheritance (`extends`):

```zolto
template Dashboard()

slot header
end

slot body
end

end

template SalesDashboard extends Dashboard

fill header
# Sales Overview
end

fill body
Monthly Revenue: $100,000
end

end
```

---

## 5. Macros

Macros provide fast, parameterized text and block transformations with built-in recursion depth protection (max depth 20):

```zolto
macro note(text)

info

{text}

end

end
```

```zolto
note("This is an important system notification.")
```

---

## 6. Conditionals

Conditional blocks evaluate conditions cleanly without arbitrary code execution:

```zolto
if featured

Badge(label="Featured Item")

elseif score>=80

Badge(label="High Score")

else

Badge(label="Standard")

end
```

---

## 7. Loops

Loops iterate over arrays or lists with indexing support:

```zolto
each users as user,idx

User #{idx}: {user.name}

end
```

---

## 8. Built-in Patterns

Zolto provides 12 built-in reusable component patterns:
- `Card`
- `StatCard`
- `FeatureCard`
- `AlertBox`
- `HeroSection`
- `SectionHeader`
- `EmptyState`
- `InfoPanel`
- `ComparePanel`
- `CallToAction`
- `ProfileCard`
- `DashboardTile`

Example:

```zolto
StatCard(
    title="Total Revenue",
    value="$100,000",
    change="+12%",
    trend="positive"
)
```
