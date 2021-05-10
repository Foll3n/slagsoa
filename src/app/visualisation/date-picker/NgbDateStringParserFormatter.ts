import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

// Formatter using "dd-MM-yyyy" string format:
export class NgbDateStringParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (!value) { // @ts-ignore
      return null; }
    const parts = value.trim().split('-');

    return <NgbDateStruct>{
      day: parts.length > 0 ? parseInt(parts[0], 10) : null,
      month: parts.length > 1 ? parseInt(parts[1], 10) : null,
      year: parts.length > 2 ? parseInt(parts[2], 10) : null,
    };
  }
  format(date: NgbDateStruct): string {
    const pad = (n: unknown) => Number.isInteger(n) ? ('0' + n).substr(-2) : '';
    return date ? `${pad(date.day)}-${pad(date.month)}-${date.year}` : '';
  }
}
