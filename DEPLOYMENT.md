# Docker Compose deployment

The image contains the production standalone Next.js server and runs as UID 1000.
Requires Docker Engine and Compose 2.24 or later. Nginx remains the host's TLS proxy;
the app is published only on loopback, at port 3001 by default.

```sh
docker compose build
docker compose up -d --wait
docker compose ps
docker compose logs --tail=100 app
```

Keep runtime secrets in an untracked `.env` file, or set `APP_ENV_FILE` to an absolute
path. Environment files, databases, exports, and Git metadata are excluded from the
image build context. Never commit credentials. Set `APP_IMAGE` to an immutable
release tag when deploying; use `APP_PORT` to test a candidate on a spare port.

## Migrating the existing Debian service

1. Build and test the candidate on a spare loopback port using a separate Compose
   project name. Preserve the current checkout and PM2 process `tesla` for rollback.
2. Back up persistent data and prepare any bind-mount directories before cutover.
3. Stop PM2 process `tesla`, then start Compose on port 3001 with `--wait`.
4. Verify the public site and application-specific routes. If verification fails,
   stop the Compose app and restart the original PM2 process.
5. Keep a backup of the PM2 dump, remove the successfully migrated process with
   `pm2 delete`, then run `pm2 save --force` so reboot cannot launch a duplicate.
   Future releases use Compose.

Docker's restart policy handles process exits and host restarts. A healthcheck
reports unhealthy containers; it does not itself restart a hung process.
Container rollback also requires a compatible database schema; this deployment
does not automatically apply schema migrations or run seeds.
