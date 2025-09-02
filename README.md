



# Hallo ihr komischen,
## Dies ist das Git Directory von Transient wiki

Kolscha war auch hier :>

## GitHub Pages Deployment

Dieses Repository enthält einen GitHub Actions Workflow, der den Inhalt des Ordners `public` auf GitHub Pages veröffentlicht.

### Anleitung

1. Push das Repo zu GitHub.
2. Öffne in GitHub **Settings → Pages** und wähle **GitHub Actions** als Quelle.
3. Bei jedem Push auf den `main`‑Branch läuft `.github/workflows/static.yml` und deployed den `public` Ordner.
4. Die Website ist danach unter `https://<username>.github.io/<repository>/` erreichbar.

Wenn dein Hauptbranch anders heißt, passe den Branchnamen in `.github/workflows/static.yml` an.

