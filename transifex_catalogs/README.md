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

Below is some example code to review existing translation files for errors.
This code only checks for keys in non-base files which do not exist in the base
file, but it can easily be expanded to add other checks.

```go
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
)

type txFile map[string]string

func (file txFile) containsKey(key string) bool {
	_, ok := file[key]
	return ok
}

func main() {
	log.SetFlags(0)

	const dir = "transifex_catalogs"
	const baseLang = "en.json"

	var baseFile txFile
	files := make(map[string]txFile)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("filepath.Walk err: %v", err)
		}

		if info.IsDir() ||
			info.Name() == "translator.html" {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return fmt.Errorf("os.Open err: %v", err)
		}
		defer file.Close()

		bytes, err := io.ReadAll(file)
		if err != nil {
			return fmt.Errorf("io.ReadAll err: %v", err)
		}

		var parsed txFile
		err = json.Unmarshal(bytes, &parsed)
		if err != nil {
			return fmt.Errorf("json.Unmarshal err: %v", err)
		}

		if info.Name() == baseLang {
			baseFile = parsed
		} else {
			files[info.Name()] = parsed
		}

		return nil
	})
	if err != nil {
		log.Printf("filepath.Walk err: %v", err)
		os.Exit(1)
	}

	log.Printf("Loaded %d files", len(files))
	log.Printf("Base lang contains %d strings", len(baseFile))

	var fail bool

	// Check for unnecessary keys in non-base files.
	for fileName, file := range files {
		for key := range file {
			if !baseFile.containsKey(key) {
				log.Printf("%s: unnecessary key: %q",
					fileName, key)
				fail = true
			}
		}
	}

	if fail {
		os.Exit(1)
	}
}
```
