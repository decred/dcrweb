# dcrweb Translations

## Updating translation strings with `translator.html`

[`translator.html`](./translator.html) is a GUI tool to update translations.

- Checkout dcrweb repo
- Create a branch to do your work in
- Open `transifex_catalogs/translator.html` in a browser
- Load `en.json` as the base file, and then the `.json` file for your language as the second file
- The panel on the left displays untranslated strings. Click the top one to load it into the right panel.
- Translate the string
- Hit "Save & next"
- When finished, hit export translation to download the new `.json` file for your language.
- Overwrite the existing file with the new file, and create a pull request from your branch to master

## Validating translation files

In this directory is a go file which checks translation files for strings in
i18n files which do not exist in the base English file.

```no-highlight
go run main.go
```
