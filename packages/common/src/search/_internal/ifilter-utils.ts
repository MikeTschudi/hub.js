import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { setProp, getProp } from "../../objects";
import { cloneObject } from "../../util";
import { expandFilter } from "../filter-utils";
import {
  IDateRange,
  IFilter,
  IMatchOptions,
  IPredicate,
  IQuery,
} from "../types";
import { valueToMatchOptions, relativeDateToDateRange } from "../utils";

export function expandPredicate(predicate: IPredicate): IPredicate {
  const result: IPredicate = {};
  const dateProps = ["created", "modified", "lastlogin"];
  const copyProps = [
    "filterType",
    "term",
    "searchUserAccess",
    "isopendata",
    "searchUserName",
  ];
  const nonMatchOptionsFields = [...dateProps, ...copyProps];
  // Do the conversion
  Object.entries(predicate).forEach(([key, value]) => {
    // Handle MatchOptions fields
    if (!nonMatchOptionsFields.includes(key)) {
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle Date fields
    if (dateProps.includes(key)) {
      const dateFieldValue = cloneObject(getProp(predicate, key));
      if (getProp(predicate, `${key}.type`) === "relative-date") {
        setProp(key, relativeDateToDateRange(dateFieldValue), result);
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
    // Handle fields that are just copied forward
    if (copyProps.includes(key) && predicate.hasOwnProperty(key)) {
      setProp(key, value, result);
    }
  });
  return result;
}

export function serializeQueryForPortal(query: IQuery): ISearchOptions {
  const filterSearchOptions = query.filters.map(serializeFilter);

  const result = mergeSearchOptions(filterSearchOptions, "AND");

  return result;
}

function mergeSearchOptions(
  options: ISearchOptions[],
  operation: "AND" | "OR"
): ISearchOptions {
  const result: ISearchOptions = options.reduce(
    (acc, entry) => {
      // walk the props
      Object.entries(entry).forEach(([key, value]) => {
        // if prop exists
        if (acc[key]) {
          // combine via operation
          acc[key] = `${acc[key]} ${operation} ${value}`;
        } else {
          // just copy the value
          acc[key] = value;
        }
      });

      return acc;
    },
    { q: "" }
  );

  return result;
}

/**
 * Serialize the filters in a FitlerGroup into a Portal Query
 * @param filter
 * @returns
 */
function serializeFilter(filter: IFilter): ISearchOptions {
  const operation = filter.operation || "AND";
  const predicates = filter.predicates.map(expandPredicate);
  const predicateSearchOptions = predicates.map(serializePredicate);
  // combine these searchOptions
  const searchOptions = mergeSearchOptions(predicateSearchOptions, operation);
  // wrap in parens if we have more than one predicate
  if (predicates.length > 1) {
    searchOptions.q = `(${searchOptions.q})`;
  }
  return searchOptions;
}
/**
 * Serialize a Filter into a Portal Query
 * @param predicate
 * @returns
 */
function serializePredicate(predicate: IPredicate): ISearchOptions {
  const dateProps = ["created", "modified"];
  const boolProps = ["isopendata"];
  const passThroughProps = ["searchUserAccess", "searchUserName"];
  const specialProps = [
    "filterType",
    "term",
    ...dateProps,
    ...boolProps,
    ...passThroughProps,
  ];
  const portalAllowList = [
    "access",
    "categories",
    "created",
    "description",
    "disabled",
    "email",
    "emailstatus",
    "firstname",
    "fullname",
    "group",
    "id",
    "isInvitationOnly",
    "isopendata",
    "joined",
    "lastlogin",
    "lastname",
    "memberType",
    "modified",
    "name",
    "orgid",
    "orgIds",
    "owner",
    "provider",
    "role",
    "searchUserAccess",
    "searchUserName",
    "snippet",
    "tags",
    "term",
    "type",
    "typekeywords",
    "userlicensetype",
    "username",
  ];
  let qCount = 0;
  // TODO: Look at using reduce vs .map and remove the `.filter`
  const opts = Object.entries(predicate)
    .map(([key, value]) => {
      // When serializing for portal we limit predicate properties to
      // a list of known properties that the portal api accepts. This will
      // not attempt to ensure the properties are used in the correct combinations
      if (portalAllowList.includes(key)) {
        const so: ISearchOptions = { q: "" };
        if (!specialProps.includes(key)) {
          qCount++;
          so.q = serializeMatchOptions(key, value);
        }
        if (dateProps.includes(key)) {
          qCount++;
          so.q = serializeDateRange(
            key,
            value as unknown as IDateRange<number>
          );
        }
        if (boolProps.includes(key)) {
          qCount++;
          so.q = `${key}:${value}`;
        }
        if (passThroughProps.includes(key)) {
          so[key] = value;
        }
        if (key === "term") {
          qCount++;
          so.q = value;
        }
        return so;
      }
    })
    .filter((e) => e !== undefined);

  // merge up all the searchOptions
  const searchOptions = mergeSearchOptions(opts, "AND");

  if (qCount > 1) {
    searchOptions.q = `(${searchOptions.q})`;
  }
  return searchOptions;
}

/**
 * Serialize MatchOptions into portal syntax
 * @param key
 * @param value
 * @returns
 */
function serializeMatchOptions(key: string, value: IMatchOptions): string {
  let result = "";
  if (value.any) {
    result = `${serializeStringOrArray("OR", key, value.any)}`;
  }
  if (value.all) {
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("AND", key, value.all)}`;
  }
  if (value.not) {
    // negate the entries if they are not
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("OR", `-${key}`, value.not)}`;
  }

  return result;
}

/**
 * Serialize a date-range into Portal syntax
 * @param key
 * @param range
 * @returns
 */
function serializeDateRange(key: string, range: IDateRange<number>): string {
  return `${key}:[${range.from} TO ${range.to}]`;
}

/**
 * Serialize a `string` or `string[]` into a string
 * @param join
 * @param key
 * @param value
 * @returns
 */
function serializeStringOrArray(
  join: "AND" | "OR",
  key: string,
  value: string | string[]
): string {
  let q = "";
  if (Array.isArray(value)) {
    q = `${key}:"${value.join(`" ${join} ${key}:"`)}"`;
    if (value.length > 1) {
      q = `(${q})`;
    }
  } else {
    q = `${key}:"${value}"`;
  }
  return q;
}
