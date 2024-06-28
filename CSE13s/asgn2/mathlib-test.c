#include "mathlib.h"

#include <errno.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#define OPTIONS "aebmrvnsh"
/*prints synopsis upon error*/
void usage(char *exec) {
    fprintf(stderr,
        "SYNOPSIS\n"
        "   A test harness for the small numerical library.\n"
        "\n"
        "USAGE\n"
        "   %s [-aebmrvnsh]\n"
        "\n"
        "OPTIONS\n"
        "  -a  Runs all tests \n"
        "  -e  Runs e test\n"
        "  -b  Runs BBP pi test\n"
        "  -m  Runs Madhava pi test\n"
        "  -r  Runs Euler pi test\n"
        "  -v  Runs Viete pi test\n"
        "  -n  Runs Newton square root test\n"
        "  -s  Print verbose statistics\n"
        "  -h  Display program synopsis and usage\n",
        exec);
}
/*determines what to print upon recieving arguments*/
int main(int argc, char **argv) {
    int opt = 0;
    if (argc == 1) {
        usage(argv[0]);
        return EXIT_FAILURE;
    }
    bool run_test_e = false;
    bool run_test_b = false;
    bool run_test_m = false;
    bool run_test_r = false;
    bool run_test_v = false;
    bool run_test_n = false;
    bool run_test_s = false;
    bool run_test_h = false;
    while ((opt = getopt(argc, argv, OPTIONS)) != -1) {
        switch (opt) {
        case 'a':
            run_test_e = true;
            run_test_b = true;
            run_test_m = true;
            run_test_r = true;
            run_test_v = true;
            run_test_n = true;
            break;
        case 'e': run_test_e = true; break;
        case 'b': run_test_b = true; break;
        case 'm': run_test_m = true; break;
        case 'v': run_test_v = true; break;
        case 'r': run_test_r = true; break;
        case 'n': run_test_n = true; break;
        case 's': run_test_s = true; break;
        case 'h': run_test_h = true; break;
        default:
            usage(argv[0]); /* Invalid options, show usage */
            return EXIT_FAILURE;
        }
    }
    if (run_test_e && run_test_s == false && run_test_h == false) {
        printf("e() = %.15f,", e());
        printf(" M_E = %.15f,", M_E);
        printf(" diff = %.15f\n", absolute(M_E - e()));
    }
    if (run_test_r && run_test_s == false && run_test_h == false) {
        printf("pi_euler() = %.15f,", pi_euler());
        printf(" M_PI =  %.15f,", M_PI);
        printf(" diff = %.15f\n", absolute(M_PI - pi_euler()));
    }
    if (run_test_b && run_test_s == false && run_test_h == false) {
        printf("pi_bbp() = %.15f,", pi_bbp());
        printf(" M_PI =  %.15f,", M_PI);
        printf(" diff = %.15f\n", absolute(M_PI - pi_bbp()));
    }
    if (run_test_m && run_test_s == false && run_test_h == false) {
        printf("pi_madhava() = %.15f,", pi_madhava());
        printf(" M_PI =  %.15f,", M_PI);
        printf(" diff = %.15f\n", absolute(M_PI - pi_madhava()));
    }
    if (run_test_v && run_test_s == false && run_test_h == false) {
        printf("pi_viete() = %.15f,", pi_viete());
        printf(" M_PI =  %.15f,", M_PI);
        printf(" diff = %.15f\n", absolute(M_PI - pi_viete()));
    }
    if (run_test_n && run_test_s == false && run_test_h == false) {
        for (double i = 0.0; i <= 10; i += 0.1) {
            printf("sqrt_newton(%f) = %.15f,", i, sqrt_newton(i));
            printf(" sqrt(%f) = %.15f,", i, sqrt(i));
            printf(" diff = %.15f\n", absolute(sqrt_newton(i) - sqrt(i)));
        }
    }
    if (run_test_s) {
        if (run_test_e == true) {
            printf("e() = %.15f,", e());
            printf(" M_E = %.15f,", M_E);
            printf(" diff = %.15f\n", absolute(M_E - e()));
            printf("e() terms = %d\n", e_terms());
        }
        if (run_test_r == true) {
            printf("pi_euler() = %.15f,", pi_euler());
            printf(" M_PI =  %.15f,", M_PI);
            printf(" diff = %.15f\n", absolute(M_PI - pi_euler()));
            printf("pi_euler() terms = %d\n", pi_euler_terms());
        }
        if (run_test_b == true) {
            printf("pi_bbp() = %.15f,", pi_bbp());
            printf(" M_PI =  %.15f,", M_PI);
            printf(" diff = %.15f\n", absolute(M_PI - pi_bbp()));
            printf("pi_bbp() terms = %d\n", pi_bbp_terms());
        }
        if (run_test_m == true) {
            printf("pi_madhava() = %.15f,", pi_madhava());
            printf(" M_PI =  %.15f,", M_PI);
            printf(" diff = %.15f\n", absolute(M_PI - pi_madhava()));
            printf("pi_madhava() terms = %d\n", pi_madhava_terms());
        }
        if (run_test_v == true) {
            printf("pi_viete() = %.15f,", pi_viete());
            printf(" M_PI =  %.15f,", M_PI);
            printf(" diff = %.15f\n", absolute(M_PI - pi_viete()));
            printf("pi_viete_factors() = %d\n", pi_viete_factors());
        }
        if (run_test_n == true) {
            for (double i = 0.0; i <= 10.0; i += 0.1) {
                printf("sqrt_newton(%f) = %.15f,", i, sqrt_newton(i));
                printf(" sqrt(%f) = %.15f,", i, sqrt(i));
                printf(" diff = %.15f\n", absolute(sqrt_newton(i) - sqrt(i)));
                printf("sqrt_newton() terms = %d\n", sqrt_newton_iters());
            }
        }
        if (run_test_e == false && run_test_b == false && run_test_m == false && run_test_r == false
            && run_test_v == false && run_test_n == false) {
            printf("SYNOPSIS\n"
                   "   A test harness for the small numerical library.\n"
                   "\n"
                   "USAGE\n"
                   "   ./mathlib-test [-aebmrvnsh]\n"
                   "\n"
                   "OPTIONS\n"
                   "  -a   Runs all tests \n"
                   "  -e   Runs e test\n"
                   "  -b   Runs BBP pi test\n"
                   "  -m   Runs Madhava pi test\n"
                   "  -r   Runs Euler pi test\n"
                   "  -v   Runs Viete pi test\n"
                   "  -n   Runs Newton square root test\n"
                   "  -s   Print verbose statistics\n"
                   "  -h   Display program synopsis and usage\n");
        }
    }

    if (run_test_h) {
        printf("SYNOPSIS\n"
               "   A test harness for the small numerical library.\n"
               "\n"
               "USAGE\n"
               "   ./mathlib-test [-aebmrvnsh]\n"
               "\n"
               "OPTIONS\n"
               "  -a   Runs all tests \n"
               "  -e   Runs e test\n"
               "  -b   Runs BBP pi test\n"
               "  -m   Runs Madhava pi test\n"
               "  -r   Runs Euler pi test\n"
               "  -v   Runs Viete pi test\n"
               "  -n   Runs Newton square root test\n"
               "  -s   Print verbose statistics\n"
               "  -h   Display program synopsis and usage\n");
    }
}
