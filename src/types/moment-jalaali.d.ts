
declare module "moment-jalaali" {
  interface MomentJalaali {
    isValid(): boolean;
    format(pattern?: string): string;
  }

  interface MomentJalaaliFactory {
    (
      input: string,
      format: string,
      strict?: boolean
    ): MomentJalaali;
  }

  const moment: MomentJalaaliFactory;

  export default moment;
}
