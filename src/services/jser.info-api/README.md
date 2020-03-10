# JSer.info API

https://github.com/jser/jser.info/ + [asocial-bookmark](https://github.com/azu/asocial-bookmark)

## Custom consumer

Add `consumer.json` into current dir.

You should put [asocial-bookmark](https://github.com/azu/asocial-bookmark) Option to `consumer.json`:

```json
{
  "github": {
    "owner": "jser",
    "repo": "jser.info",
    "ref": "refs/gh-pages",
    "GH_TOKEN": "xxxx",
    "indexPropertyName": "list"
  }
}
```

