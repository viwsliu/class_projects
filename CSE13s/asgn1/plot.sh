#!/bin/bash

make clean && make monte_carlo 
./monte_carlo -n 1000 -r 1 > /tmp/monte_carlo_0.dat
./monte_carlo -n 1000 -r 2 > /tmp/monte_carlo_1.dat
./monte_carlo -n 1000 -r 3 > /tmp/monte_carlo_2.dat
./monte_carlo -n 1000 -r 4 > /tmp/monte_carlo_3.dat
./monte_carlo -n 1000 -r 5 > /tmp/monte_carlo_4.dat

# This is the here - document that is sent to gnuplot .
gnuplot <<END
set terminal pdf
set output "monte_carlo_.pdf"
set title "First graph"
set xlabel "x"
set ylabel "y"
set zeroaxis
set pointsize 1 
set key off 
set palette model RGB defined (0 "red",1 "blue")
unset colorbox
plot "/tmp/monte_carlo_0.dat" using 3:4:5 with points linecolor palette, sqrt(1-(x*x)) with lines 
set title "Monte Carlo Error Estimation"
set xlabel "Samples"
set ylabel "Error"
plot[0:1000][-1:1] "/tmp/monte_carlo_0.dat" using 1:(3.141592653589793238462643383279502884197-\$2) with lines linecolor "red", "/tmp/monte_carlo_1.dat" using 1:(3.141592653589793238462643383279502884197-\$2) with lines linecolor "orange", "/tmp/monte_carlo_2.dat" using 1:(3.141592653589793238462643383279502884197-\$2) with lines linecolor "yellow", "/tmp/monte_carlo_3.dat" using 1:(3.141592653589793238462643383279502884197-\$2) with lines linecolor "green", "/tmp/monte_carlo_4.dat" using 1:(3.141592653589793238462643383279502884197-\$2) with lines linecolor "blue"
END
