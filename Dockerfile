# ================ #
#    Base Stage    #
# ================ #

FROM node:22-alpine@sha256:fc95a044b87e95507c60c1f8c829e5d98ddf46401034932499db370c494ef0ff as base

WORKDIR /usr/src/app


# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder


# ================ #
#   Runner Stage   #
# ================ #

FROM base as runner


USER node

# EXPOSE ${API_PORT}

# CMD ["pnpm", "start:prod"]
