FROM node:20-alpine AS builder

# Declaring env
#ENV REACT_APP_STATE production

# Setting up the work directory
WORKDIR /app

# Declare build-time variables
ARG REACT_APP_API_URL_PREFIX
ARG REACT_APP_IMAGE_PREFIX
ARG REACT_APP_LIVE_STREAM_PREFIX
ARG REACT_APP_STATE

# Export them as envs so React can use them at build time
ENV REACT_APP_API_URL_PREFIX=$REACT_APP_API_URL_PREFIX
ENV REACT_APP_IMAGE_PREFIX=$REACT_APP_IMAGE_PREFIX
ENV REACT_APP_LIVE_STREAM_PREFIX=$REACT_APP_LIVE_STREAM_PREFIX
ENV REACT_APP_STATE=$REACT_APP_STATE

# Dependencies
COPY package.json ./
RUN npm install

# Copy app files
COPY . .

# Debug: Print what we are building with
RUN echo "Building React with:"
RUN echo $REACT_APP_API_URL_PREFIX
RUN echo $REACT_APP_IMAGE_PREFIX
RUN echo $REACT_APP_LIVE_STREAM_PREFIX
RUN echo $REACT_APP_STATE

# Build React
RUN npm run build


# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# COPY --from=builder /app/.env /

# Copying our nginx.conf
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

