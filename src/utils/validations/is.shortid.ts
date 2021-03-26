import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isValid } from "shortid";

import * as Messages from "./messages";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsShortidConstraint implements ValidatorConstraintInterface {
  public validate = (id: string): Promise<boolean> =>
    new Promise((resolve) => {
      if (id) {
        if (isValid(id)) {
          return resolve(true);
        }

        return resolve(false);
      }
      return resolve(true);
    });

  public defaultMessage = () => Messages.SHORTID;
}

export function IsShortID(validationOptions?: ValidationOptions) {
  return function verify(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsShortidConstraint,
    });
  };
}
