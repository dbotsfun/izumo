# ================ #
#    Base Stage    #
# ================ #

FROM node:20-alpine as base

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
