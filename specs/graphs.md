# Graphs

## Simple Example

### Graph

- $ c = a + b $
- $ d = b + 1 $
- $ e = c*d = (a+b)*(b+1) $

```mermaid
graph LR;

a((a)) --> sum1[+]
b((b)) --> sum1
b --> sum2[+]
c1((1)) --> sum2

sum1 --> c((c))
sum2 --> d((d))

c --> mul1[*]
d --> mul1

mul1 --> e((e))
```

### Forward-mode differentiation (w.r.t. $ b $):

- $ \frac{\partial{a}}{\partial{b}} = 0 $
- $ \frac{\partial{b}}{\partial{b}} = 1 $
- $ \frac{\partial{1}}{\partial{b}} = 0 $
- $ \frac{\partial{c}}{\partial{b}} = \frac{\partial{(a)}}{\partial{b}} \frac{\partial{c}}{\partial{(a)}} + \frac{\partial{(b)}}{\partial{b}} \frac{\partial{c}}{\partial{(b)}} = 0 * 1 + 1 * 1 = 1 $
- $ \frac{\partial{d}}{\partial{b}} = \frac{\partial{(1)}}{\partial{b}} \frac{\partial{d}}{\partial{(1)}} + \frac{\partial{(b)}}{\partial{b}} \frac{\partial{d}}{\partial{(b)}} = 0 * 0 + 1 * 1 = 1 $
- $ \frac{\partial{e}}{\partial{b}} = \frac{\partial{(c)}}{\partial{b}} \frac{\partial{e}}{\partial{(c)}} + \frac{\partial{(d)}}{\partial{b}} \frac{\partial{e}}{\partial{(d)}} = 1 * d + 1 * c = d + c $

```mermaid
graph LR;

a((da/db)) --> sum1[+]
b((db/db)) --> sum1
b --> sum2[+]
c1((d1/db)) --> sum2

sum1 --> c((dc/db))
sum2 --> d((dd/db))

c --> mul1[*]
d --> mul1

mul1 --> e((de/db))
```

### Reverse-mode differentiation (w.r.t. $ e $):

- $ \frac{\partial{e}}{\partial{e}} = 1 $
- $ \frac{\partial{e}}{\partial{c}} = \frac{\partial{(e)}}{\partial{c}} \frac{\partial{e}}{\partial{(e)}} = d * 1 = d $
- $ \frac{\partial{e}}{\partial{d}} = \frac{\partial{(e)}}{\partial{d}} \frac{\partial{e}}{\partial{(e)}} = c * 1 = c $
- $ \frac{\partial{e}}{\partial{a}} = \frac{\partial{(c)}}{\partial{a}} \frac{\partial{e}}{\partial{(c)}} = 1 * d = d $
- $ \frac{\partial{e}}{\partial{b}} = \frac{\partial{(c)}}{\partial{b}} \frac{\partial{e}}{\partial{(c)}} + \frac{\partial{(d)}}{\partial{b}} \frac{\partial{e}}{\partial{(d)}} = 1 * d + 1 * c = d + c $
- $ \frac{\partial{e}}{\partial{1}} = \frac{\partial{(d)}}{\partial{1}} \frac{\partial{e}}{\partial{(d)}} = 0 * c = 0 $

```mermaid
graph LR;

a((de/da)) --> sum1[+]
b((de/db)) --> sum1
b --> sum2[+]
c1((de/d1)) --> sum2

sum1 --> c((de/dc))
sum2 --> d((de/dd))

c --> mul1[*]
d --> mul1

mul1 --> e((de/de))
```
