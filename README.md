# Automatic OAuth Example App

This is a node.js app that demonstrates how to authenticate with [Automatic](http://automatic.com) using OAuth. It demonstrates the use of the [Automatic REST API](http://developer.automatic.com).

## Demo

A demo version of this application is available at [http://automatic-oauth-example-nodejs.herokuapp.com/](http://automatic-oauth-example-nodejs.herokuapp.com/).

## One-Click deploy to Heroku

Click this button to instantly deploy this app to Heroku. You'll need an [Automatic client ID and secret](http://developer.automatic.com).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

After deploying, you will need to use the Automatic [Developer Apps Manager](https://developer.automatic.com/my-apps/) to set your application's redirect URL to match the Heroku app name you selected when deploying. For instance, if you name your app `oauth-test` in Heroku your redirect URL should be `https://oauth-test.herokuapp.com/redirect`. Note that the URL must start with `https`.

## Running Locally

### Prerequisites

Install node.js

    brew install node

### Install required modules

    npm install

### Configure your client id and client secret

Add your Automatic client id and client secret to `app.js` or as environment variables named `AUTOMATIC_CLIENT_ID`, `AUTOMATIC_CLIENT_SECRET`.

### Run the app

    npm start

### View the app

Open `localhost:3000` in your browser.

### Deploy to Heroku

If you have the [heroku toolbelt](https://toolbelt.heroku.com/) installed, you can create, configure and deploy this app to Heroku.  To create an app:

    heroku create

If you already created an app, add it as a git remote:

    git remote add heroku YOUR-HEROKU-GIT-URL

Configure the heroku app's environment variables:

    heroku config:add AUTOMATIC_CLIENT_ID="YOUR AUTOMATIC CLIENT ID"
    heroku config:add AUTOMATIC_CLIENT_SECRET="YOUR AUTOMATIC CLIENT SECRET"

Deploy your app to heroku:

    git push heroku master

See [deploying a node.js app](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) for more information.

### Support

Please write to developer@automatic.com if you have any questions or need help.

## License

This project is licensed under the terms of the Apache 2.0 license.
