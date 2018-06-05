# Minimaterialize

This is a fork of the [default Jekyll starter
theme](https://github.com/jekyll/minima), wired up with the [materialize css
framework](https://materializecss.com/) by Google. I wanted to build a Jekyll blog with Material Design, and figured why not release a bootstrap that other's can work with before hacking in my own code. Enjoy, and feel free to send in a PR with a cool fix or feature!

> ***Minima** is a one-size-fits-all Jekyll theme for writers*. It's Jekyll's default (and first) theme. It's what you get when you run `jekyll new`.

> Created and designed by Google, **Material Design** is a design language that combines the classic principles of successful design along with innovation and technology. Google's goal is to develop a system of design that allows for a unified user experience across all their products on any platform.

![minima theme preview](/screenshot.png)

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "minimaterialize"
```

And add this line to your Jekyll site:'s `_config.yml`:

```yaml
theme: minimaterialize
```

And then execute:

```shell
bundle install
```

## Updating

Minima theme:

    git remote add source https://github.com/jekyll/minima
    git fetch --all
    git merge source/master

Materialize CSS:

    npm update --save materialize-css

## Contents At-A-Glance

Minima has been scaffolded by the `jekyll new-theme` command and therefore has all the necessary files and directories to have a new Jekyll site up and running with zero-configuration.

### Layouts

Refers to files within the `_layouts` directory, that define the markup for your theme.

  - `default.html` &mdash; The base layout that lays the foundation for subsequent layouts. The derived layouts inject their contents into this file at the line that says ` {{ content }} ` and are linked to this file via [FrontMatter](https://jekyllrb.com/docs/frontmatter/) declaration `layout: default`.
  - `home.html` &mdash; The layout for your landing-page / home-page / index-page. [[More Info.](#home-layout)]
  - `page.html` &mdash; The layout for your documents that contain FrontMatter, but are not posts.
  - `post.html` &mdash; The layout for your posts.

### Includes

Refers to snippets of code within the `_includes` directory that can be inserted in multiple layouts (and another include-file as well) within the same theme-gem.

  - `disqus_comments.html` &mdash; Code to markup disqus comment box.
  - `footer.html` &mdash; Defines the site's footer section.
  - `google-analytics.html` &mdash; Inserts Google Analytics module (active only in production environment).
  - `head.html` &mdash; Code-block that defines the `<head></head>` in *default* layout.
  - `header.html` &mdash; Defines the site's main header section. By default, pages with a defined `title` attribute will have links displayed here.

### Sass

The minima styles have been totally removed in favor of Materialize.
see `_sass/main.scss` to control what's included and add your own. 

`script/build` copies the materialize assets into `_sass/`.

### Assets

Refers to various asset files within the `assets` directory.
Contains the `main.scss` that imports sass files from within the `_sass` directory. This `main.scss` is what gets processed into the theme's main stylesheet `main.css` called by `_layouts/default.html` via `_includes/head.html`.

This directory can include sub-directories to manage assets of similar type, and will be copied over as is, to the final transformed site directory.

### Plugins

Minimaterialize comes with [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag) plugin preinstalled to make sure your website gets the most useful meta tags. See [usage](https://github.com/jekyll/jekyll-seo-tag#usage) to know how to set it up.

## Usage

### Home Layout

`home.html` is a flexible HTML layout for the site's landing-page / home-page / index-page. <br/>

#### Main Heading and Content-injection

From minima v2.2 onwards, the *home* layout will inject all content from your `index.md` / `index.html` **before** the **`Posts`** heading. This will allow you to include non-posts related content to be published on the landing page under a dedicated heading. *We recommended that you title this section with a Heading2 (`##`)*.

Usually the `site.title` itself would suffice as the implicit 'main-title' for a landing-page. But, if your landing-page would like a heading to be explicitly displayed, then simply define a `title` variable in the document's front matter and it will be rendered with an `<h1>` tag.

#### Post Listing

This section is optional from minima v2.2 onwards.<br/>
It will be automatically included only when your site contains one or more valid posts or drafts (if the site is configured to `show_drafts`).

The title for this section is `Posts` by default and rendered with an `<h2>` tag. You can customize this heading by defining a `list_title` variable in the document's front matter.

--

### Customization

**Reading [Jekyll's theme documentation](https://jekyllrb.com/docs/themes/) will
help you understand what's going on behind the scenes and how to customize your
site.**

To override the default structure and style of minimaterialize, create the concerned directory at the root of your site, copy the file you wish to customize to that directory, and then edit the file.
e.g., to override the [`_includes/head.html `](_includes/head.html) file to specify a custom style path, create an `_includes` dirsimply ectory, copy `_includes/head.html` from minimaterialize gem folder to `<yoursite>/_includes` and start editing that file.

#### Styles

Each individual materialize sass component is included separately in
`_sass/main.scss`. To reduce unused css, you can comment out or delete the
components you are not using.

Materialize CSS already has an excellent set of variables that are configured to be
[easily overridden](https://materializecss.com/sass.html). These variables use
the sass `!default` declaration, which thoughtbot explains succinctly
[here](https://robots.thoughtbot.com/sass-default).

To start hacking the design, open up `_sass/_variables.scss` and change anything
you want. When the Materialize source sass components are loaded, they will see
what you set and skip the default value.

--

### Customize navigation links

This allows you to set which pages you want to appear in the navigation area and configure order of the links.

For instance, to only link to the `about` and the `portfolio` page, add the following to you `_config.yml`:

```yaml
header_pages:
  - about.md
  - portfolio.md
```

#### Icons

Add an `icon` definition to the front matter of a page to show that icon next to
the link in the navigation. For example, as depicted in `about.md`:

```yaml
layout: page
title: About
icon: fingerprint
```

Search the available icons at [https://material.io/tools/icons/](https://material.io/tools/icons/).

--

### Change default date format

You can change the default date format by specifying `site.minima.date_format`
in `_config.yml`.

```
# minimaterialize date format
# refer to http://shopify.github.io/liquid/filters/date/ if you want to customize this
minima:
  date_format: "%b %-d, %Y"
```

--

### Enabling comments (via Disqus)

Optionally, if you have a Disqus account, you can tell Jekyll to use it to show a comments section below each post.

To enable it, add the following lines to your Jekyll site:

```yaml
  disqus:
    shortname: my_disqus_shortname
```

You can find out more about Disqus' shortnames [here](https://help.disqus.com/customer/portal/articles/466208).

Comments are enabled by default and will only appear in production, i.e., `JEKYLL_ENV=production`

If you don't want to display comments for a particular post you can disable them by adding `comments: false` to that post's YAML Front Matter.

--

### Social networks

You can add links to the accounts you have on other sites, with respective icon, by adding one or more of the following options in your config:

```yaml
twitter_username: jekyllrb
github_username:  jekyll
dribbble_username: jekyll
facebook_username: jekyll
flickr_username: jekyll
instagram_username: jekyll
linkedin_username: jekyll
pinterest_username: jekyll
youtube_username: jekyll
googleplus_username: +jekyll
rss: rss

mastodon:
 - username: jekyll
   instance: example.com
 - username: jekyll2
   instance: example.com
```

--

### Enabling Google Analytics

To enable Google Analytics, add the following lines to your Jekyll site:

```yaml
  google_analytics: UA-NNNNNNNN-N
```

Google Analytics will only appear in production, i.e., `JEKYLL_ENV=production`

--

### Home Page Options

To display post-excerpts on the Home Page, simply add the following to your `_config.yml`:

```yaml
show_excerpts: true
```

The Materialize `truncate` class is used in `_layouts/home.html` to keep things
tidy. You can disable this by setting:

```yaml
truncate_excerpts: false
```

To use Materialize `.card`s for each listed post, set:

```yaml
post_cards: true
```

To use a fancy two-column layout on larger screens:

```yaml
post_columns: true
```

To use the Materialize card with image, set the following and make sure the post
has `image:` set to a relative image path in the front matter.

```yaml
post_images: true
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/sh78/minimaterialize. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

To set up your environment to develop this theme, run `script/bootstrap`.

To test your theme, run `script/server` (or `bundle exec jekyll serve`) and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme and the contents. As you make modifications, your site will regenerate and you should see the changes in the browser after a refresh.

## License

The theme is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
