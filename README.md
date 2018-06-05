# kvfetch

A _very_, _very_ simple persistent key/value store with an HTTP interface.

## Quick Start

Requires at least `node@8.1.2` with associated `npm` or better yet, `yarn`.

Clone the repository, then run the following to install dependencies.

```
$ yarn install
$ yarn start
```

Note that running `yarn start` will bring up a `sudo` prompt - this is because port 80 requires elevated privileges to bind to.

## Usage

Get a value out of the store with a key named "foo" - will return 404 if it does not exist
```
$ curl -i http://localhost/foo
```

Add a value to the store with a key named "foo" - will return 412 if the key already exists in the store.
```
curl -i -X PUT -d value=Bar http://localhost/foo
```

Update a value in the store with a key named "foo" by passing the "If-Match" header with the current version of the key
```
$ curl -i http://localhost/foo
HTTP/1.1 200 OK
X-Powered-By: Express
ETag: W/"1"
Content-Type: text/html; charset=utf-8
Content-Length: 3
Date: Tue, 05 Jun 2018 20:15:18 GMT
Connection: keep-alive

Bar
```

Grab the value of the `ETag` header from the response (in this case `W/"1"`) and then...
```
$ curl -i -X PUT -H 'if-match: W/\"1\"' -d value=Biff http://localhost/foo
```

If another user has updated the same key before your request is sent, a 412 response will be returned, otherwise you will get a 200 response.

## Testing

You can run unit tests and optional coverage with the following:

```
$ yarn test           # just run the tests
$ yarn test:coverage  # tests with coverage report
```

## Rebuild from source

If you modify anything under the `src` directory, you can manually rebuild the contents of `lib` by running the following:

```
$ yarn build
```

## Ephemera

This codebase went through several false starts due to internal struggle about how to cope with concurrent reads/writes within the node language.

Ultimately, I went with a simple in-memory Object as the store (persisted to a flat file on process exit) and guarded the possibility of concurrent writes against the ETag + If-Match HTTP headers.

Additionally, concurrent reads was _never_ actually an issue, but still I had moments of panic about how to handle it until I realised I shouldn't actually care too much.

Here's some of the reference material I used during development:
- [RESTful HTTP: concurrency control with optimistic locking](http://scriptin.github.io/2014-08-30/restful-http-concurrency-optimistic-locking.html)
- [Lost Update Problem](https://www.w3.org/1999/04/Editing/)

The following is a list of libraries that are or were involved in this project, along with reasons behind their inclusion/removal.

- `express`
  - _could_ have just gone with plain `http.createServer`, but realised I would have to essentially replicate the bulk of the functionality that `express` comes with and therefore would be a waste of time.
- ~~`body-parser`~~
  - Totally forgot that express 4 has their own built-in "replication" of the functionality provided by `body-parser`, so why bring in an external runtime dependency that is already extant within the core `express` codebase.
- `flat-cache`
  - Currently living on thin ice. The immediate benefit for its use is to ensure a cache file _will_ exist if it does not, but essentially the code within the library itself serves mostly as mostly-good wrapping up of various `path` functions to ensure that a cache object and file _will_ safely be brought into existence regardless of the situation.
- ~~`nssocket`~~
  - dumped in favour of using plain HTTP request/response as protocol.
- ~~`locks`~~
  - dumped after philosophical self-argument determined that adding locking against an in-memory object would be essentially pointless and would serve only to complicate matters and/or gild the lily.
