# Cloudflare Lab

A small, independent experiment demonstrating GitHub-connected Cloudflare Pages hosting.

## Website

https://public-8zr.pages.dev/

## Deployment

- Source: `jtmi-cloud/Public`, branch `main`
- Cloudflare Pages project: `public`
- Plain static site in the repository root (`index.html`)
- No build command or framework required
- Cloudflare is configured to deploy commits to `main` automatically

The site includes an animated visual and a day/night toggle. This repository is not connected to any production JTMi systems.

## Verification

This README commit was intentionally added after the initial Pages deployment to verify that GitHub commits trigger new deployments. It should not change the appearance of the site.
