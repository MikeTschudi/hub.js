import { IArcGISContext } from "..";
import { updateContent } from "../content";
import { updateDiscussion } from "../discussions";
import { updateInitiative } from "../initiatives";
import { updateProject } from "../projects";
import { updateSite } from "../sites";
import {
  HubEntity,
  HubEntityType,
  IHubDiscussion,
  IHubEditableContent,
  IHubInitiative,
  IHubProject,
  IHubSite,
} from "./types";

/**
 * centralized function to update a Hub entity - delegates
 * to the appropriate update function by entity type
 * @param type
 * @param entity
 * @param context
 * @returns
 */
export async function updateHubEntity(
  type: HubEntityType,
  entity: HubEntity,
  context: IArcGISContext
): Promise<HubEntity> {
  let result: HubEntity;
  switch (type) {
    case "project":
      result = await updateProject(
        entity as IHubProject,
        context.userRequestOptions
      );
      break;
    case "site":
      result = await updateSite(entity as IHubSite, context.hubRequestOptions);
      break;
    case "initiative":
      result = await updateInitiative(
        entity as IHubInitiative,
        context.userRequestOptions
      );
      break;
    case "discussion":
      result = await updateDiscussion(
        entity as IHubDiscussion,
        context.userRequestOptions
      );
      break;
    case "content":
      result = await updateContent(
        entity as IHubEditableContent,
        context.userRequestOptions
      );
  }
  return result;
}
