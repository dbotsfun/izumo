# Izumo
<a href="https://azurlane.koumakan.jp/wiki/Izumo"><img align='right' src="https://azurlane.netojuu.com/images/8/87/IzumoShipyardIcon.png" width="230"></a>
> Izumo is an API designed for managing a list of Discord bots. It provides queries for retrieving information about bots, their owners, tags, votes, webhooks, and more.

## Features

- **Bots Management:** Retrieve information about bots, update their details, and delete bots.
- **Bot Owners:** Get details about bot owners, including their biography and owned bots.
- **Bot Tags:** Create and retrieve tags associated with bots.
- **Votes:** View votes for bots and check if a user can vote for a bot.
- **Webhooks:** Create, update, and delete webhooks for bot events.
- **Sessions:** Create and manage user sessions for authentication.
- **Vanity URLs:** Create and retrieve vanity URLs for users and bots.

## Stack

Izumo is built using the following technologies:

- **TypeScript:** A statically typed superset of JavaScript that compiles to plain JavaScript.
- **NestJS:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **GraphQL:** A query language for APIs and a runtime for executing those queries.
- **PostgreSQL:** A powerful, open-source relational database system.
- **Drizzle-ORM:** A TypeScript-first Object-Relational Mapping (ORM) library for Node.js and TypeScript.

## GraphQL Schema

The Izumo API follows a GraphQL schema to define its operations and data types. Here's an overview of the schema:

- **Bots:** Retrieve information about bots, including their ID, name, description, status, and more.
- **Bot Owners:** Get details about bot owners, such as their ID, username, bio, and owned bots.
- **Bot Tags:** Create and retrieve tags associated with bots.
- **Votes:** View votes for bots and check if a user can vote for a bot.
- **Webhooks:** Create, update, and delete webhooks for bot events.
- **Sessions:** Create and manage user sessions for authentication.
- **Vanity URLs:** Create and retrieve vanity URLs for users and bots.

## Usage

To use Izumo, you can interact with its GraphQL endpoints using tools like GraphiQL or Apollo Client. Ensure that you have the necessary permissions and authentication tokens to access the API's functionalities.

## Getting Started

To get started with Izumo, follow these steps:

1. Clone the repository.
2. Install dependencies using `pnpm install`.
3. Set up your PostgreSQL database and configure the connection in the application.
4. Create a `.env` file in the root directory of the project and define the following environment variables:

    ```plaintext
	# Misc
    NODE_ENV=
    API_PORT=
    INTERNAL_KEY=
    MS_WEBHOOK_URL=

	# Database
    DATABASE_URL=

	# JWT secrets
    JWT_SECRET_KEY=
    JWT_REFRESH_SECRET_KEY=
    JWT_APIKEY_SECRET_KEY=

	# Discord stuff
	DISCORD_CLIENT_ID=
    DISCORD_CLIENT_SECRET=
    DISCORD_REDIRECT_URI=
    DISCORD_USER_TOKEN=

    # Throttling
    THROTTLE_TTL=1800000
    THROTTLE_LIMIT=100
    THROTTLE_RESOURCE_LIMIT=60
    THROTTLE_RESOURCE_TTL=1800000
    ```
5. Start the server using `pnpm start:dev`.
6. Access the GraphQL playground to explore and interact with the API queries.

## Contributing

Contributions to Izumo are welcome! If you find any bugs or want to suggest new features, feel free to open an issue or submit a pull request. Please ensure that your contributions align with the project's coding standards and follow the guidelines outlined in the CONTRIBUTING.md file.

## License

Izumo API is open-source software licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the software as per the terms of the license.
