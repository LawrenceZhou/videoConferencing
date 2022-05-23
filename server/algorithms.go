package main

import (
	"math/rand"
	"time"
)

func shuffle(slice []int, length int) []int {
	r := rand.New(rand.NewSource(time.Now().Unix()))
	ret := make([]int, length)
	
	for i := 0; i < length; i++ {
		randIndex := r.Intn(len(slice))
		ret[i] = slice[randIndex]
		slice = append(slice[:randIndex], slice[randIndex+1:]...)
  	}

  	return ret
}


func makeRange(min, max int) []int {
	a := make([]int, max - min + 1)
	for i := range a {
		a[i] = min + i
	}
	return a
}