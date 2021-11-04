import { ISearchOptions } from "@esri/arcgis-rest-portal";
import {
  Filter,
  IGroupFilterDefinition,
  IMatchOptions,
  mergeSearchOptions,
  relativeDateToDateRange,
  serializeDateRange,
  serializeMatchOptions,
  valueToMatchOptions,
} from ".";
import { cloneObject, getProp, setProp } from "..";

export function expandGroupFilter(
  filter: IGroupFilterDefinition
): IGroupFilterDefinition {
  const result = {} as IGroupFilterDefinition;
  const dateProps = ["created", "modified"];
  // Some properties should not get converted to MatchOptions
  const specialProps = ["term", "searchUserAccess", ...dateProps];
  // Do the conversion

  Object.entries(filter).forEach(([key, value]) => {
    // handle Matchish fields
    if (!specialProps.includes(key)) {
      // setProp side-steps typescript complaining
      setProp(key, valueToMatchOptions(value), result);
    }
    // Handle date fields
    if (dateProps.includes(key)) {
      const dateFieldValue = cloneObject(getProp(filter, key));
      if (getProp(filter, `${key}.type`) === "relative-date") {
        setProp(key, relativeDateToDateRange(dateFieldValue), result);
      } else {
        setProp(key, dateFieldValue, result);
      }
    }
  });

  // searchUserAccess is boolean, so we check if the prop exists
  // vs checking if the value is truthy
  if (filter.hasOwnProperty("searchUserAccess")) {
    result.searchUserAccess = filter.searchUserAccess;
  }

  if (filter.term) {
    result.term = filter.term;
  }

  return result;
}

export function serializeGroupFilterForPortal(
  filter: IGroupFilterDefinition
): ISearchOptions {
  let result = {
    q: "",
    filter: "",
  } as ISearchOptions;

  const dateProps = ["created", "modified"];
  const specialProps = ["term", "searchUserAccess", "filterType", ...dateProps];
  Object.entries(filter).forEach(([key, value]) => {
    // MatchOptions fields
    if (!specialProps.includes(key)) {
      result = mergeSearchOptions(
        result,
        serializeMatchOptions(key, value),
        "AND"
      );
    }
    // Dates only go into q
    if (dateProps.includes(key)) {
      result = mergeSearchOptions(
        result,
        serializeDateRange(key, value),
        "AND"
      );
    }
  });
  // searchUserAccess is also a top-level property
  if (filter.hasOwnProperty("searchUserAccess")) {
    result.searchUserAccess = filter.searchUserAccess;
  }
  // add the term
  if (filter.term) {
    result.q = `${filter.term} ${result.q}`.trim();
  }
  return result;
}