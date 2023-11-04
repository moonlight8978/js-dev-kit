export type ElementOf<A> = A extends readonly (infer T)[] ? T : never;

export type Initializable<T> = {
  new (): T;
};
