---
title: Compass One-Liner For Automating CSS Transitions
date: 2013-06-12 16:55:23
tags: sass, design
---

Here's a magnificently eloqent compass mixin that will work CSS3 transition magic on all elements in one fell swoop:

`* { @include single-transition(all, 100, ease-out, 0); }`

## How It Works

If you're not familiar, [read all about the compass sass framwork here](http://compass-style.org/). Also make sure you `@import 'compass/css3/transition'` once sass/compass are up and running.

The code above actually outputs 5 lines when all is said and done, but this is CSS, so let's not [argue semantics](http://stackoverflow.com/questions/4204459/how-to-open-multiple-stand-alone-browser-windows-using-javascript, http://stackoverflow.com/questions/7064998/how-to-make-a-link-open-multiple-pages-when-clicked, http://alistapart.com/article/semanticsinhtml5http://coding.smashingmagazine.com/2011/11/11/our-pointless-pursuit-of-semantic-value/).

    * {
      -webkit-transition: all 0.3s ease-in-out 0.1s;
      -moz-transition: all 0.3s ease-in-out 0.1s;
      transition: all 0.3s ease-in-out 0.1s;
    }

This code says "Apply a transition to all CSS properties of elements `*` (all of them) for a duration of .3 seconds, and wait .1 seconds to start the party." That's all there is to it! Now your other developer friends will get a nice flashy surprise when they resize your site right and left to spy on your responsive design skills; plus, the casual visitor who happens to resize just because they need the screen real estate might be impressed as well. They'll probably even think you spent time writing out all the vendor, and if they're more observant than most they might not help but imagine how you painstakingly matched up all the timings. Victory is yours.

## But Wait, There's More!

First off, I personally prefer the [sass indented syntax](http://sass-lang.com/docs/yardoc/file.INDENTED_SYNTAX.html), which ends up being 2 lines. Typing less is worth the veritcal bloat, in my opinion. So here's the same code, properly indented in in .sass format:

    *
      +single-transition(all, 100, ease-out, 0)

Now that you're hip to the indentaion, let's take things a step further with `:hover` effects, in 2 lines:

    *, &:hover
      +single-transition(all, .3s, ease-in-out, .1s)

Here we keep the original global transition, but add the `:hover` psuedoclass as an adjacent group selector. Now hover effects of all elements recieve matching transition animation. On first glance it may look like you painstakingly matched up dozens of lines of CSS animation to get all the timing and effects to match up. Probably even on second glance. Woot.
