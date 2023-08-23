export interface BigServerError<Extensions = void> extends Error {
  extensions: Extensions;
  code: string;
  status: number;
}

export interface BigServerErrorConstructor<Extensions = void> {
  new (
    extensions: Extensions,
    options?: ErrorOptions
  ): BigServerError<Extensions>;
  readonly prototype: BigServerError<Extensions>;
}

export const createError = <Extensions = void>(
  code: string,
  message: string | ((extensions: Extensions) => string),
  status = 500
): BigServerErrorConstructor<Extensions> => {
  return class extends Error implements BigServerError<Extensions> {
    override name = "BigServerError";
    extensions: Extensions;
    code = code.toUpperCase();
    status = status;

    constructor(extensions: Extensions, options?: ErrorOptions) {
      const msg =
        typeof message === "string"
          ? message
          : message(extensions as Extensions);

      super(msg, options);

      this.extensions = extensions;
    }

    override toString() {
      return `${this.name} [${this.code}]: ${this.message}`;
    }
  };
};
