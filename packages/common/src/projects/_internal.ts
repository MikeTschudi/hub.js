import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemThumbnailUrl } from "../resources";
import { IHubProject } from "../core";
import { IPropertyMap } from "../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../core/_internal/getBasePropertyMap";
import { IModel } from "../types";

/**
 * Given a model and a project, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param project
 * @param requestOptions
 * @returns
 */
export function computeProps(
  model: IModel,
  project: Partial<IHubProject>,
  requestOptions: IRequestOptions
): IHubProject {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  project.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  // Handle Dates
  project.createdDate = new Date(model.item.created);
  project.createdDateSource = "item.created";
  project.updatedDate = new Date(model.item.modified);
  project.updatedDateSource = "item.modified";
  // cast b/c this takes a partial but returns a full project
  return project as IHubProject;
}

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubProject
 * @returns
 * @private
 */
export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  // Type specific mappings
  map.push({ objectKey: "status", modelKey: "data.status" });
  map.push({ objectKey: "catalog", modelKey: "data.catalog" });
  map.push({ objectKey: "permissions", modelKey: "data.permissions" });
  map.push({ objectKey: "contacts", modelKey: "data.contacts" });
  map.push({ objectKey: "timeline", modelKey: "data.timeline" });

  return map;
}