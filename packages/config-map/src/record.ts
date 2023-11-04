export interface ConfigMapRecordContract extends Object {
  getAttribute<T>(propertyName: string): T;
  setAttribute<T>(propertyName: string, value: T): void;
}

export class ConfigMapRecord implements ConfigMapRecordContract {
  public getAttribute<T>(propertyName: string): T {
    return (this as any)[propertyName] as T;
  }

  public setAttribute<T>(propertyName: string, value: T): void {
    (this as any)[propertyName] = value;
  }
}
