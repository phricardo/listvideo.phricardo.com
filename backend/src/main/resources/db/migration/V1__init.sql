-- Base schema bootstrap

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar TEXT,
  is_account_activated BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified_account BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  ip_address VARCHAR(255)
);

CREATE TABLE users_password_reset_token (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  expiry_date TIMESTAMP,
  last_password_reset_date TIMESTAMP,
  ip_address VARCHAR(255),
  password_changed BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_users_password_reset_token_user FOREIGN KEY (username) REFERENCES users (username)
);

CREATE TABLE certificates (
  id BIGSERIAL PRIMARY KEY,
  certificate_id VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  playlist_id VARCHAR(255) NOT NULL,
  duration_in_seconds INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_certificates_user FOREIGN KEY (username) REFERENCES users (username)
);

