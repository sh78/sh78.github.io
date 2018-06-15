---
title: Finally, A Vim Global Find That Doesn't Suck
date: 2018-06-13 17:35:00
tags: [Linux, *nix, shell, vim, dotfiles]
---

I'm a recent vim convert. 100% in it now. There has been literally one
thing, and only one thing, I've missed from other editors (namely [Sublime Text](https://sublimetext.com/)) **until today**: Global, or project-wide, find and replace. 

Allow me to illustrate:

## Global Find/Replace in Sublime Text and the like

![The global find/replace drawer in sublime text.]()

Use case: you have a massive project with tons partials/includes and so forth.
You want to jump to a specific markup node to add a new feature/bug. So instead
of muddling around in the file browser in the sidebar, you slam down
Cmd+Shift+F, and tell the computer what you're looking for. Boom, all
occurrences are listed, and you can open one up and start working.

Later, you change a class and need to update 17,342 css files to replace the old
class name with the new one. So:

![Replacing a class name in Sublime Text]()

So vim must have this built in right?

## Doing The Same Thing In A Stock Build Of Vim

Well, the short answer is yes, The long answer is it's not ideal.

You can run `:vimgrep [PATTERN] [PATH]`. Now before you attempt this in a real
project, be sure to set a `wildignore` such as:

```vim
set wildignore+=.git,.svn,.DS_Store,.npm,.vagrant,*.zip,*.tgz,*.pdf,*.psd,*.ai,*.mp3,*.mp4,*.bmp,*.ico,*.jpg,*.png,*.gif,*.epub,.hg,.dropbox,.config,.cache,*.pyc,node_modules/*,bower_components/*,*.min.*
```

This prevents vim from searching through node modules for nine hours. Also, be sure that you've started vim from your project directory, like `cd myproject && vim` or `vim ~/myproject`.

So, to replicate the default behavior of something like Sublime, we now do:

```vim
:vimgrep id\\=\\"my-id **/*
```

Do note the backslashes; this is vim and we must escape all the things. The `**/*` is a standard [Unix pattern format](https://git-scm.com/docs/gitignore#_pattern_format) that's like saying "look at any/all directories and any/all contents".

Now hit enter, and get up to make some coffee. Hopefully you're a hipster and
you have one of those [manual burr grinders](https://amzn.to/2Mug8XZ), and you grind your coffee on a
per-cup basis; this is going to take awhile.

![vim's response after running vim grep]()

Ah, you're back. Ok, so now why didn't we get a list of results? It just showed
off the first result, told us to press enter, and took us there. Well, you have
to open the [quickfix window](), silly!

```vim
:copen
```

Navigate the quickfix contents with `j` and `k`. Depending on you color
settings, you may or may not be able to see where you are at any given time.
Just hit enter when it feels right.


Here's [not a gif](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/) of the whole process so far against a simple static site with 23,262 lines:

{% include youtube.html id="2wHfYjj78WY" %}

This just won't do. Let's turn up the complexity!

## `%s/vimgrep/Denite/g`

Today is Long-Winded-Wednesday, so we're just getting started.

[Denite](https://github.com/Shougo/denite.nvim#denitenvim) is an apparently
nefarious yet amazingly performant interface unification engine for vim (and neovim!). What
is it and isn't is a bit more complicated, but for our purposes it is a
lightning fast system for interacting with lists that will the quickfix list
(`:copen`) shown above.

Denite has both the "asynchronous" and "fuzzy" buzzwords, which covers about 80% of my requirements for
adopting a new tool. The other 20% is mostly "automagical(ly)".

### Doing it With Denite

So - here's the same operation with Denite:

{% include youtube.html id="JoS_PiSanZU" %}

Oh, bee tee dub - this was actually against 319,601 lines. Booyakasha. I'll wait
while you frantically paw for you credit card and go out to buy Denite.

### Forced Induction

I'm not one to leave well enough alone, so let's drop a stage 4 turbo in this
thing and cut off the mufflers. 

[`rigrep`](https://github.com/BurntSushi/ripgrep#quick-example-comparing-tools) is
is a grep alternative that is [fast like a NASCAR](https://blog.burntsushi.net/ripgrep/).
We can plug it into Denite as such, [per the docs](https://github.com/Shougo/denite.nvim/blob/ef3ffe7ffff25b0260be1e336dcd55014a6787a7/doc/denite.txt#L198):

```vim
call denite#custom#var('grep', 'command', ['rg'])
call denite#custom#var('grep', 'default_opts',
    \ ['--vimgrep', '--no-heading'])
call denite#custom#var('grep', 'recursive_opts', [])
call denite#custom#var('grep', 'pattern_opt', ['--regexp'])
call denite#custom#var('grep', 'separator', ['--'])
call denite#custom#var('grep', 'final_opts', [])
```

Now let's test it against something a bit heavier: the Linux kernel. **24,797,925
lines across 56,994 files**.

{% include youtube.html id="IG8xst6oM54" %}

Barely broke a sweat. The fans on my 2015 i3 MacBook Pro did spin up, but I was
also making a UHD screen recording and uploading files from an external drive to
Amazon Drive at the time. 

If you like what you see, go ahead and install `rg` with your favorite
package manager. If you also like replacing text from within vim, add
[vim-rigrep](https://github.com/jremmen/vim-ripgrep) to your vim plugins (more
on that later).

### Moar Denite, Key Maps

Here are some of the things you can do with Denite out of the box, and some
mappings that don't conflict with any core vim features (that I use):

```vim
" find pattern in file in working directory
" gr is unmapped by default
:nnoremap gr :Denite grep:. -mode=normal<CR> 

" same as above but pre-populate search with current word under the cursor
" gK (unmapped by default)
:nnoremap gK :DeniteCursorWord grep:. -mode=normal<CR> 

" find the word under the cursor in ctags
" gn visually selects search patterns by default
:nnoremap gn :DeniteCursorWord tags -mode=normal<CR>

" fuzzy find against the entire vim :help, including plugins
" gh is select mode by default
:nnoremap gh :Denite help<CR>

" same as above but pre-populate search with current word under the cursor
" gH is select line mode by default
:nnoremap gH :DeniteCursorWord help<CR>
```

## But What About The /Replace?

There's an app for that. As the kind folk at thoughbot [have pointed
out](https://robots.thoughtbot.com/lists-vim-and-you#from-inside-of-vim):

> With the release of Vim 7.4.858 we got two new commands: :cdo and :cfdo. They work similarly to :argdo, but they operate over the quickfix list instead of the arguments list.

Let's try this out. Going back to the CSS class example, we have:

```vim
" first use rigrep to populate the quickfix list
:Rg \\.old-and-busted
" For reasons I do not care to explore, escaping the `.` requires two backslashes. 
" then run cfdo and pass in a substitute command just like we use in a file
:cfdo %s/\.old-and-busted/.new-hotness/g | update
```

Splendid, it works well. And it requires a bunch of really awkward typing. We
can fix that with some vim script in our `.vimrc`:

```vim
" global find/replace inside working directory
function! FindReplace()
  " figure out which directory we're in
	let dir = expand('%:h')
  " ask for patterns
  call inputsave()
  let find = input('Pattern: ')
  call inputrestore()
  let replace = input('Replacement: ')
  call inputrestore()
  " are you sure?
  let confirm = input('WARNING: About to replace ' . find . ' with ' . replace . ' in ' . dir . '/**/* (y/n):')
  " clear echoed message
  :redraw
  if confirm == 'y'
    " find with rigrep (populate quickfix )
    :silent exe 'Rg ' . find
    " use cfdo to substitute on all quickfix files
    :silent exe 'cfdo %s/' . find . '/' . replace . '/g | update'
    " close quickfix window
    :silent exe 'cclose'
    :echom('Replaced ' . find . ' with ' . replace . ' in all files in ' . dir )
  else
    :echom('Find/Replace Aborted :(')
    return
  endif
endfunction
:nnoremap <Leader>fr :call FindReplace()<CR>
```

**WARNING**: these be dangerous waters ye treadith in, should ye treadeth. There's a lot of variation in results here
depending on your individual configuration. A few points:

- It will respect you `wildignore` settings.  
  You may want to do a quick `:set wildignore=foo,bar` from the command prompt before running this
- It will use your current `ignorecase` setting.  
  I keep `ignorecase` and `smartcase` set to make quick searches easier. You
  probably want to `:set noignorecase` prior to running this, to avoid replacing
  a capitalized instance with a non-capitalized instance. 
- Take caution to note which directory vim is working from.  
  Doing this from, say, your home directory, could obliterate your machine. Do it from a path that's under version control.
- The static messages and warnings in the function only print the current
directory if you run vim like `vim ./myproj` or `vim .`. I'm employing the
Pareto principle here and am not worried about getting the path printed if it
take another 30 minutes.
