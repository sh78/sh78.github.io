---
title: Switching From macOS High Sierra to Fedora Linux
date: 2018-05-23 08:46:00
tags: [Linux, *nix, macOS, Fedora, hardware, shell, vim, dotfiles]
---
This is a tale of two operating systems. A tale of liberation and discov- OK, sorry. Got carried away. Reset.

I'm writing this mainly as a high-level migration guide for those jumping into Linux - specifically, from macOS to Fedora. It also contains some strategies and principals for maintaining cross-platform configurations. It will not cover much of the nitty-gritty configuration details, as those are in my [dotfiles repo](https://github.com/sh78/dotfiles/) which just might get a nice README some day.

Note that everything here was done on a Early 2015 Retina MacBook Pro running Fedora 28 latest as of <time>2018-05-24</time>. Also note that this is a likely a **multi-day** project, unless you have an unsafe amount of caffeine.

# Why?

Free and open source is good; yes, I know, Fedora isn't technically 100% "free" [according to Richard Stallman/FSF](https://www.gnu.org/distros/common-distros.en.html#Fedora).

Don't want to be chained to Apple's design decisions. Or Fedora's. If I can make this work, then distro hopping is all the more feasible.

I don't need much of what's available on macOS now that I'm shell- and browser- oriented. I spend so much time clearing the clutter.

Better control of my environment form and function.

Wanted to use i3 for a long time now.

Can run on almost any Mac or PC.

Forces me to learn more about *nix based systems, which is fun and rewarding.

# whoami

I've been playing with computers for about 20 years now. About 12 of those were in a professional capacity. I currently work as a front-end developer for a large house-hold name, but have bounced around between marketing, bizdev, back-end, devops, systems administration, and general IT consulting. I switched to OS X in 2008 for my first full-time computer gig at the ripe age of 18, and have been pushing for more efficient and effective workflows ever since discovering that pressing Command+Shift+/ opened a help menu where you could type a query to semi-fuzzily find a command to run. I thought it was hella sweet to just type "tra sel" instead of digging through the Photoshop menus for "Transform Selection." Ah, to be young.

Lately, I use less; well, less on the GUI side and (way) more on the shell side and in the browser. Gone are the days of a $7 Mac app for each task; gone further are the days of mucking about in Microsoft products like Word, or troubleshooting IMAP settings in Mail.app. Since finally making the switch to vim earlier this year, I'm diligent to limit my core tools to a terminal and a browser. Anything else is just a rarity; a novelty, or an artifact of interfacing with someone else who uses such a tool.

So, without further adieu, here is the play-by-play migration of approximately 10 years' worth of workflow, built upon the Apple ecosystem, to a modern Linux environment - in chronological order.

# Hardware

## The Host Machine

Everything you see here (and more :wink) was done using an early 2015 Retina MacBook Pro 13". I'm quite happy with how well Fedora worked out of the box. Immediately on boot the hidpi display looked stellar, the WiFi worked (suck it Arch users), and the ducking **volume/brightness keys worked**. It really is 2018. 🦆

## Portability, Speed, and Redundancy With A Bootable External Drive

One thing I've always wanted to do is have my entire environment on a microSD
card. This isn't very practical to use as a daily driver, but I did find the
next best thing: [A tiny portable USB 3 SSD that is really
fast](https://www.amazon.com/gp/product/B073H552FK/).

I'm still locked in to using macOS for work, I made two partitions on this
drive. One is a bootable macOS that I [Carbon Copy
Clone](https://bombich.com/)d, and the other where I installed Fedora
originally. I run my mac from the external drive and clone it to the internal as backup, so I'm always ready to travel light. I used to take my personal laptop to work, in case I needed to work on something personal before or after work. Now I just bring the drive and plug it in to a work machine or a public computer if I really need to get something done that's not easy on a phone or someone else's browser.

Oh, and the portable SSD over USB3 or thunderbolt is **fast**.

# Installation

Using [Fedora Media Writer]() was child's play. `<rant>`Back in my day, we had to use a virtual Windows machine and Unetbootin, wait like an hour, walk 12 miles in the snow, and *maybe* it would boot.`</rant>`

After holding down alt during startup to get the boot menu, two different Fedora boot loaders appeared. For whatever reason, it they both worked.

I've installed Ubuntu several times in my life, so I assumed that the live USB would set up the persistent install on itself like Ubuntu's offers to do. Well, it doesn't. I was greeted with "disk is busy" or "can't write" blah blah blah on each attempt from the set up wizard. Luckily, I had a spare SD card around, so I set up the Fedora Media Writer on that and started over.

Not much else to fret over here. I picked a time zone, configured the partition scheme with 100GB for the macOS image and the rest for Fedora, and clicked "Sail off into the sunset."

![The Fedora hot dog, inspiring confidence from the start.](https://pbs.twimg.com/media/DdxtLScVAAET6Lc.jpg)

# First Run

The desktop environment that ships with Fedora is pretty cool. It's sleek, has nice animations, some familiar shortcuts, desktop notifications, Google/Facebook integration, and even a feature like Spotlight. Overall very responsive and polished. It comes with some office apps, a disk utility, mail, calendar, etc. Cute. It even notified me to take my medicine because I signed in with Google and it read my calendar. Neat.

So, obviously, I'm not using these.

For now, the built in terminal and a good browser will suffice.

## Uninstalls

I personally like to get rid of some of the default applications included, since I won't use them and they significantly slow down upgrades.

```shell
yes | sudo dnf remove gnome-calendar cheese gnome-contacts gnome-documents evolution photos rhythmbox gnome-maps gnome-weather
```

## Package Manager and Development Tools

`dnf` is the package manager for Fedora. Let's update our packages software and install some core build tools.

After reading up on [Fedora System Upgrades](https://fedoraproject.org/wiki/DNF_system_upgrade) let's start with the latest and greatest:

```shell
# WARNING - Reboot Imminent
sudo dnf -y update --refresh
sudo dnf -y install dnf-plugin-system-upgrade
sudo dnf -y system-upgrade download --refresh --releasever=28
sudo dnf system-upgrade reboot
```

![An IT person with title "have you tried forcing an unexpected reboot?"](https://media.giphy.com/media/10lBhcF4eTJZWU/giphy.gif)

Ah, you're back. Now let's do the equivalent of `xcode-select --install` on macOS:


```shell
sudo dnf install util-linux-user
sudo dnf -y groupinstall "Development Tools"
sudo dnf -y groupinstall "C Development Tools and Libraries"
```


## Chrom(e)(ium)

Spent a lot of time trying to set up Chrome from unofficial repositories, just to realize that we have the open-source Chromium instead. So it's just:

```shell
sudo dnf install chromium
```

Signing in to Chrome was a joy; I felt accomplished. All those extensions, bookmarks, and my cool Solarized theme rapidly snapped into existence; I felt immediately at ease.

### Extensions

Here's a list of my favorite/core Chrome plugins:

- [cvim](https://github.com/1995eaton/chromium-vim/) - [vimperator](http://vimperator.org/vimperator.html) for Chrome. I've tried a lot of vim-like chrome extensions, and this is by far the winner.
- [1Password](https://1password.com/) - (paid) password manager with a great team of humans behind it. More on this later.
- [Pocket](https://getpocket.com/) - read it later doohickey.
- [Mercury Reader](https://mercury.postlight.com/reader/) - read it now doohickey. I feel like this should be built into Chrome by now, but I digress.
- [TypeFu](https://type-fu.com/) - and extremely excellent typing trainer that adjust to your skill level, tracks your progress with graphs, and even lets you practice against code and upload your own templates. It's a one-time $5 purchase and works anywhere that Chrome does.
- [Pushbullet](https://www.pushbullet.com/) - monitor/act on phone notifications, sync SMS, and unified copy/paste. Suck it Apple.
- [Don't Fuck With Paste](https://chrome.google.com/webstore/detail/dont-fuck-with-paste/nkgllhigpcljnhoakjkgaieabnkmgdkb?hl=en) - just what it says. Thwarts nefarious developers that assume you are not responsible enough to paste in your password/account number/what have you.
- [Dev Tools](https://developers.google.com/web/tools/chrome-devtools/) - this is of course included by default, but just a hat tip for how excellent Chrome Dev Tools is.

And while we're at it, web apps:

* Google's things - Gmail, Drive, Calendar, and Keep are my core utils. [Keep](https://keep.google.com) is not very well promoted but it's a fantastic unified note space with support for #tagging and images. Also Hangouts is great for making calls, but I'm not sure if this works for everyone or just [Project Fi](https://fi.google.com/) subscribers.
* [ExplainShell](https://explainshell.com/) - breaks down shell commands into their components and explains them. Pure god status. I love it so much I [aliased it](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.config/omf/aliases.load#L216).
* [RegExr](https://regexr.com/) - the Samuel L Jackson of browser-based Regex prototyping.
* [Pixlr](https://pixlr.com/editor/) - for photo manipulation. I don't have very advanced photo needs any more, and web optimization happens [in the terminal](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.config/omf/aliases.load#L280). I'll probably get into GIMP at some point, but Pixlr was actually a nicer experience for my simple use cases.
* [Adobe Kuler](https://color.adobe.com/create/color-wheel/) - amazing interface for exploring color palettes.
* [SVGOMG](https://jakearchibald.github.io/svgomg/) - tool for editing/optimizing SVG.


### cvim

Having [cvim](https://chrome.google.com/webstore/detail/cvim/ihlenndgcmojhcghmfjfneahoeklbjjh?hl=en) installed was great, because many of the native shortcuts in Chromium are a lot different than macOS Chrome. The super key basically does nothing. Being able to immediately navigate with the familiar vim bindings proved very useful.

[Getting the local .cvimrc loaded was a bit on tricky on macOS](https://github.com/1995eaton/chromium-vim/issues/312#issuecomment-156189327), I recall. Also be sure to "allow access to file URLs" from the chrome://extensions/settings:

![cvim settings](https://i.imgur.com/jnH8YmH.png)

### Alternative

**Someday** I'll probably switch to [qutebrowser](https://www.qutebrowser.org/) full-time, but for now I'm quite dialed in to the Chrome economy.


## 1Password

I'm an avid 1Password user. It's great not to type passwords, and not to worry if one service gets hacked.

Close call here - I totally forgot that 1Password wasn't on Linux. I was about to call it all off, as 1Password has become an invaluable tool in my arsenal. Well, actually, I was going to suck it up and just use the web interface, which is nice but not native. Before saddling up, I did a quick web search and OH HALLO - [1Password X](https://blog.agilebits.com/2017/11/13/1password-x-a-look-at-the-future-of-1password-in-the-browser/) 🎉

There's also a [1Password CLI](https://app-updates.agilebits.com/product_history/CLI) that I'd like to test drive, but not today. Nor tomorrow.

**Someday** I'll probably end up using [‘pass‘](https://www.passwordstore.org/#other) or vim's ‘:encrypt‘ (if there's a way to make it [more secure](https://stackoverflow.com/questions/575817/vim-encryption-how-to-break-it)), but then again 1Password really comes in handy when it comes to interfacing with others.

Thinking back to the time that I ended up being in a coma for one month, I wish we had been on the 1Password family plan with my bank information and logins were stored in a shared vault accessible to my parents and my wife. I still remember how difficult it was to explain what my computer's password was, and worse yet the unlock pattern for my phone, while unable to speak due to being intubated and too paralyzed to write.

## Interfacing With The System Clipboard

`xclip` is essentially the linux `pbcopy`. You can pipe to it and the input will
write to the system clipboard, ready to ctrl-c.

```shell
sudo dnf -y install xclip
```

This will come in handy for yanking content out of vim and tmux (see tmux section later on), and to avoid using the mouse in general scenarios. Now, before you get to piping, note the [extra flags required]() to actually get the main system (GUI) clipboard. To copy something that you want to Control+v:

``` shell
cat file.txt | xclip -selection clipboard
```

To make things simpler, I set up a fish function to decide which clipboard to
use based on environment variables that I set higher up in the stack:

```fish
function clip --description "Substitute (eval) the right clipboard for this OS"
  eval $CLIPBOARD
end
```

So `$CLIPBOARD` works because in my environment file (loaded first in [init.fish]()) there's:

```fish
# operating system
set -gx OSTYPE (uname)

# os-specific env vars
switch $OSTYPE
  case "Linux"
    set -gx CLIPBOARD xclip -selection clipboard
  case "Darwin"
    set -gx CLIPBOARD pbcopy
end
```

We could also just test for existence of the commands, like `test (which pbcopy)...`, but I like this method because it reads well and I plan on setting more environment vars later on.

P.S. I'm too lazy to port this to bash at the moment. `echo $this > someday_maybe`.


## File Synchronization

I've been happily using Google Drive to sync my configs and working files for quite some time now. I prefer it to something like Dropbox because 1) less accounts, 2) everyone has Google, and 3) it's unparalleled when it comes to actually manipulating and sharing your bits.

Well, there's no official Google Drive client for Linux. I read some [click](https://www.howtogeek.com/196635/an-official-google-drive-for-linux-is-here-sort-of-maybe-this-is-all-well-ever-get/) [baits](https://beebom.com/unofficial-google-drive-linux-clients/) and tried some of the most viable seeming options. Order up, on the house.


### GNOME

Unfortunately the [GNOME Drive integration](https://www.techrepublic.com/article/how-to-make-the-most-out-of-google-drive-on-gnome/) that ships with Fedora doesn't actually sync. I tried clicking the mount just to see, and 10 minutes later I still couldn't even get a file listing. Yuck.

Even if it works as expected, it still wouldn't cut it for me. I need something that can actively watch of file and sync it, making it available instantly when I switch computers or switch to mobile.

### `rclone`

[rclone](https://rclone.org/install/) seemed perfect at first, but the [588 open issues](https://github.com/ncw/rclone/issues) were a terrifying read. Also the docs warn against extensive use with Google Drive, which is even more discouraging.

I ran `rclone config` and did a sync of just my dotfiles as a test:

```shell
rclone sync google-drive:/dotfiles Drive/dotfiles
```

After about 5 minutes I started getting 500 responses from the server:

``` shell
2018/05/22 22:14:03 ERROR : .local/share/omf/lib/git/git_is_stashed.fish: Failed to copy: failed to open source object: bad response: 500: 500 Internal Server Error
```

So about 7 minutes total for 108MB. Not bad, but `500`'s are bad. Now I'm imagining running opposing one-way `sync`s via `cron` and destroying my file system silently in the background.

Just for kicks, I changed into my dotfiles dir, which also happens to be a git repo, and ran `git status`. As anticipated:

```shell
fatal: bad object HEAD
```

The repo arrived corrupt, yet `rclone` only warned me about the 500 for the file in '.local/share/omf/'. Bad new bears, Batman.

Moving on....

### InSync

![The boy band sensation 'NSync](https://media.giphy.com/media/e9i8NXW1GSqAg/giphy.gif)

[InSync](https://www.insynchq.com/) looks promising, but at $30 does not conform to the Tao of Linux. 🤮

### Dropbox

Is it time to switch back to Dropbox? They have excellent [Linux support](https://www.dropbox.com/install-linux). I'd definitely miss the native Android integration and editing tools of Drive, but I'm running out of options here. Or am I?

### CloudCross

This is a manual push/pull app. I didn't try it since I want file watching and syncing.

[CloudCross](https://github.com/MasterSoft24/cloudcross)

### Grive / Grive2

Again, no auto syncing, despite looking like a good program.

[Grive2](https://www.fossmint.com/grive2-google-drive-client-for-linux/) / [Grive docker](https://www.fossmint.com/grive-a-dockerized-google-drive-client-for-linux/)

### The Results Are In: I Caved

I prepared to cough up the $30 for InSync and started the 14 day trial. The main factors that convinced me or seemingly positive feedback in the community about them, a good collection of support forms and blog posts by the developers, and strong support for running headless which is quite useful. [OverGrive](https://www.thefanclub.co.za/overgrive) does similar but only mentioned support for a handful of desktop environments, not including i3, which is where I want to end up. Also they mentioned something about not supporting sym links, which would make my dotfile synchronization quite difficult. Furthermore, I didn't find any very useful reviews, so I partially bought it just to bear the burden for anyone else in my predicament.

There's no dnf package for InSync, so:

```shell
sudo dnf install sni-qt
xdg-open [https://www.insynchq.com/downloads](https://www.insynchq.com/downloads)
# download and follow the wizard
```

I had some issues with [InSync's initial set up](https://help.insynchq.com/installation-on-windows-linux-and-macos/getting-started-with-insync/set-up-guide) process, but got it sorted out quickly.

On first run, it looks like it's not working, but it actually is. First it opens a browser for Google authorization. Then there's supposed to be a window that pops up asking your sync preferences, but it was opened behind other windows, and did not appear as a current application in the Command+Tab view or the GNOME Mission-Control-Type-Thing. I had to restart it with all other windows closed to see it. Also, don't accidentally click anywhere else outside of the pop up window or you'll have to restart again. **ALSO**, it was tiny because they didn't develop it to account for HiDPI displays.

After confirming your sync folder, it disappears and again looks like nothing is happening. Also there's no system tray (top bar) icon as depicted on their landing page. Since I thought it wasn't working, I decided to try [the headless cli](https://medium.com/@insync/run-google-drive-via-command-line-c3c504425fac).

```shell
insync start
```

No output returned. Then I tried:

```
insync get_sync_progress
```

Et voilà! It returned "9053 files queued". We may just use truncated output of  `insync get_sync_progress` in a future i3 [status bar](https://i3wm.org/i3status/manpage.html)... Don't touch that dial.

So, at this point there's still nothing in my ~/Drive dir that I choose.... In the docs, they show additional steps where you pick which folders to sync and can choose some settings. I didn't see that; when I chose the sync location, the InSync window just disappeared.

Well, it turns out that just running `insync show` brings the window back. From there I was able to check the boxes for folders to sync and actually start the process.

![the InSync application's main window](https://i.imgur.com/f9XGm2x.png)

While these issues are really annoying for a $30 Linux app, the bottom line is it works for my needs and blows away the competition.

# Software & Configuration

Once files are synced, we're ready to make this house a `~`.

This section will cover both installation and configuration troubleshooting. The
end result will be portable configs that work in Linux and Mac via fish, bash,
and zsh (and likely sh, too).

## Cue the dotfiles!

This is what it's all about. Years upon years of finely crafted configs, just waiting to be unleashed into a new host and propagate my opinions.... Now that files are synced, I need a tool like [Mackup](https://github.com/ira/mackup/) to handle all the symlinking for me. Oh wait - *mac*kup is for Linux too. So far, so winning.

```shell
pip install --upgrade --user mackup
```

Assuming Mackup is already [well-configured](https://github.com/lra/mackup/blob/master/doc/README.md#configuration), we can now load up all the dotfiles symlinks:

```shell
cp -r ~/Drive/dotfiles/.mackup* ~
yes | mackup restore
# mackup confirms a lot, so yes just auto-answers mackup's questions
```

![`~` sweet `~`](https://i.imgur.com/vx9VLYd.png)


## Vim

I use [neovim](https://github.com/neovim/neovim), but also like to keep vim 8 around just in case. In case of what you ask? I have no idea.

This package comes with python3 support and the other goodies:

```shell
sudo dnf install vim-enhanced
```

And now for Neo:

```shell
dnf -y install neovim
dnf -y install python2-neovim python3-neovim
```

There was surprisingly little to debug here. On launch my auto-magical Vundle script installed all my plugins, and there were no warnings/incompatibilities with other stuff in my [vimrc](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.vimrc#L1). The main issue was a whacked out color scheme (from using Solarized palette in iTerm) and weird characters in the [airline]() status line.

![My accidental rave style color scheme in vim](https://i.imgur.com/cAYDEuA.png)

Now let's pick a new terminal, and figure out about installing fonts to tidy up that status line.

## Choosing A Terminal Emulator

There are quite literally a metric shit-ton of terminal emulators for Linux out there. Coming from [iTerm](https://www.iterm2.com/), there's some pretty big shoes to fill here. I was about to go with [urxvt](https://www.youtube.com/watch?reload=9&v=eaBf_yFHps8), but then remembered that I hadn't checked on [Hyper](https://hyper.is/) in awhile.

Hyper is continuing to grow, and has some [awesome extensions](https://github.com/bnb/awesome-hyper) going for it that cover much of what I use in iTerm. The big winner here is that Hyper's configuration is plain ol' JavaScript object, which is perfect for cross-platform syncing.

```shell
# requires node/npm
sudo dnf install nodejs
wget https://github.com/zeit/hyper/releases/download/2.0.0/hyper-2.0.0.x86_64.rpm
xdg-open hyper-2.0.0.x86_64.rpm
#  install it!
```

[Here's my .hyper.js config at the moment](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.hyper.js#L1).

### Bonus: Just For Kicks

[Cool Retro Terminal](https://github.com/Swordfish90/cool-retro-term) is pretty, well, cool. I keep it around. Great for when clients come to the office and we need to look professional.

```shell
sudo dnf -y install qt5-qtbase qt5-qtbase-devel qt5-qtdeclarative qt5-qtdeclarative-devel qt5-qtgraphicaleffects qt5-qtquickcontrols redhat-rpm-config
sudo dnf -y install cool-retro-term
```

![cool retro terminal running on my MacBook](https://i.imgur.com/rSQA4gc.jpg)

![cool retro terminal with text "hellow der"](https://i.imgur.com/uFn4rGf.jpg)

## Setting Custom Fonts

I have several fonts I like to bounce between. On a Mac, you drag and drop them into FontBook.app. On Linux, you `cp` them to `~/.local/share/fonts/`, which is way cooler. I have one font that is not publicly available, so:

```shell
mkdir -p ~/.local/share/fonts/
mv DankMono-Regular.ttf DankMono-Italic ~/.local/share/fonts/
sudo fc-cache -fv
```

For the rest, I opted for the [Nerd Fonts install script](https://github.com/ryanoasis/nerd-fonts#option-3-install-script). Nerd Fonts are also Powerline-patched, but have other cool symbols that I haven't used (yet).

```shell
git clone https://github.com/ryanoasis/nerd-fonts # 7.6GB!
cd nerd-fonts
./install.sh AnonymousPro
./install.sh FiraCode
./install.sh Hack
./install.sh SourceCodePro
cd ..
rm -r nerd-fonts
# log out or reboot to take effect
```

For whatever reason, the default GNOME Terminal didn't pick up the new fonts, but other applications did. I tried restarting, copying the fonts to /usr/share/fonts/, and a clean install of it - nada. This isn't a problem, though, since we have a fancy new terminal as per the above section. **WIN. ING.**

## tmux

[tmux](https://hackernoon.com/a-gentle-introduction-to-tmux-8d784c404340) is another big one. I use it along with [tmuxinator](https://github.com/tmuxinator/tmuxinator#tmuxinator), which is a session management system that kicks serious ass and is configured with YAML. The great thing about tmux is that once you get the hang of it, you're at home and highly productive wherever tmux is - Mac, Linux, remote server, and what have you. tmux is also great for pair programming over SSH.

```shell
sudo dnf -y install tmux tmuxinator
```

At this point I'm **still** waiting for my Google Drive sync to complete; it seems a purge is in order.... Just for a sneak preview, I copied my [`.tmux.conf`](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.tmux.conf#L1) in and gave it a whirl.

```shell
[sean@localhost ~]$ tmux
[exited]
```

It won't start! tmux flashes on screen and vanishes. [StackExchange to the rescue](https://unix.stackexchange.com/questions/128190/tmux-exits-immediately-after-starting#answer-219000)! A line I had that helps with [clipboard integration on macOS](https://github.com/ChrisJohnsen/tmux-MacOSX-pasteboard) was making tmux implode from sheer confusion.

```shell
set -g default-command "reattach-to-user-namespace -l ${SHELL}"
```

So how to keep this working on macOS but not on Linux? `if-shell` works nicely here. We can split out OS-specific commands into separate files and `source` then:

```shell
if-shell 'test "$(uname)" = "Darwin"' 'source ~/.tmux.macos.conf'
if-shell 'test "$(uname)" = "Linux"' 'source ~/.tmux.linux.conf'
```

This was confusing to me for a bit because I wrote the `if-shell` directives in
fish, but it turns out tmux holds it down with bash.

Now we set up our files like in [this commit](https://github.com/sh78/dotfiles/commit/70ab1f332ffdefe6283740deea88e35dd98c6e5f),

## git

The `osx-keychain` method of saving credentials certainly won't work here in
Linusville, so let's use the `cache` method and hold on the data for 18 hours:

```shell
git config --global credential.helper 'cache --timeout 28800'
```

Now git will interactively prompt for login as needed.

## Ranger

I've recently discovered ranger, and I'm hooked. Sometimes, I just need to visually comb through a file system to keep track of what I'm doing. Ranger is basically the column view (Command+3) in Finder, but in your terminal and souped-up with powerful features. Don't take my word for it, though - [watch this](https://www.youtube.com/watch?v=NzD2UdQl5Gc), and [this](https://www.youtube.com/watch?v=nlolvAVqn10).

I used `dnf`to install ranger, and ran into a funky issue. Trying to use `zh` to show hidden files threw an exception:

```shell
The option named `show_hidden!' does not exist
```

I couldn't find this exact error in a web search but noticed that my ranger version was several releases behind what's listed on the [official site](https://ranger.github.io/download.html). This wouldn't really be a Linux guide without building from source.

```shell
wget https://ranger.github.io/ranger-stable.tar.gz
tar xvf ranger-stable.tar.gz
cd ranger-1*
sudo make install
ranger --ver
# => ranger version: ranger-master 1.9.1
```

With ranger master, `zh` works as expected, divulging the whereabouts of hidden files. Hooray for hypothesis!

## rbenv

[rbenv](https://github.com/rbenv/rbenv) is a great tool for ruby version management and containment. There's no `dnf` package, so we'll have to do some manual set up.

```shell
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
# I already have a .bash_profile configured for rbenv, so not needed
# echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
~/.rbenv/bin/rbenv init
```

## Vagrant/Virtual Box

Vagrant has been an invaluable tool in my big fat software development toolbox. I first used it professionally back in 2015 and it totally saved the day. We rebuilt a snowflake (mutable) VPS set up for a complex multi-rails-and-ember app that was already in a high-demand production scenario but had tons of bugs and needed tons of development. Just to paint a picture: the production server didn't even have init.d config to start nginx and unicorn, so when it ran out of memory and crashed (on my first day) I had to ssh in manually start everything in a `screen` session.

With vagrant, I reverse engineered a similar-enough environment, added some SSL for good measure, pushed to a new server, and ran the migration. After the switch, we were able to confidently push code knowing with reasonable certainty what would result on prod.

When I heard on the internet that Fedora and vagrant have had a checkered past, I was concerned. Luckily some kind and brave soul at ifnottruethenfalse published a great [step by step](https://www.if-not-true-then-false.com/2010/install-virtualbox-with-yum-on-fedora-centos-red-hat-rhel/). Here's a summary.

Start by downloading the package and checking your kernel:

```shell
sudo -i
cd /etc/yum.repos.d/
wget http://download.virtualbox.org/virtualbox/rpm/fedora/virtualbox.repo
dnf update
rpm -qa kernel |sort -V |tail -n 1
uname -r
# if the kernel updates, then reboot
```

Now make sue deps are installed and set up VBox:

```shell
dnf install -y binutils gcc make patch libgomp glibc-headers glibc-devel kernel-headers kernel-devel dkms
dnf install -y VirtualBox-5.2
/usr/lib/virtualbox/vboxdrv.sh setup
usermod -a -G vboxusers user_name
VirtualBox
```

Pics or it didn't happen O.o

![VirtualBox running in Fedora](https://i.imgur.com/LqeuS1Y.png)

There's also [another wonderful guide from ifnottruethenfalse](https://www.if-not-true-then-false.com/2010/install-virtualbox-guest-additions-on-fedora-centos-red-hat-rhel/) on how to get Guest Additions set up.

## Gone fishin'

The 90's have come and gone; it's time for a new, [**f**riendly, **i**nteractive **sh**ell](https://github.com/fish-shell/fish-shell).

```shell
sudo dnf -y install fish
```

Running fish produces an error:

```fish
fish: Unknown command 'it2setcolor preset Solarized Dark v2'
```

I already have some automagic iTerm color scheme change logic based on time of day, but we're a long way from Kansas now, so let's wrap that conditional in a conditional, yo.

```fish
if type -q it2setcolor
    if test $COLOR = "light"
        it2setcolor preset "Solarized Light v2"
    else
        it2setcolor preset "Solarized Dark v2"
    end
end
```

[Oh My Fish](https://github.com/oh-my-fish/oh-my-fish) is up next:

```shell
curl -L https://get.oh-my.fish | fish
```

No complaints here. Let's set fish as the login shell and log out/in.

```shell
sudo chsh -s /usr/bin/fish
```

## The Rest

[Here are other programs I like or find useful for development and general workflow](https://github.com/sh78/dotfiles/blob/aabba49702344b4cc2468763b5cd16df75c65529/.macos/installers.bash#L1).


<!--
## Other Cross-Platform Adjustments

Besides anything mentioned in the other sections, here are some growing pains I encountered along with their solutions.
-->


# Preferences

Let's do some basic settings now.

## Host Name

I like setting unique host names for my machines. I pick a quality about the machine, then translate that word to Turkish.

```shell
sudo hostnamectl set-hostname sapka
```

"Şapka" is Turkish for "hat" (Red Hat). My first retina MacBook Pro was named "göz" for "eye". My MacBook "Air" was named "hava" (rough translation). Etcetera, etcetera.

## Automation Is King

On macOS, there is `defaults write`, and `defaults export`/`import`. So this is Linux, can we automate Fedora's preferences in such a fashion?

Well, not going to bother, because here comes [i3wm](https://i3wm.org/).

# To Be Continued
<!--
# i3wm: A Tiling Window Manager


## To Gap Or Not To Gap

[i3-gaps](https://github.com/Airblader/i3)

## The Key Shortcuts

## Fixing Display Resolution For Retina Screens

## Config File Structure

[Syntax highlighting in vim](https://github.com/PotatoesMaster/i3-vim-syntax)

## A Better Lock Screen

## Launcher

## Status Bar

## Fonts

## Fanciness

Compton
lxappearance

# Odds And Ends

## Screenshots

[Here's a guide on screenshots is Fedora](https://fedoramagazine.org/take-screenshots-on-fedora/). Apparently this [also works in i3](https://erikdubois.be/two-different-ways-make-screenshot-i3/).

## How To Insert Special Characters/Symbols And Emoji

I use Command+Control+Space on the Mac to insert Emoji and whatnot. Fedora has a similar menu but you have to [enable it first](https//fedoramagazine.org/using-favorite-emoji-fedora-25/).

For i3, [...]

## Webcam, Microphone

The microphone worked straight away. Making calls on Hangouts and Messenger via
Chrome was smooth sailing.

The camera, however, took some convincing. [...]


## Working The Night Shift

-->
