# Pathtrek
> Node.js web application project where a community of users can register, explore, upload and comment on UNESCO World Heritage sites around the world.

## Live Demo

To view the app, go to [https://pathtrek.herokuapp.com/](https://pathtrek.herokuapp.com/)
> You can enter the following credentials to test drive the app with its full features:
  * Username: rafid
  * Email: rafid@rafid.com
  * Password: rafid

## Getting Started

> This app contains API keys, secrets and passwords that have been hidden intentially therefore, the app cannot be run with its full features on your local machine unless you provide you own API keys.

### Clone or download this repository

```sh
git clone https://github.com/rafid416/Pathtrek.git
```

### Install dependencies

```sh
npm install
```

### Run the app on your local machine

```sh
npm start  then proceed to http://localhost:8080/ on your local browser
```

## Features

* Authentication and Authorization:
  
  * Users can register and login with username, email and password

  * Users need to be logged in to manage posts and interact with the app

  * Users cannot edit or delete posts and comments created by other users

* Destination post functionalities:

  * Create, edit and delete posts and comments

  * Upload and update destination photos

  * Display destination location on Google Maps

* Manage user account:

  * Profile page setup with sign-up
  
  * Edit username and email on profile page

* Flash messages responding to users interaction with the app

* Responsive and mobile friendly web design 


## Built with

### Front-end

* HTML5
* Ejs
* Google Maps APIs
* Jquery
* CSS3/Bootstrap

### Back-end

* node.js
* express.js
* mongoDB
* passport.js
* nodemailer
* moment.js
* API integration
* cloudinary
* geocoder
* connect-flash

### Platforms

* Cloudinary
* Heroku
