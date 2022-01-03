import { Transform } from "class-transformer";

export function ToLowerCase() {
  return Transform(({ value }) => (typeof value === "string" ? value.toLowerCase() : value));
}

export function Trim() {
  return Transform(({ value }) => (typeof value === "string" ? value.trim() : value));
}

export function RemoveMask() {
  return Transform(({ value }) => (typeof value === "string" ? value.replace(/[^\d]+/g, "") : value));
}
