import { Initializable } from "@moonkit/types";
import { ConfigMapRecordContract } from "./record";
import { keyMetadataKey, getProviderMeta, getAttributes } from "./symbols";
import first from "lodash.first";
import last from "lodash.last";

export class ConfigMapCollection<T extends ConfigMapRecordContract> {
  private readonly keyToRecord: Map<string, T> = new Map<string, T>();
  private readonly records: T[] = [];
  private key: string | null = null;
  public slug?: string;

  constructor(records: T[], Type: Initializable<T>) {
    const instance = new Type();
    const key = getAttributes(Type).find(
      (propertyName) =>
        !!Reflect.getMetadata(keyMetadataKey, instance, propertyName)
    );

    this.slug = getProviderMeta(new Type())?.slug;

    if (key) {
      this.key = key;

      records.forEach((record) => {
        this.add(record);
      });
    }
  }

  public at(index: number): T | undefined {
    return this.records[index];
  }

  public all(): T[] {
    return this.records;
  }

  public values = this.all;

  public keys(): any[] {
    return Array.from(this.keyToRecord.keys());
  }

  public get<TKey>(key: TKey): T {
    this.checkKey(`${key}`);
    return this.tryGet(`${key}`)!;
  }

  public tryGet<TKey>(key: TKey): T | undefined {
    return this.keyToRecord.get(`${key}`);
  }

  public sole(): T {
    this.checkKey("sole");
    return this.keyToRecord.get("sole")!;
  }

  public map<TResult>(fn: (record: T) => TResult): TResult[] {
    return this.records.map(fn);
  }

  public forEach(fn: (record: T) => void): void {
    this.records.forEach(fn);
  }

  public filter(fn: (record: T) => boolean): T[] {
    return this.records.filter(fn);
  }

  public first(): T | undefined {
    return first(this.records);
  }

  public last(): T | undefined {
    return last(this.records);
  }

  public add(record: T) {
    this.records.push(record);
    if (this.key) {
      this.keyToRecord.set(`${record.getAttribute(this.key)}`, record);
    }
  }

  public get size() {
    return this.records.length;
  }

  public toJSON() {
    return this.records;
  }

  private checkKey(key: string) {
    if (!this.keyToRecord.has(key)) {
      throw new Error(`No record with key ${key}`);
    }
  }
}
