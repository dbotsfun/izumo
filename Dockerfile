# ================ #
#    Base Stage    #
# ================ #

FROM node:22-alpine@sha256:f265794478aa0b1a23d85a492c8311ed795bc527c3fe7e43453b3c872dcd71a3 as base

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
