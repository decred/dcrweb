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

	const dir = "."
	const baseLang = "en.json"

	var baseFile txFile
	files := make(map[string]txFile)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("filepath.Walk err: %v", err)
		}

		if info.IsDir() ||
			info.Name() == "translator.html" ||
			info.Name() == "main.go" ||
			info.Name() == "README.md" {
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
	log.Printf("en.json contains %d strings", len(baseFile))

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
