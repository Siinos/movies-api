## The Software House - Node.js Developer recruitment task

Hey there!

Not so long ago we decided create a catalogue of our favourite movies (data/db.json) as json. It is hard to update, so we would like to build an API
for it, however we don't need a database, we still need it as a file.

### TODOS

1. We need to be able to add a new movie. Each movie should contain information about:

- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)

Each field should be properly validated and meaningful error message should be return in case of invalid value.

2. We also need an endpoint that will return an array of movies (it might be a single movie) based on few conditions. The endpoint should take 2 optional query parameters:

- duration
- an array of genres

If we don't provide any parameter, then it should return a single random movie.

If we provide only duration parameter, then it should return a single random movie that has a runtime between <duration - 10> and <duration + 10>.

If we provide only genres parameter, then it should return all movies that contain at least one of the specified genres. Also movies should be orderd by a number of genres that match. For example if we send a request with genres [Comedy, Fantasy, Crime] then the top hits should be movies that have all three of them, then there should be movies that have one of [Comedy, Fantasy], [comedy, crime], [Fantasy, Crime] and then those with Comedy only, Fantasy only and Crime only.

And the last one. If we provide both duration and genres parameter, then we should get the same result as for genres parameter only, but narrowed by a runtime. So we should return only those movies that contain at least one of the specified genres and have a runtime between <duration - 10> and <duration + 10>.

In any of those cases we don't want to have duplicates.

### Rules

**Use express.js**

**Keep code clean**

**The code should be unit tested**

**Remember about proper error handling**

**We require code in git repository**

---

## Postman api tests

In main directoty, there is a movies-api.postman_collection.json file which you can import as a new collection in Postman installed on your machine. This file contains all most important requests required to manual API testing.

!! correct way of sending genres in query params is: "?genres=Animation&genres=Comedy" etc.

## Running application

You can run application in two ways. First one is recommended for development using npm and node.js installed locally on your machine. Second one is recommended for production and it works using Docker.

### Local environment

1. Copy .env.example in .env and optionally update standard configuration if you want.
2. Run `npm install`.
3. Run `npm start`.

### Production environment
1. Copy .env.example in .env and optionally update standard configuration if you want.
2. Run `docker-compose up --build -d`.
