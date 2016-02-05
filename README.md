# API Operations

A lightweight (2kb minified) library for simple RESTful API operations that leverages ```fetch```.

## Features
- Uses the [fetch standard](https://fetch.spec.whatwg.org) so it returns promises and keeps things idiomatic
- Minimal yet poweful API
- Automatic parsing for JSON data, fallsback to plain text
- Standardized errors
- Rejects on ```response.status < 200 && response.status > 300``` by default, but you can configure the range to your needs
