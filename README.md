# Carelink

Carelink is a caretaker website designed to organize all resources needed to ensure client safety.

## Installation

Carelink requires [Node.js](https://nodejs.org/) v24+ to run.

### Installation (Fast way)

Install dependencies:

```sh
npm install
```

or

```sh
npm i
```

Run the development Server:

```sh
npm run dev
```

Copy: (keys can be found on jira backlog)

```sh
cp .env.example .env.local
```

Open the URL shown in terminal

Run Test cases:

```sh
npm run test
```

### Installation (If fast way doesn't work)

Install dependencies:

```sh
npm i
npm i bootstrap@5.3.8
npm i react-router-dom
```

Installing database:

```sh
npm install @supabase/supabase-js
```

[Vitest](https://vitest.dev/) is required to run Test units

To install test unit dependencies:

```sh
npm i -D vitest
npm i -D jsdom @testing-library/react @testing-library/jest-dom
npm i -D vitest @testing-library/react @testing-library/jest-dom
```
