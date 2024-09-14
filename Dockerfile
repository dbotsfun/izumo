# ================ #
#    Base Stage    #
# ================ #

FROM node:20.17.0-alpine@sha256:2d07db07a2df6830718ae2a47db6fedce6745f5bcd174c398f2acdda90a11c03 as base

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
