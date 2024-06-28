#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <assert.h>
#include "io.h"
#include "endian.h"
#include "code.h"

uint64_t total_syms = 0;
uint64_t total_bits = 0;

uint8_t input_buffer[BLOCK];
uint8_t output_buffer[BLOCK];
int curr_index = 0;
int last_index = 0;
int output_index = 0;
int bit_index = 0;
int output_bit_index = 0;

//HELPER FUNCTION TO REFILL INPUT BUFFER
static void help_refill(int infile) {
    last_index = read_bytes(infile, input_buffer, BLOCK);
    curr_index = 0;
}

//function to read bytes from infile
int read_bytes(int infile, uint8_t *buf, int to_read) {
    int bytes_read = 0;
    int reading = 0;
    while ((reading = read(infile, buf, to_read)) != 0) {
        if (reading == -1) {
            exit(EXIT_FAILURE);
        }
        bytes_read += reading;
        buf += reading;
        to_read -= reading;
    }
    return bytes_read;
}

//function to write bytes to outfile
int write_bytes(int outfile, uint8_t *buf, int to_write) {
    int bytes_written = 0;
    int wrote;
    while ((wrote = write(outfile, buf, to_write)) != 0) {
        if (wrote == -1) {
            fprintf(stderr, "Error failed to write to file because: %s\n", strerror(errno));
            exit(EXIT_FAILURE);
        }
        bytes_written += wrote;
        buf += wrote;
        to_write -= wrote;
    }
    return bytes_written;
}

//function to read header of infile
void read_header(int infile, FileHeader *header) {
    read_bytes(infile, (uint8_t *) header, sizeof(header));
    if (big_endian() == true) {
        header->magic = swap32(header->magic);
        header->protection = swap16(header->protection);
    }
    if ((header->magic) != MAGIC) {
        exit(EXIT_FAILURE);
    }
}

//function to write the header of outfile
void write_header(int outfile, FileHeader *header) {
    if (big_endian() == true) {
        header->magic = swap32(header->magic);
        header->protection = swap16(header->protection);
    }
    write_bytes(outfile, (uint8_t *) header, sizeof(header));
}

//function that reads symbols from infile and returns a bool if there are more items to read
bool read_sym(int infile, uint8_t *sym) {
    if (curr_index == last_index) {
        help_refill(infile);
    }

    if (curr_index == last_index) {
        return false;
    }
    *sym = input_buffer[curr_index];
    curr_index++;
    total_syms++;
    return true;
}

//helper function to read 1 bit
static bool read_bit(int infile) {
    if (bit_index == 8) {
        bit_index = 0;
        curr_index++;
    }
    if (curr_index == last_index) {
        help_refill(infile);
        //assert(last_index != 0);
    }
    uint8_t x = 1 << bit_index;
    uint8_t y = x & input_buffer[curr_index];
    total_bits++;
    bit_index++;
    return y != 0;
}

//helper function to write 1 bit
static void write_bit(int outfile, bool bit) {
    if (output_bit_index == 8) {
        output_bit_index = 0;
        output_index++;
    }
    if (output_index == BLOCK) {
        flush_pairs(outfile);
    }
    uint8_t x = output_buffer[output_index];
    if (bit) {
        x = x | 1 << output_bit_index;
    }
    if (bit == false) {
        x = x & ((0xFF << (output_bit_index + 1)) | (0xFF >> (8 - output_bit_index)));
    }
    output_buffer[output_index] = x;
    output_bit_index++;
    total_bits++;
}

//function to write a pair to outfile- a code/word and symbol
void write_pair(int outfile, uint16_t code, uint8_t sym, int bitlen) {
    uint16_t bit;
    for (int i = 0; i < bitlen; i++) {
        bit = code & (1 << i);
        write_bit(outfile, bit != 0);
    }
    for (int i = 0; i < 8; i++) {
        bit = sym & (1 << i);
        write_bit(outfile, bit != 0);
    }
}

//writes out any remaining pairs of symbols and codes to the output file
void flush_pairs(int outfile) {
    if (output_bit_index == 0) {
        write_bytes(outfile, output_buffer, output_index);
    } else {
        output_buffer[output_index]
            = output_buffer[output_index] & (0xFF >> (8 - output_bit_index));
        write_bytes(outfile, output_buffer, output_index + 1);
    }

    output_index = 0;
    output_bit_index = 0;
}

//reads a pair - code/word and symbol
bool read_pair(int infile, uint16_t *code, uint8_t *sym, int bitlen) {
    uint16_t bit;
    *code = 0;
    *sym = 0;
    for (int i = 0; i < bitlen; i++) {
        bit = read_bit(infile);
        *code = *code | (bit << i);
    }
    for (int i = 0; i < 8; i++) {
        bit = read_bit(infile);
        *sym = *sym | (bit << i);
    }
    if (*code == STOP_CODE) {
        return false;
    } else {
        return *code;
    }
}

//writes a word to outfile
void write_word(int outfile, Word *w) {
    for (uint32_t i = 0; i < (w->len); i++) {
        if (output_index == BLOCK) {
            flush_words(outfile);
        }
        output_buffer[output_index] = w->syms[i];
        output_index++;
    }
    total_syms += (w->len);
}

//flushes any remaining words in buffer to outfile
void flush_words(int outfile) {
    write_bytes(outfile, output_buffer, output_index);
    output_index = 0;
}
