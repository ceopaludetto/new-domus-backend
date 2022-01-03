import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { classToPlain } from "class-transformer";

import { ConnectionArguments } from "../graphql";

@Injectable()
export class ToPlainPipe implements PipeTransform {
  public transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype) || type !== "body") return value;

    return classToPlain(value, { enableImplicitConversion: true });
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object, ConnectionArguments];
    return !types.includes(metatype);
  }
}
