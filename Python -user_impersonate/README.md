## User impersonate app

##Python 3.6+ for Django versions 2.2+

### Getting Started with impersonate APP
`cd python impersonate`

## create virtualenv
`python3 -m virtualenv venv`

## activate virtualenv
`venv/bin/activate`

## Install packages 
`pip install django`<br />
`pip install six`<br />
`pip install django-impersonate`<br />

`Add impersonate to your INSTALLED_APPS`

`IMPERSONATE_REDIRECT_URL = Your impersonate url`

`AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.AllowAllUsersModelBackend']` add your settings.py
 
## Email configration
`EMAIL_HOST = Your email host`<br />
`EMAIL_HOST_USER = Your email host user name`<br />
`EMAIL_HOST_PASSWORD = 'Your email host password`<br />
`EMAIL_PORT = Your email port`<br />

## Run migration files
 `python manage.py migrate`

### start project: 
`python manage.py runserver`



