<<<<<<< HEAD
test read me
=======
# OptiWave.Cloud

#### Cloud Monitoring and Optimization Tool

<p>Building a multi-cloud multi-account cloud monitoring tool with cost optimization using AI.</p>

### <span style="color:red">IMPORTANT: </span><span style="color:blue">VSCode Extension</span>(To see UI for any md file)

- Install [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)
- To run above extension, right click on any `*.md` file, and click on `Markdown Preview Enhanced: Open Preview to the Side`

#### Documents Updates

| Version | Create         | Update         |
| :------ | :------------- | :------------- |
| `0.0.3` | `Sep 21, 2023` | `Feb 14, 2024` |

##### <span style="color:red">IMPORTANT: </span> When ever you update this document, change the <span style="color:green">update date</span> and <span style="color:green">version</span>

## Environment

To run this project, you will need to add have

| Environment | Version                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| Node.js     | [Node.js](https://nodejs.org/) v18.17.\*                                   |
| npm         | [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) v9.7.\* |
| Python 3    | [python](https://www.python.org/downloads/) v3.10.\*                       |

## Documentation

**Client:** React, Redux, MaterialUI

**Server:** Node.js(Express), MySQL, Python3

The [client directory](./client) consist of the front-end code.

#### Front-end tech stack

- ReactJS v17
- MaterialUI v5
- Redux v5

The [api directory](./api) consist of the back-end code.

#### Backend-end tech stack

- Express v4 (Server and APIs)
- Python3 (Running Pandas & Pyarrow)
- Pyarrow (Extract data from Parquet file)
- Pandas (Reading and extracting meaningful data from Parquet file)

## Run Locally

Clone the project (via HTTP)

```bash
  git clone --single-branch -b development http://gitlab.valuebound.net/product/cloud-optimization-tool.git
```

Clone the project (via SSH)

```bash
  git clone --single-branch -b development git@gitlab.valuebound.net:product/cloud-optimization-tool.git
```

Go to the project directory

```bash
  For front-end:
  cd cloud-optimization-tool/client
```

```bash
  For backed-end:
  cd cloud-optimization-tool/api
```

Install dependencies(for front-end)

```bash
  npm install or yarn
```

Install dependencies(for back-end)

```bash
  npm install
```

Start the app(for front-end) Local

```bash
  1) Create .env.local for LOCAL DEVELOPEMENT from .env.local.sample
  2) npm run start or yarn start
```

Start the server(for back-end) Local

```bash
  1) Create .env.local for LOCAL DEVELOPEMENT from .env.local.sample
  2) npm run start
```

Run unit tests(for front-end)

```bash
  npm run test
```

#### Project Contributors

| Name                                                       | Email                        |
| :--------------------------------------------------------- | :--------------------------- |
| [Suyash Katoch](https://www.linkedin.com/in/suyashkatoch/) | <suyash.k@valuebound.com>    |
| [Thanuja Aalavala]()                                       | <thanuja.a@valuebound.com>   |
| [Sam Sharan]()                                             | <sam.sharan@valuebound.com>  |
| [Aryan Singh]()                                            | <aryansingh@valuebound.com>  |
| [Vaibhav Jha]()                                            | <vaibhav.jha@valuebound.com> |
| [Yusuf Shekh](https://www.linkedin.com/in/yusuf-shekh/)    | <yusuf.s@valuebound.com>     |

>>>>>>> 03aa059 (updated repo)
