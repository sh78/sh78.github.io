---
Title: When An `alias` Should Actually Be An `abbr`
date: 2018-06-15 14:15:00
tags: [shell, fish, workflow]
---

I really appreciate `tmuxinator` handles completion and aliasing from a fish
shell. You type `mux`, and when you hit space it expands into `tmuxintor`. From
there you can hit tab to see the options at each step of the way. 

{% include youtube.html id="IWIlZir97l0" %}

I like it so much that I poked around in [their
completion](https://github.com/tmuxinator/tmuxinator/blob/master/completion/tmuxinator.fish)
script hoping to crib some methods and do the same thing with tmux itself. Well,
there are some custom methods, but the main feature I want turns out to be
[already built in to fish](https://fishshell.com/docs/current/commands.html).
It's called `abbr`. 

## Why another alias?

It's mostly personal preference, but there are a couple points where `abbr` is
nicer than `alias`:

- [Slow
startup time](https://github.com/fish-shell/fish-shell/issues/828). This becomes
noticeable after a couple hundred or so.
- Clean history. Using `abbr` means other developers can understand your
terminal history. So posting an issue to GitHub doesn't require manual
substitution of your aliases, and another developer won't have trouble
deciphering history on a remote that you worked on with your dotfiles in place.
- Easy to use a shortcut that's close to what you want and edit it.
- If your shortcut conflicts with another executable that you want to run, you
can just use the arrow keys to edit the expanded text in a pinch, before fixing
it in your dotfiles.

And one (?) where it's not:

- You can't just type the shortcut and hit return; it will only expand after a
space or semicolon.


## A Logical System, Take 1

With the addition of `abbr`, we now have three distinct types of functions to
choose from while programming our programming shortcuts–what? Why, yes, I do like
programming - where did you hear this?

### The three types 

1. `abbr`: Type `something` and have it expanded into `something else` after
   pressing space or semicolon (but not return). The new hotness.
2. `alias`: Make a `something` functionally equivalent to something else. This
   holds true if you press return, chain things together, pipe, redirect, and
   such. In recent versions of fish, context aware tab completion will work here
   too.
3. `function`: Make `something` functionally equivalent to one or more `something
   else`s, and optionally permute data that are being worked with (`argv`).

Strictly speaking, `alias` is itself just an alias for a `function` that blindly
accepts `argv` and tacks them to the end of its `something else`. But this
pattern is so prolific that it got its own name, so we will consider it unique
for today.

### Choosing the right one

Here is how I picture the use cases:

1. `abbr` will employed to shorten phrases that will certainly have additional
   arguments but don't need to do anything special with those arguments. 
2. `alias` is for any phrase that is self-sufficient - it can be run as is, or
   optionally with arguments.
3. `function` is for everything else, and when an alias is complex/abstract
   enough to warrant a description.

#### performance notes


Fish has a mechanism in place for
[lazily-autoloading](http://fishshell.com/docs/current/tutorial.html#tut_autoload)
custom function definitions. This can have a noticeable performance impact over
`alias` when you get into the hundreds.

Also, [I heard on the
net](https://github.com/fish-shell/fish-shell/issues/828#issuecomment-18584856)
(yes, a pun) that using the fish-style `alias` syntax is more performant than using the `=` assignment operator due to an extra `sed` call; this was, however, back in 2013. I didn't notice
much of a difference here, but it's an easy change and using a default syntax is
always preferred in my book. (Someday maybe: make or find a fish->bash
transpiler.) 

Let's agree to write aliases like this:

```shell
alias short 'long-form -l'
```

Furthermore, let's try use `abbr` or `function` instead of `alias`, unless it's
really convenient. Last but not least, let us also use the default method for
defining out custom functions:

```shell
> cat ~/.config/fish/functions/ll.fish
function ll
    ls -lh $argv
end
```

Note: Not practicing what I'm preaching yet. I'm currently using a monolithic [aliases.load](https://github.com/sh78/dotfiles/blob/f173673d40a4275615dd92e70f1ea01601ada107/.config/omf/aliases.load#L1) file with over 500 lines of
aliases and functions. This will have to change soon.

### Practical Examples

First up - simple and obvious choice: `git`. 

```shell
abbr --add g 'git'
```

Type `g<space>` and witness the magic.

Now, what if you want to replace a program with another program. I recently
switched to [neovim](https://github.com/neovim/neovim), but for some reason it felt wrong not to type `vim`. An
alias will do well here:

```shell
alias vim 'nvim'
```

Then, if you want some shortcut-ception:

```shell
abbr --add v 'vim' # which is now `nvim`
```

If at some point you decide to ditch `nvim` as the default `vim`, your `v`
shortcut doesn't need to be touched. 

What about setting default flags for programs that don't allow such
configuration? Let's say we want to default to the long-form `ls`, with
classification indicators, but hide user and group info:

```shell
ls -Fog
```

Well, `ls` can have both zero and more than zero arguments. So it will be nice
to not have to press another key to `ls -Fog` the current directory. `alias` it
is.

```shell
alias ls 'ls -Fog'
```

Well, hold up; then again, it might be nice to stick with the default ls, and hit
`<space>` to get our preferred flags. In effect, this is like aliasing `ls<space>`
to our tricked out command. If we do want a default `ls` for whatever reason, we
don't have to jump through any hoops to get it back. `abbr` it is. 

```shell
abbr --add ls 'ls -Fog'
```

And now, something more useful. Yes, it's function time.

![Four construction workers hitting a pole with sledgehammers in a staggered rhythm](https://media.giphy.com/media/Jg41tM6Bk71te/giphy.gif)

Normally naming things is the second most difficult part of computer science
(next to caching), but this was really easy to name:

```shell
function take
  mkdir -p $argv; 
  cd $argv
end
```

`take` is an amalgamation of `touch` and `mk` (make). It creates a directory and
changes into it.

The use case for functions basically starts here. There are multiple
non-sequential calls to `argv` from multiple commands. 

Here is a more worthy example:

```bobthefish
function wait --description "Run a command after some time: wait <minutes> <command args>"
  set minutes $argv[1]
  set time_in_seconds (math "$minutes*60")
  sleep $time_in_seconds; and eval "$argv[2..-1]"
end
```

## Keeping it DRY

[loop over subcommands to create abbrs]
