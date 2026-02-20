# Logos Morphological Codes Breakdown

This document provides a comprehensive breakdown of the Logos Bible Software Greek morphological scheme, based on the translation logic successfully implemented into the `lib/parsing.ts` parser. It serves as a programmatic reference guide mapping the raw code characters back to their intended linguistic meanings.

## Base Parts of Speech (Character Index 0)
The absolute first character of any morphological tag defines its root Part of Speech (POS), which governs the allowed sequence of characters that follow.

- **`A` or `J`** - Adjective
- **`N`** - Noun
- **`D`** - Definite Article
- **`R`** - Pronoun
- **`V`** - Verb
- **`C`** - Conjunction
- **`B`** - Adverb
- **`T`** - Particle
- **`P`** - Preposition (Isolated Tag)
- **`I`** - Interjection (Isolated Tag)
- **`X`** - Indeclinable

---

## 1. Nouns, Adjectives, and Definite Articles (`N`, `A`, `J`, `D`)
These tags follow a strictly ordered character index parsing `Case`, `Number`, and `Gender`. Adjectives optionally take a `Degree` on the end.

**Structure:** `[POS] + [Case] + [Number] + [Gender] + (Optional: [Degree])`

### Case
- **`N`** : Nominative
- **`G`** : Genitive
- **`D`** : Dative
- **`A`** : Accusative
- **`V`** : Vocative

### Number
- **`S`** : Singular
- **`P`** : Plural
- **`D`** : Dual

### Gender
- **`M`** : Masculine
- **`F`** : Feminine
- **`N`** : Neuter

### Adjective Degree (Only `A` or `J`, Optional 5th character)
- **`C`** : Comparative
- **`S`** : Superlative
- **`O`** : Other

---

## 2. Verbs (`V`)
Verbs are positionally parsed. Note that Participles behave distinctly by mapping a dash `-` in place of the `Person` property, causing `Number`, `Case`, and `Gender` to cascade downstream.

**Structure (Finite Verbs):** `[V] + [Tense] + [Voice] + [Mood] + [Person] + [Number]`
**Structure (Participles):** `[V] + [Tense] + [Voice] + [P] + [-] + [Number] + [Case] + [Gender]`

### Tense (Char 1)
- **`P`** : Present
- **`I`** : Imperfect
- **`F`** : Future
- **`T`** : Future-Perfect
- **`A`** : Aorist
- **`R`** : Perfect
- **`L`** : Pluperfect

### Voice (Char 2)
- **`A`** : Active
- **`M`** : Middle
- **`P`** : Passive
- **`U`** : Middle or Passive

### Mood (Char 3)
- **`I`** : Indicative
- **`M`** : Imperative
- **`S`** : Subjunctive
- **`O`** : Optative
- **`N`** : Infinitive
- **`P`** : Participle

### Person (Char 4, Finite Verbs Only)
*Note: If the verb is a participle, this index will be populated by a `-` dash because participles do not possess a "person".*
- **`1`** : 1st Person
- **`2`** : 2nd Person
- **`3`** : 3rd Person

*(Verbs inherit their mappings for Number, Case, and Gender directly from the standard lists provided under Nouns).*

---

## 3. Pronouns (`R`)
Pronouns branch heavily depending on their Pronoun Type. Their secondary mappings for Person optionally cascade their trailing properties identically to Verbs/Nouns.

**Structure:** `[R] + [Pronoun Type] + (Optional: [Person]) + [Case] + [Number] + [Gender] + (Optional: [Pronoun Sub-type])`

### Pronoun Type (Char 1)
- **`R`** : Relative Pronoun
- **`C`** : Reciprocal Pronoun
- **`D`** : Demonstrative Pronoun
- **`K`** : Correlative Pronoun
- **`I`** : Interrogative Pronoun
- **`X`** : Indefinite Pronoun
- **`F`** : Reflexive Pronoun
- **`S`** : Possessive Pronoun
- **`P`** : Personal Pronoun

### Pronoun Sub-type (Only `RP`, Optional 7th Character)
- **`A`** : intensive Attributive
- **`P`** : intensive Predicative

---

## 4. Conjunctions (`C`)
Conjunctions map to specific tertiary sub-structures.

### Conjunction Type (Char 1)
- **`L`** : Logical
- **`A`** : Adverbial
- **`S`** : Substantival

### Conjunction Sub-type (Char 2)
**Logical Sub-types (`CL`)**
- `A` : Ascensive
- `N` : Connective
- `C` : Contrastive
- `K` : Correlative
- `D` : Disjunctive
- `M` : Emphatic
- `X` : Explanatory
- `I` : Inferential
- `T` : Transitional

**Adverbial Sub-types (`CA`)**
- `Z` : Causal
- `M` : Comparative
- `N` : Concessive
- `C` : Conditional
- `D` : Declarative
- `L` : Local
- `P` : Purpose
- `R` : Result
- `T` : Temporal

**Substantival Sub-types (`CS`)**
- `C` : Content
- `E` : Epexegetical

---

## 5. Adverbs & Particles (`B`, `T`)
Adverbs (`B`) and Particles (`T`) inherently share identical internal tertiary sub-structure logic. 

### Adverb/Particle Sub-type (Char 1)
- **`C`** : Conditional
- **`K`** : Correlative
- **`E`** : Emphatic
- **`X`** : Indefinite
- **`I`** : Interrogative
- **`N`** : Negative
- **`P`** : Place
- **`S`** : Superlative

---

## 6. Indeclinable Words (`X`)
These map unstructured constants globally across the text. 

### Indeclinable Type (Char 1)
- **`L`** : Letter
- **`P`** : Proper Noun
- **`N`** : Numeral
- **`F`** : Foreign Word
- **`O`** : Other
