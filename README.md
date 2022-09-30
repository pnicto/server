# yet another todo backend
Just another todo app built with Node, Express.

## TODO

- [] Priorities for tasks
- [] Dragging and dropping lists b/w boards or in same board
- [] Sorting tasks in list

## How to run

1. Clone both [client](https://github.com/pnicto/yet-another-todo-frontend) and [server](https://github.com/pnicto/yet-another-todo-backend) repos.
2. Install node_modules in respective folders using `npm i`.
3. Have [PostgreSQL](https://www.postgresql.org/). Visit prisma docs for DATABASE_URL
4. Rename `.env.temp` to `.env` and add the required values.
5. Run `npx tsc` to build.
6. Run `npm run dev` to start.