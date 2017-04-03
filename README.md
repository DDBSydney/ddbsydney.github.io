# DDB Website

This site is built with a combination of three different techs:

- [GitHub Pages](https://pages.github.com/) using [Jekyll](https://jekyllrb.com/) (static website generator)
- [CircleCI](https://circleci.com/) (Intermediary build manager)
- [Gulp](http://gulpjs.com/) (Intermediary build manager)
- [Prismic.io](https://prismic.io/) (data generator)

Jekyll is used to generate a standard static website and focuses on compiling the html files.
Gulp is used to compile and bundle the other assets together such as js, sass, images etc.

Prismic is used to generate data that the website uses. Devs can manage the data types, forms and validation, while non-devs can easily create data with said forms, ready to be exported.

CircleCI is used to merge these two techs together. When data is published on Prismic, or when GitHub recieves a push, a webhook is triggered on CircleCI - this makes CircleCI pull the repo down from GitHub, pull the data from Prismic, then commit and push the repo back up to GitHub.

GitHub will automatically "build" whatever Jekyll project is in the __master__ branch and host it as a static website. Github will also simply host whatever HTML files it finds in the master branch.

Therefore, these three main tech bundles work together to create a psuedo-CMS in a static website. This allows non-devs to "update" the website's information without needing any help from the dev team.

An article for this process is available [here at Contentful](https://www.contentful.com/developers/docs/ruby/tutorials/automated-rebuild-and-deploy-with-circleci-and-webhooks/) (we've since changed to Prismic, but the process remains the same).

## Installing Node, Bower and Gulp

Install the latest **LTS** version of node which can be found [here](https://nodejs.org/en/). ( which was **6.9.1** at the time of writing this document ). Once node in installed on your machine, open the terminal (or) command prompt and run **npm install -g bower** to install bower and then run **npm install -g gulp** to install gulp.

## Unable to connect to github.com:

If you see this issue on your machine, then you **might not have git installed**. You can download and install git from [here](https://git-scm.com/downloads). If the issue still persists after installation, then you might be behind an internet firewall, especially if your in the office. Open the terminal (or) command prompt, and run **git config --global url."https://".insteadOf git://**, which will make git replace it's default protocol for connecting to it's server, and you should be good to go now.

## Setup

- Install Ruby (eg with [RVM](https://rvm.io/))
- In the repo, install Ruby stuff with **bundle install**

Everything else should work fine (unless you're on Windows)

## Dev Cycle
- Run **bower install** and **npm install** in the project's root folder.
- Use **ruby data_importer.rb** to GET content data from Prismic.io
- Use **bundle exec jekyll serve** to start a localhost watcher for html files and the server (this can be accessed at **http://127.0.0.1:4000/**)
- Use **gulp** to start watches to listen for changes to js and sass files. All assets are contained within **_assets_src**, and get compiled and pushed to **assets**. Jekyll will detect this change and regenerate the html files as necessary, and copies over the assets into **_site/assets**.
- Use **bundle exec jekyll build** to manually build a copy of the website (this will be compiled into /_site/)
- The default mode for gulp is development, which will not minify or strip source files. Before merging your code into the **gh-pages-ci** branch run **gulp deploy**. This will also kill all watchers.

Note that GitHub pages will automatically take whatever is in the **master** branch, compile it with Jekyll (if possible/required), and then host it - this means that as a developer:

- You should _never_ be making changes in the **master** branch, ever
- Once your stuff is feature complete, merge it into the **gh-pages-ci** branch and push it up (this will trigger a rebuild on the site)

## Non-Dev Cycle

- Log on to [prismic.io](https://prismic.io/)
- Modify data as you like
- Any time you **publish** or **unpublish** something, you will trigger a build on the site

Note that if you publish many things in quick succession, you will trigger multiple builds that will be queued up and eventually processed over time.

The current round-time for an update is about five minutes.
