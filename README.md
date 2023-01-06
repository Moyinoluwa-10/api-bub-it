<!-- Back to Top Navigation Anchor -->

<a name="readme-top"></a>

<!-- Project Shields -->
<div align="center">
  
  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![MIT License][license-shield]][license-url]
  [![Twitter][twitter-shield]][twitter-url]
</div>

<div>
  <p align="center">
    <a href="https://github.com/moyinoluwa-10/url-shortener-api#readme"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://api-shortener.vercel.app/">Demo</a>
    ·
    <a href="https://github.com/moyinoluwa-10/url-shortener-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/moyinoluwa-10/url-shortener-api/issues">Request Feature</a>
  </p>
</div>

<!-- About the API -->

## Shortener

&mdash; a URL Shortener API built by <a href="https://www.github.com/moyinoluwa-10">moyinoluwa</a>.

<p align="right"><a href="#readme-top">back to top</a></p>

### Built With:

<div align="center">

![Javascript][javascript]
![Node.js][node]
![Express.js][express]
![MongoDB][mongodb]

</div>

<p align="right"><a href="#readme-top">back to top</a></p>

****---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/)

#### Clone this repo

```sh
git clone https://github.com/moyinoluwa-10/url-shortener-api.git
```

#### Install project dependencies

```sh
npm install
```

or

```sh
yarn install
```

#### Update .env with [example.env](https://github.com/moyinoluwa-10/url-shortener-api/blob/main/example.env)
<br />

#### Run a development server

```sh
npm run devStart
```

or

```sh
yarn run devStart
```

#### For testing, run

```sh
npm run test
```

or

```sh
yarn run test
```

### Model

#### Url

| field     | data_type     | constraints      |
| --------- | ------------- | ---------------- |
| longUrl | string        | required  |
| shortUrl | string        | required         |
| urlCode  | string        | required         |


<p align="right"><a href="#readme-top">back to top</a></p>

---

## Usage

### Base URL

- https://api-shortener.vercel.app

### Creating a shortURL

- Route: /api/v0/url/shorten
- Method: POST

:point_down: Body

```json
{
  "longUrl": "https://example.com"
}
```

:point_down: Response

```json
{
    "status": true,
    "message": "ShortURL created successfully",
    "url": {
        "urlCode": "tYnA1ERAR",
        "longUrl": "https://example.com",
        "shortUrl": "https://api-shortener.vercel.app/tYnA1ERAR",
        "createdAt": "Fri Jan 06 2023 08:06:19 GMT+0000 (Coordinated Universal Time)",
        "_id": "63b7d67bcd7ea040027512ec",
        "__v": 0
    }
}
```

or

```json
{
    "status": true,
    "message": "ShortURL already created",
    "url": {
        "_id": "63b7d67bcd7ea040027512ec",
        "urlCode": "tYnA1ERAR",
        "longUrl": "https://example.com",
        "shortUrl": "https://api-shortener.vercel.app/tYnA1ERAR",
        "createdAt": "Fri Jan 06 2023 08:06:19 GMT+0000 (Coordinated Universal Time)",
        "__v": 0
    }
}
```

<p align="right"><a href="#readme-top">back to top</a></p>

---

## Lessons Learned

While building this project, I learned about:

- Test Driven Development
- Testing the backend using jest and supertest
- Using mongo-memory-server
- Debugging
- Documentation

<p align="right"><a href="#readme-top">back to top</a></p>

---

<!-- License -->

## License

Distributed under the MIT License. See <a href="https://github.com/moyinoluwa-10/url-shortener-api/blob/main/LICENSE.md">LICENSE</a> for more information.

<p align="right"><a href="#readme-top">back to top</a></p>

---

<!-- Contact -->

## Contact

- Twitter - [@rotii_mii](https://twitter.com/rotii_mii)
- email - [moyinadelowo@gmail.com](mailto:moyinadelowo@gmail.com)

Project Link: [URL-Shortener](https://github.com/moyinoluwa-10/url-shortener-api)

<p align="right"><a href="#readme-top">back to top</a></p>

---

<!-- Acknowledgements -->

## Acknowledgements

This project was made possible by:

- [Tobisupreme Blogolicious README Template](https://github.com/tobisupreme/blogolicious#readme)


<p align="right"><a href="#readme-top">back to top</a></p>

<!-- Markdown Links & Images -->

[contributors-shield]: https://img.shields.io/github/contributors/moyinoluwa-10/url-shortener-api.svg?style=for-the-badge
[contributors-url]: https://github.com/moyinoluwa-10/url-shortener-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/moyinoluwa-10/url-shortener-api.svg?style=for-the-badge
[forks-url]: https://github.com/tobisupreme/blogolicious/network/members
[stars-shield]: https://img.shields.io/github/stars/moyinoluwa-10/url-shortener-api.svg?style=for-the-badge
[stars-url]: https://github.com/moyinoluwa-10/url-shortener-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/moyinoluwa-10/url-shortener-api.svg?style=for-the-badge
[issues-url]: https://github.com/moyinoluwa-10/url-shortener-api/issues
[license-shield]: https://img.shields.io/github/license/moyinoluwa-10/url-shortener-api.svg?style=for-the-badge
[license-url]: https://github.com/moyinoluwa-10/url-shortener-api/blob/main/LICENSE.md
[twitter-shield]: https://img.shields.io/badge/-@rotii_mii-1ca0f1?style=for-the-badge&logo=twitter&logoColor=white&link=https://twitter.com/rotii_mii
[twitter-url]: https://twitter.com/rotii_mii
[javascript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1C
[node]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[express]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[mongodb]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
