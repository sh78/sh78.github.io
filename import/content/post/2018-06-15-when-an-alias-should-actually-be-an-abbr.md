---
Title: When An `alias` Should Actually Be An `abbr`
date: "2018-06-15T14:15:00Z"
tags:
- shell
- fish
- workflow
---

The short answer is: **always**.

I really appreciate how `tmuxinator` handles completion and aliasing from a fish
shell. You type `mux`, and when you hit space it expands into `tmuxintor`. From
there you can hit tab to see the options at each step of the way. 

{% include youtube.html id="IWIlZir97l0" %}

I like it so much that I poked around in [their
completion](https://github.com/tmuxinator/tmuxinator/blob/master/completion/tmuxinator.fish)
script hoping to crib some gnarly methods and do the same thing with tmux
itself. Well, there are some custom methods therein, however the main feature I
want turns out to be [built in to fish
already](https://fishshell.com/docs/current/commands.html). It's called `abbr`. 

## Why `!` alias?

- [Increased performance](https://github.com/fish-shell/fish-shell/issues/828).
- This becomes
noticeable after a couple hundred or so in my testing.
- Clean history. Using `abbr` means other developers can understand your
terminal history. So posting an issue to GitHub doesn't require manual
substitution of your aliases, and another developer won't have trouble
deciphering history on a remote that you worked on with your dotfiles in place.
- Easy to use a shortcut that's close to what you want and edit it.
- If your shortcut conflicts with another executable that you want to run, you
can use the arrow keys to edit the expanded text, before fixing
it in your dotfiles.

[Here's a four month long GitHub issue about how `abbr` came to
be.](https://github.com/fish-shell/fish-shell/issues/731).


## A Logical Separation of concerns

With the addition of `abbr`, we now have three distinct types of functions to
choose from while programming our programming shortcuts–what? Why, yes, I do like
programming - where did you hear this?

### The three types 

1. `alias`: Make a `something` functionally equivalent to `something else`. This
   holds true if you press return, chain things together, pipe, redirect, and
   such. In recent versions of fish, context aware tab completion will work here
   too.
2. `abbr`: Type `something` and have it expanded into `something else` after
   pressing space or semicolon (but not return). The new hotness.
3. `function`: Make `something` functionally equivalent to one or more `something
   else`s, and optionally permute data that are being worked on with (`argv`).

Strictly speaking, `alias` is itself just an alias for a `function` that blindly
accepts `argv` and tacks them to the end of its `something else`. But this
pattern is so prolific that it got its own name, so we will consider it unique
for today.

### Choosing the right one

Here is how I picture the use cases:

1. `alias` **will not be used**.
2. `abbr` will be employed as the new `alias`; it will shorten phrases where we
   don't need to do anything special with `argv`.
3. `function` is for everything else; for when an `abbr` permutes `argv`
   and/or is complex/abstract enough to warrant a `--description`.

#### performance notes

Fish has a mechanism in place for
[lazily autoloading](http://fishshell.com/docs/current/tutorial.html#tut_autoload)
custom function definitions. This can have a noticeable performance impact over
just defining them in your config.fish or init.fish or wherever. So it's a good
idea to keep each function in its own, self-title file in
`~/.config/fish/functions/` like so:

```shell
# in ~/.config/fish/functions/ll.fish
function ll
    ls -lh $argv
end
```

In case I'm missing something and there is still a use case for `alias`,
here's a fun fact. [I heard on the
net](https://github.com/fish-shell/fish-shell/issues/828#issuecomment-18584856)
(yes, a pun) that using the fish-style `alias` syntax is more performant than
using the `=` assignment operator due to an extra `sed` call; this was, however,
back in 2013. I didn't notice much of a difference here, but it's an easy change
and using a default syntax is always preferred in my book. (Someday maybe: make
or find a fish->bash transpiler.) 

```shell
alias l='ls'
# should be:
alias l 'ls'
```

### Practical Examples

Time for the straight dope. First up - simple and obvious choice: `git`. 

```shell
abbr --add g 'git'
```

Type `g<space>` and witness the magic. I mean dope,

Now, what if you want to replace a program with another program. I recently
switched to [neovim](https://github.com/neovim/neovim), but for some reason it felt wrong not to type `vim`. An
alias will do well here:

```shell
abbr --add vim 'nvim'
```

Note that **abbr-ception will not work**:

```shell
abbr --add v 'vim' # this will still be regular `vim`
```

What about setting default flags for programs that don't allow such
configuration? Let's say we want to default to the long-form `ls`, with
classification indicators, but hide user and group info:

```shell
abbr ls 'ls -Fog'
```

The astute observer will note that I forgot to add the `--add` here. Well, turns
out [we don't need
it](https://github.com/fish-shell/fish-shell/blob/2443ea92c3c31c26ec1b6c3681a3e3a643250705/share/functions/abbr.fish#L14).

And now, on to something more useful. Yes, it's function time.

![Four construction workers hitting a pole with sledgehammers in a staggered rhythm](https://media.giphy.com/media/Jg41tM6Bk71te/giphy.gif)

Normally naming things is the second most difficult part of computer science
(next to cache invalidation), but this was rather easy to name:

```shell
function take
  mkdir -p $argv; 
  cd $argv
end
```

`take` is an amalgamation of `touch` and `mk` (make). It creates a directory and
changes into it. As an added bonus it leverages the `-p` flag, which forces the
computer to create the entire path you pass it if it doesn't exist.

The use case for functions basically starts here. There are multiple
non-sequential calls to `argv` from multiple commands. 

Here is a more worthy example:

```shell
function wait --description "Run a command after some time: wait <minutes> <command args>"
  set minutes $argv[1]
  set time_in_seconds (math "$minutes*60")
  sleep $time_in_seconds; and eval "$argv[2..-1]"
end
```

## Attempted DRYness, two counts

So I at this point, I now have a 261 line file full of `abbr --add 'what have
you'`. My DRY senses be tinglin'. Isn't there a way to neither type, nor look
at, a million `abbr`s? Let's find out.

Well, we can make a [temporary helper](https://github.com/sh78/dotfiles/blob/b06b1ca2c665b3badc0584d8a021a2e6cdf83394/.config/omf/aliases.load#L1) function to shorten the abbr --add syntax.

```shell
function a
  abbr --add $argv
end

# do abbrs...
a alias='echo "nope"'

# unset the function
# unset helper function
functions -e a
```

That's still repetition though, and it's confusing for anyone else. What
about a for loop? Fish doesn't have hashes/dictionaries that I'm aware of, so I
tried reading in lines of a file and passing each one to an `abbr` call:

```shell
while read -la line
  echo "$line"
  abbr "$line"
end < $HOME/.config/omf/aliases.load
```

This way, we can maintain an abbreviations file that purely has:

```shell
name 'command here'
another 'another command here'
```

Well, after 10 minutes of fish complaining "`abbr: abbreviation cannot have
spaces in the key`" despite my best efforts to escape and slice/join the string,
I decided to cut my losses and stick with the default. 

Someday I'll learn to leave well enough alone. That will be a really boring day.
The next day, I'll start bothering well enough again.

## What have we learned?

1. Use `abbr` instead of `alias`. 
2. Use `function` even more.
3. Fish really is friendly. Unless you want to program a dictionary.
4. Don't stay awake until 1am attempting to bypass built-in functionality of you
   shell, unless someone is paying you.

[Here are my shiny new
abbreviations](https://github.com/sh78/dotfiles/blob/d42cf1b86473e42ae123dffe38750eeaa31add99/.config/omf/aliases.load#L1). And [functions](https://github.com/sh78/dotfiles/tree/master/.config/fish/functions).
