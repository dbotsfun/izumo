# ================ #
#    Base Stage    #
# ================ #

FROM node:20-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app

RUN apk add --no-cache dumb-init

COPY --chown=node:node package.json .
COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node patches/ patches/

RUN corepack enable
RUN sed -i 's/"postinstall": "pnpm lefthook install"/"postinstall": ""/' ./package.json

ENTRYPOINT ["dumb-init", "--"]

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.build.json .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node src/ src/
COPY --chown=node:node .swcrc .
COPY --chown=node:node nest-cli.json .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

# ================ #
#   Runner Stage   #
# ================ #

FROM base as runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps"

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/dist dist

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN chown node:node /usr/src/app/

USER node

# EXPOSE ${API_PORT}

CMD ["pnpm", "start:prod"]
