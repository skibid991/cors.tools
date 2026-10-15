package main

import (
	"context"
	"fmt"
	clientpkg "github.com/skibid991/cors.tools/sdk/go"
	"log"
)

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
func main() {
	ctx := context.Background()
	client := clientpkg.New()
	r, err := client.Read(ctx, "https://example.com/", map[string]any{"format": "markdown"})
	must(err)
	fmt.Println(r.Text())
}
