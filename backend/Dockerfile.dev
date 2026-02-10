FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpq-dev libpng-dev libonig-dev libxml2-dev

# Install PHP extensions including PostgreSQL driver
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
