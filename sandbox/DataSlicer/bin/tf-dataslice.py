#!/usr/bin/env python

import argparse
import logging

from textflow.dataslice import slice

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")

SECONDS_PER_DAY = 3600*24


def main():
    (json_file, timeslice, json_file_out) = _process_cmd_line()

    # Do processing
    slice.do_slice(json_file, json_file_out, timeslice)


def _process_cmd_line():
    """
    Handle command-line args

    :return (str, int): json-file, timeslice (ms)
    """
    parser = argparse.ArgumentParser(description='Slice and dice JSON yo')

    parser.add_argument('--file', '-f', required=True,
                        help="Path of input JSON file")
    parser.add_argument('--timeslice', '-t', type=float, default=SECONDS_PER_DAY,
                        help="Timeslice size, in seconds. Fractional values allowed. Default is %s (1 day)" % SECONDS_PER_DAY)
    parser.add_argument('--output-timeslice', '-o', required=True,
                        help="Path of output JSON file for timeslice view")

    args = parser.parse_args()

    # Convert timeslice to integer # of milliseconds
    timeslice = int(args.timeslice * 1000)

    return args.file, timeslice, args.output_timeslice


if __name__ == "__main__":
    main()
