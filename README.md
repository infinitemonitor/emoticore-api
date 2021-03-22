# Emoticore API
An experimental API for [Emoticore](https://github.com/infinitemonitor/emoticore). Mostly just a way for me to practice Express, but on the off-chance that it ends up being useful, I've uploaded it here.

# Config
Make sure to check the config to set up SQL. You can also modify the ratelimit if you'd like.

# Dependencies
- express
- mysql

# /api/User
Returns a user.
- id - The user's Discord ID

# /api/Emote
Returns an emote.
- id - The emote's Discord ID

# /api/RandomUser
Returns some random users.
- limit - The amount of users to return. Acceptable values: 1-25

# /api/RandomEmote
Returns some random emotes.
- limit - The amount of emotes to return. Acceptable values: 1-25