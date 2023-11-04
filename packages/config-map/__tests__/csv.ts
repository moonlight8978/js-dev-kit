import * as path from "path";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { CsvContract } from "../src";

export class Csv implements CsvContract {
  public async getRows(file: string): Promise<Record<string, string>[]> {
    const filePath = path.join(__dirname, file);
    const rows = parse(fs.readFileSync(filePath, "utf-8"), {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, any>[];
    return rows;
  }
}
