#include "universe.h"

#include <ncurses.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
struct Universe {
    uint32_t rows;
    uint32_t col;
    bool **grid;
    bool toroidal;
};
/*creates a universe based on specifications*/
Universe *uv_create(uint32_t rows, uint32_t cols, bool torodial) {
    Universe *univ = (Universe *) calloc(1, sizeof(Universe));
    univ->grid = (bool **) calloc(rows, sizeof(bool *));
    for (uint32_t i = 0; i < rows; i++) {
        univ->grid[i] = (bool *) calloc(cols, sizeof(bool));
    }
    univ->rows = rows;
    univ->col = cols;
    univ->toroidal = torodial;
    return univ;
}
/*deletes the galaxy by freeing memory*/
void uv_delete(Universe *u) {
    for (uint32_t i = 0; i < (u->rows); i++) {
        free(u->grid[i]);
    }
    free(u->grid);
    free(u);
}

/*returns number of rows in a specified universe*/
uint32_t uv_rows(Universe *u) {
    return u->rows;
}
/*returns number of cols in a specified universe*/
uint32_t uv_cols(Universe *u) {
    return u->col;
}
/*sets a cell to live*/
void uv_live_cell(Universe *u, uint32_t r, uint32_t c) {
    u->grid[r][c] = true;
}
/*sets a cell to be dead*/
void uv_dead_cell(Universe *u, uint32_t r, uint32_t c) {
    u->grid[r][c] = false;
}
/*returns bool value of given coordinate of a universe*/
bool uv_get_cell(Universe *u, uint32_t r, uint32_t c) {
    bool cell_get = u->grid[r][c];
    return cell_get;
}
/*populates a universe based on coordinates given by input txt file*/
bool uv_populate(Universe *u, FILE *infile) {
    uint32_t x;
    uint32_t y;

    while (!feof(infile)) {
        fscanf(infile, "%d %d", &y, &x);
        if (x > uv_rows(u) || x < 0 || y < 0 || y > uv_cols(u)) {
            return false;
        } else {
            uv_live_cell(u, y, x);
        }
    }
    return true;
}
/*returns number of neighbors of an input coord and considers if struct is toroidal*/
uint32_t uv_census(Universe *u, uint32_t r, uint32_t c) {
    uint32_t neighbors = 0;
    if (u->toroidal == true) {
        for (int32_t row_offset = -1; row_offset <= 1; row_offset++) {
            for (int32_t col_offset = -1; col_offset <= 1; col_offset++) {
                int32_t corr_row = r + row_offset;
                int32_t corr_col = c + col_offset;
                if (corr_row < 0) {
                    corr_row += uv_rows(u);
                }
                if (corr_row >= (int32_t) uv_rows(u)) {
                    corr_row = 0;
                }
                if (corr_col < 0) {
                    corr_col += uv_cols(u);
                }
                if (corr_col >= (int32_t) uv_cols(u)) {
                    corr_col = 0;
                }
                if (row_offset != 0 || col_offset != 0) {
                    if (uv_get_cell(u, corr_row, corr_col) == true) {
                        neighbors++;
                    }
                }
            }
        }
        return neighbors;
    }
    if (u->toroidal == false) {
        for (int32_t row_offset = -1; row_offset <= 1; row_offset++) {
            for (int32_t col_offset = -1; col_offset <= 1; col_offset++) {
                if (row_offset != 0 || col_offset != 0) {
                    int32_t corr_row = r + row_offset;
                    int32_t corr_col = c + col_offset;
                    if (corr_row < 0 || corr_row >= (int32_t) uv_rows(u)) {
                        continue;
                    }
                    if (corr_col < 0 || corr_col >= (int32_t) uv_cols(u)) {
                        continue;
                    }
                    if (uv_get_cell(u, corr_row, corr_col) == true) {
                        neighbors++;
                    }
                }
            }
        }
    }
    return neighbors;
}
/*prints output results to the output file specified*/
void uv_print(Universe *u, FILE *outfile) {
    for (uint32_t r = 0; r < uv_rows(u); r++) {
        for (uint32_t c = 0; c < uv_cols(u); c++) {
            if ((uv_get_cell(u, r, c) == true)) {
                fprintf(outfile, "o");
            } else {
                fprintf(outfile, ".");
            }
        }
        fprintf(outfile, "\n");
    }
}
